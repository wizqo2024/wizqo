import { promises as fs } from 'fs';

const HISTORY_PATH = process.env.VIDEO_HISTORY_PATH || '/tmp/video-history.json';
const PUBLISHED_AFTER_ISO = '2020-01-01T00:00:00Z';

function isoDurationToSeconds(iso) {
  const match = String(iso || '').match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

async function readHistory() {
  try {
    const buf = await fs.readFile(HISTORY_PATH, 'utf8');
    const parsed = JSON.parse(buf);
    if (parsed && typeof parsed === 'object' && parsed.hobbies) return parsed;
  } catch {}
  return { hobbies: {} };
}

async function writeHistory(data) {
  try {
    await fs.writeFile(HISTORY_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
}

function pruneOldEntries(entries, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return (entries || []).filter(e => new Date(e.chosenAt).getTime() >= cutoff);
}

function buildSearchQueries(hobby, day) {
  const base = [
    `${hobby} tutorial`,
    `${hobby} course`,
    `${hobby} guide`
  ];
  const dayTopics = ['basics', 'practice', 'skills', 'application', 'advanced', 'creative', 'mastery'];
  const focus = typeof day === 'number' && day >= 1 && day <= 7 ? dayTopics[(day - 1) % dayTopics.length] : '';
  return base.map(q => `${q} ${focus}`.trim());
}

async function ytFetch(path, params) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('missing_youtube_api_key');
  const qs = new URLSearchParams({ ...params, key });
  const url = `https://www.googleapis.com/youtube/v3/${path}?${qs.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`yt_${path}_${res.status}`);
  return res.json();
}

async function searchCandidates(hobby, day) {
  const queries = buildSearchQueries(hobby, day);
  const allIds = new Set();
  for (const q of queries) {
    for (const bucket of ['medium', 'long']) {
      const search = await ytFetch('search', {
        part: 'snippet',
        type: 'video',
        q,
        maxResults: '25',
        videoDuration: bucket,
        videoEmbeddable: 'true',
        publishedAfter: PUBLISHED_AFTER_ISO,
        relevanceLanguage: 'en'
      });
      (search.items || []).forEach(it => {
        const id = it && it.id && it.id.videoId;
        if (id) allIds.add(id);
      });
    }
  }
  const ids = Array.from(allIds);
  const batches = [];
  for (let i = 0; i < ids.length; i += 50) batches.push(ids.slice(i, i + 50));
  const details = [];
  for (const batch of batches) {
    const j = await ytFetch('videos', {
      part: 'snippet,contentDetails,statistics,status',
      id: batch.join(',')
    });
    details.push(...(j.items || []));
  }
  const filtered = [];
  for (const v of details) {
    const durationSec = isoDurationToSeconds(v && v.contentDetails && v.contentDetails.duration);
    const minutes = durationSec / 60;
    const views = Number(v && v.statistics && v.statistics.viewCount || 0);
    const publishedAt = v && v.snippet && v.snippet.publishedAt || '1970-01-01T00:00:00Z';
    const isPublic = v && v.status && v.status.privacyStatus === 'public';
    const processed = v && v.status && v.status.uploadStatus === 'processed';
    const embeddable = !(v && v.status && v.status.embeddable === false);
    const notLive = !(v && v.snippet && v.snippet.liveBroadcastContent === 'live');
    const after2020 = new Date(publishedAt).getTime() >= new Date(PUBLISHED_AFTER_ISO).getTime();
    if (minutes >= 5 && minutes <= 50 && views >= 5000 && isPublic && processed && embeddable && notLive && after2020) {
      filtered.push({
        id: v.id,
        title: v && v.snippet && v.snippet.title || '',
        url: `https://www.youtube.com/watch?v=${v.id}`,
        channelTitle: v && v.snippet && v.snippet.channelTitle || '',
        publishedAt,
        durationIso: v && v.contentDetails && v.contentDetails.duration || 'PT0S',
        viewCount: views
      });
    }
  }
  filtered.sort((a, b) => {
    if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  return filtered;
}

export async function getBestUniqueVideoForHobby(hobby, day) {
  const key = String(hobby || '').toLowerCase().trim();
  if (!key) throw new Error('missing_hobby');
  const history = await readHistory();
  const recent = pruneOldEntries((history.hobbies[key] || []), 7);
  const recentIds = new Set(recent.map(e => e.id));
  const candidates = await searchCandidates(key, day);
  const unique = candidates.find(v => !recentIds.has(v.id));
  const chosen = unique || candidates[0] || null;
  if (!chosen) return null;
  const updated = pruneOldEntries([...recent, { id: chosen.id, chosenAt: new Date().toISOString() }], 7);
  history.hobbies[key] = updated;
  await writeHistory(history);
  return chosen;
}


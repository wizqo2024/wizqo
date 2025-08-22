export type AffiliateProduct = { title: string; link: string; price: string };

const memoryCache = new Map<string, string[]>();
const AFFILIATE_TAG = 'wizqohobby-20';

const groupKeywords: Record<string, string[]> = {
	music: ['beginner instrument', 'tuner', 'metronome', 'practice book', 'strings'],
	art: ['starter kit', 'brush set', 'canvas', 'sketchbook', 'pencils'],
	gardening: ['pruning shears', 'soil mix', 'watering can', 'tool set'],
	yoga: ['yoga mat', 'yoga blocks', 'yoga strap'],
	photography: ['tripod', 'sd card', 'cleaning kit'],
	coding: ['beginner book', 'arduino kit', 'raspberry pi kit'],
};

const hobbyToGroup: Array<{pattern: RegExp; group: keyof typeof groupKeywords}> = [
	{ pattern: /(guitar|piano|violin|ukulele|drum|singing)/i, group: 'music' },
	{ pattern: /(paint|draw|sketch|art|watercolor|acrylic)/i, group: 'art' },
	{ pattern: /(garden|bonsai|plant|horticult)/i, group: 'gardening' },
	{ pattern: /(yoga|pilates)/i, group: 'yoga' },
	{ pattern: /(photo|camera)/i, group: 'photography' },
	{ pattern: /(coding|program|javascript|python|arduino|raspberry)/i, group: 'coding' },
];

const verbToTool: Array<{pattern: RegExp; tools: string[]}> = [
	{ pattern: /prun|trim|cut/i, tools: ['pruning shears', 'concave cutter'] },
	{ pattern: /wire/i, tools: ['training wire'] },
	{ pattern: /tune/i, tools: ['clip-on tuner'] },
	{ pattern: /practice|exercise/i, tools: ['practice kit', 'beginner kit'] },
	{ pattern: /sketch|draw/i, tools: ['graphite pencil set', 'kneaded eraser', 'sketchbook'] },
	{ pattern: /paint/i, tools: ['acrylic paint set', 'brush set', 'canvas panels'] },
];

function guessGroup(hobby: string): string[] {
	for (const { pattern, group } of hobbyToGroup) {
		if (pattern.test(hobby)) return groupKeywords[group];
	}
	return [`${hobby} starter kit`, `${hobby} tools`, `${hobby} accessories`];
}

function extractToolsFromText(texts: string[]): string[] {
	const lower = texts.join(' \n ').toLowerCase();
	const tools = new Set<string>();
	for (const { pattern, tools: t } of verbToTool) {
		if (pattern.test(lower)) t.forEach(x => tools.add(x));
	}
	return Array.from(tools);
}

function buildQueries(hobby: string, base: string[], extracted: string[], extra: string[]): string[] {
	const focus = extra.filter(Boolean);
	const variants = [...extracted, ...base];
	const queries = variants.slice(0, 4).map(v => [hobby, v, ...focus].join(' ').replace(/\s+/g, ' ').trim());
	return Array.from(new Set(queries)).slice(0, 3);
}

async function llmSuggestQueries(hobby: string, context: string): Promise<string[] | null> {
	try {
		const key = process.env.OPENROUTER_API_KEY;
		if (!key) return null;
		const body = {
			model: 'deepseek/deepseek-chat',
			messages: [
				{ role: 'system', content: 'Suggest 3 Amazon search queries as a JSON array of strings. No markdown.' },
				{ role: 'user', content: `Hobby: ${hobby}\nContext: ${context}\nRules: Avoid "day" terms. Prefer tools/kits/accessories. Output JSON array only.` }
			],
			max_tokens: 120,
			temperature: 0.4
		};
		const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${key}`,
				'HTTP-Referer': process.env.WEB_ORIGIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://wizqo.com'),
				'X-Title': 'Wizqo Affiliate Suggestions'
			},
			body: JSON.stringify(body)
		});
		if (!r.ok) return null;
		const j = await r.json();
		let content = j?.choices?.[0]?.message?.content || '';
		content = String(content).trim().replace(/^```json\s*/i, '').replace(/^```/i, '').replace(/```$/i, '');
		const arr = JSON.parse(content);
		if (Array.isArray(arr) && arr.every((s: any) => typeof s === 'string')) return arr.slice(0, 3);
		return null;
	} catch { return null; }
}

export async function generateAffiliateProducts(
	hobby: string,
	objectiveOrTitle: string,
	steps: string[] = [],
	dayNumber: number
): Promise<AffiliateProduct[]> {
	const cacheKey = `${hobby}::${objectiveOrTitle}::${steps.slice(0,3).join('|')}`.toLowerCase();
	let queries = memoryCache.get(cacheKey) || [];

	if (queries.length === 0) {
		const base = guessGroup(hobby);
		const extracted = extractToolsFromText([objectiveOrTitle, ...steps]);
		const extras: string[] = [];
		if (/beginner|start|intro|fundamental/i.test(objectiveOrTitle)) extras.push('beginner');
		queries = buildQueries(hobby, base, extracted, extras);

		if (queries.length === 0) {
			const llm = await llmSuggestQueries(hobby, `${objectiveOrTitle}\nSteps: ${steps.slice(0,3).join(' | ')}`);
			if (llm && llm.length) queries = llm;
		}

		if (queries.length) memoryCache.set(cacheKey, queries);
	}

	const products: AffiliateProduct[] = queries.slice(0, 2).map((q, idx) => ({
		title: q,
		link: `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${AFFILIATE_TAG}`,
		price: `$${(19 + (dayNumber - 1) * 5 + idx * 3).toFixed(2)}`
	}));
	return products;
}
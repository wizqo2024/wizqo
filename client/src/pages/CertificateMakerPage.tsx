import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function CertificateMakerPage() {
  const [recipient, setRecipient] = React.useState<string>('');
  const [awardTitle, setAwardTitle] = React.useState<string>('Certificate of Achievement');
  const [reason, setReason] = React.useState<string>('For outstanding effort and kindness');
  const [date, setDate] = React.useState<string>('');
  const [issuer, setIssuer] = React.useState<string>('');
  const [signatureImage, setSignatureImage] = React.useState<string | null>(null);
  const [signatureMode, setSignatureMode] = React.useState<'text' | 'upload' | 'draw'>('text');
  const [showSignatureDrawer, setShowSignatureDrawer] = React.useState<boolean>(false);
  const signatureCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState<boolean>(false);
  const [isDownloadingPNG, setIsDownloadingPNG] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<'classic' | 'rainbow' | 'space' | 'animals' | 'gold' | 'confetti'>('classic');

  // Initialize canvas when signature drawer opens
  React.useEffect(() => {
    if (showSignatureDrawer && signatureCanvasRef.current) {
      const ctx = signatureCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, signatureCanvasRef.current.width, signatureCanvasRef.current.height);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [showSignatureDrawer]);
  const [fontStyle, setFontStyle] = React.useState<'print' | 'cursive' | 'serif' | 'comic' | 'handwritten'>('print');
  const [textColorOverride, setTextColorOverride] = React.useState<string>('');
  const [accentColorOverride, setAccentColorOverride] = React.useState<string>('');
  const [templateStyle, setTemplateStyle] = React.useState<'simple' | 'ribbon' | 'medal' | 'trophy' | 'academic'>('simple');
  const [badgeIcon, setBadgeIcon] = React.useState<'none' | 'gold-seal' | 'silver-seal' | 'blue-ribbon' | 'green-laurel' | 'red-medal' | 'starburst' | 'shield'>('gold-seal');
  const [inkFriendly, setInkFriendly] = React.useState<boolean>(false);
  const [bgStyle, setBgStyle] = React.useState<'none' | 'wavy' | 'bands' | 'rosette' | 'sparkle' | 'sunburst'>('none');
  const [showSeal, setShowSeal] = React.useState<boolean>(false);
  const [sealStyle, setSealStyle] = React.useState<'classic-official' | 'notary' | 'academic' | 'government' | 'corporate' | 'medallion'>('classic-official');

  const colors = React.useMemo(() => {
    const base = (obj: any) => inkFriendly ? { ...obj, border: '#64748b', accent: '#111827', badge: '#64748b' } : obj;
    switch (theme) {
      case 'rainbow': return base({ border: '#f59e0b', accent: '#8b5cf6', text: '#111827', badge: '#ef4444' });
      case 'space': return base({ border: '#0ea5e9', accent: '#14b8a6', text: '#0f172a', badge: '#6366f1' });
      case 'animals': return base({ border: '#22c55e', accent: '#f97316', text: '#111827', badge: '#10b981' });
      case 'gold': return base({ border: '#d4af37', accent: '#b7791f', text: '#111827', badge: '#fbbf24' });
      case 'confetti': return base({ border: '#fb7185', accent: '#22d3ee', text: '#111827', badge: '#f59e0b' });
      default: return base({ border: '#64748b', accent: '#0ea5e9', text: '#0f172a', badge: '#f59e0b' });
    }
  }, [theme, inkFriendly]);

  const fontStacks = React.useMemo(() => ({
    print: "'Inter', 'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial, sans-serif",
    cursive: "'Pacifico', 'Dancing Script', 'Brush Script MT', 'Segoe Script', 'Snell Roundhand', cursive",
    serif: "'Playfair Display', 'Merriweather', Georgia, 'Times New Roman', serif",
    comic: "'Comic Neue', 'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', cursive",
    handwritten: "'Patrick Hand', 'Indie Flower', 'Handlee', 'Bradley Hand', cursive"
  }), []);

  const effective = React.useMemo(() => ({
    text: textColorOverride || colors.text,
    accent: accentColorOverride || colors.accent,
    fontFamily: fontStacks[fontStyle]
  }), [textColorOverride, accentColorOverride, colors, fontStyle, fontStacks]);

  const formattedDate = React.useMemo(() => {
    if (!date) return '';
    // HTML date input returns YYYY-MM-DD; format to "Mon D, YYYY"
    try {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      }
      return date;
    } catch {
      return date;
    }
  }, [date]);

  function printPreview() {
    try {
      const sheet = document.getElementById('certificate-sheet');
      if (!sheet) return;
      const svg = sheet.querySelector('svg');
      const content = svg ? (svg as SVGElement).outerHTML : sheet.innerHTML;
      const html = `<!doctype html><html><head><meta charset="utf-8"/>
<title>Print</title>
<style>
  @page { size: 11in 8.5in; margin: 0; }
  html, body { margin: 0; padding: 0; width: 11in; height: 8.5in; }
  #frame { position: relative; width: 11in; height: 8.5in; overflow: hidden; background: #fff; }
  svg { position: absolute; left: 0.25in; top: 0.25in; width: 10.5in; height: 8in; }
</style>
</head><body><div id="frame">${content}</div></body></html>`;
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      doc.open();
      doc.write(html);
      doc.close();
      const doPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {}
        setTimeout(() => { try { document.body.removeChild(iframe); } catch {} }, 1000);
      };
      if (iframe.contentWindow?.document.readyState === 'complete') doPrint();
      else iframe.onload = doPrint;
    } catch {}
  }

  function downloadPNG() {
    try {
      const sheet = document.getElementById('certificate-sheet');
      if (!sheet) {
        alert('Certificate not found. Please refresh the page and try again.');
        console.error('Certificate sheet not found');
        return;
      }
      const svg = sheet.querySelector('svg');
      if (!svg) {
        alert('SVG not found. Please refresh the page and try again.');
        console.error('SVG not found');
        return;
      }

      // Show loading indicator
      setIsDownloadingPNG(true);

      // Clone the SVG to avoid modifying the original
      const svgClone = svg.cloneNode(true) as SVGElement;
      
      // Get SVG dimensions
      const viewBox = svgClone.getAttribute('viewBox');
      const [x, y, width, height] = viewBox ? viewBox.split(' ').map(Number) : [0, 0, 1120, 800];
      
      // Ensure all images in the SVG are loaded and converted to data URLs
      const images = svgClone.querySelectorAll('image');
      const imagePromises: Promise<void>[] = [];
      
      images.forEach((img) => {
        const href = img.getAttribute('href') || img.getAttribute('xlink:href');
        if (href && href.startsWith('data:')) {
          // Already a data URL, no conversion needed
          return;
        }
        
        if (href) {
          const promise = new Promise<void>((resolve) => {
            const imgElement = new Image();
            imgElement.crossOrigin = 'anonymous';
            imgElement.onload = () => {
              try {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = imgElement.width || 200;
                tempCanvas.height = imgElement.height || 50;
                const tempCtx = tempCanvas.getContext('2d');
                if (tempCtx) {
                  tempCtx.drawImage(imgElement, 0, 0);
                  const dataURL = tempCanvas.toDataURL('image/png');
                  img.setAttribute('href', dataURL);
                  img.removeAttribute('xlink:href');
                }
                resolve();
              } catch (error) {
                console.error('Error converting image to data URL:', error);
                resolve(); // Continue even if one image fails
              }
            };
            imgElement.onerror = () => {
              console.error('Error loading image:', href);
              resolve(); // Continue even if image fails to load
            };
            imgElement.src = href;
          });
          imagePromises.push(promise);
        }
      });

      // Wait for all images to be converted, then proceed
      Promise.all(imagePromises).then(() => {
        try {
          // Create a canvas
          const canvas = document.createElement('canvas');
          const scale = 2; // Higher resolution (2x)
          canvas.width = width * scale;
          canvas.height = height * scale;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            alert('Could not create canvas. Please try a different browser.');
            console.error('Could not get canvas context');
            setIsDownloadingPNG(false);
            return;
          }

          // Set white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Convert SVG to image - ensure proper namespace
          const svgData = new XMLSerializer().serializeToString(svgClone);
          // Fix namespace issues
          const fixedSvgData = svgData.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');
          const svgBlob = new Blob([fixedSvgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);

          const img = new Image();
          img.onload = () => {
            try {
              // Draw the image on canvas
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              URL.revokeObjectURL(url);

              // Convert canvas to blob and download
              canvas.toBlob((blob) => {
                if (!blob) {
                  alert('Failed to create PNG file. Please try again.');
                  console.error('Failed to create blob');
                  setIsDownloadingPNG(false);
                  return;
                }
                const downloadUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                const filename = `certificate-${recipient ? recipient.replace(/[^a-z0-9]/gi, '-').toLowerCase() : 'certificate'}-${Date.now()}.png`;
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                  document.body.removeChild(link);
                  URL.revokeObjectURL(downloadUrl);
                  setIsDownloadingPNG(false);
                }, 100);
              }, 'image/png', 1.0);
            } catch (error) {
              console.error('Error creating PNG:', error);
              alert('Error creating PNG: ' + (error instanceof Error ? error.message : 'Unknown error'));
              URL.revokeObjectURL(url);
              setIsDownloadingPNG(false);
            }
          };
          img.onerror = (error) => {
            console.error('Error loading SVG image:', error);
            alert('Failed to load SVG. Please try again.');
            URL.revokeObjectURL(url);
            setIsDownloadingPNG(false);
          };
          img.src = url;
        } catch (error) {
          console.error('Error in PNG conversion:', error);
          alert('Error converting to PNG: ' + (error instanceof Error ? error.message : 'Unknown error'));
          setIsDownloadingPNG(false);
        }
      }).catch((error) => {
        console.error('Error processing images:', error);
        alert('Error processing images: ' + (error instanceof Error ? error.message : 'Unknown error'));
        setIsDownloadingPNG(false);
      });
    } catch (error) {
      console.error('Download PNG error:', error);
      alert('Failed to download PNG: ' + (error instanceof Error ? error.message : 'Unknown error') + '. Please try again or use Print/Save as PDF instead.');
      setIsDownloadingPNG(false);
    }
  }

  const reactId = React.useId();
  const backgroundClipId = React.useMemo(() => `certificate-bg-${reactId.replace(/:/g, '')}`, [reactId]);
  const goldGradientId = React.useMemo(() => `${backgroundClipId}-gold-gradient`, [backgroundClipId]);

  const backgroundLayers = React.useMemo(() => {
    const baseResult = { defs: null as React.ReactNode, content: null as React.ReactNode };
    if (bgStyle === 'none') return baseResult;

    const paletteAccent = inkFriendly ? '#94a3b8' : colors.accent;
    const paletteBadge = inkFriendly ? '#cbd5f5' : colors.badge;
    const paletteText = inkFriendly ? '#64748b' : colors.text;

    if (bgStyle === 'bands') {
      const gradientId = `${backgroundClipId}-bands-gradient`;
      const stripeGradientId = `${backgroundClipId}-bands-stripe`;
      const patternId = `${backgroundClipId}-bands-pattern`;
      const defs = (
        <>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(20)">
            <stop offset="0%" stopColor={inkFriendly ? '#f1f5f9' : '#e0f2fe'} />
            <stop offset="100%" stopColor={inkFriendly ? '#e2e8f0' : '#fee2f2'} />
          </linearGradient>
          <linearGradient id={stripeGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={inkFriendly ? '#94a3b8' : '#4f46e5'} stopOpacity={inkFriendly ? 0.28 : 0.6} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <pattern id={patternId} width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="12" r="2" fill={inkFriendly ? '#64748b' : '#22d3ee'} opacity={inkFriendly ? 0.2 : 0.45} />
            <circle cx="36" cy="40" r="1.6" fill={inkFriendly ? '#475569' : '#fdba74'} opacity={inkFriendly ? 0.15 : 0.35} />
            <path d="M-5 65 L65 -5" stroke={inkFriendly ? '#cbd5f5' : '#a855f7'} strokeOpacity={inkFriendly ? 0.12 : 0.25} strokeWidth="1.2" />
          </pattern>
        </>
      );

      const content = (
        <g aria-hidden="true">
          <rect x="24" y="24" width="1072" height="752" fill={`url(#${gradientId})`} opacity={inkFriendly ? 0.45 : 0.7} />
          <g transform="rotate(-18 560 400)" opacity={inkFriendly ? 0.5 : 0.75}>
            {[0, 1, 2, 3, 4, 5].map(index => (
              <rect
                key={`band-${index}`}
                x={-340 + index * 140}
                y={40 + index * 68}
                width={1380}
                height={index % 2 === 0 ? 120 : 72}
                rx={36}
                fill={index % 2 === 0 ? paletteAccent : paletteBadge}
                opacity={inkFriendly ? 0.32 : 0.55 - index * 0.04}
              />
            ))}
            <rect x={-420} y={110} width={1500} height={160} fill={`url(#${stripeGradientId})`} opacity={inkFriendly ? 0.3 : 0.55} />
          </g>
          <rect x="24" y="24" width="1072" height="752" fill={`url(#${patternId})`} opacity={inkFriendly ? 0.2 : 0.35} />
        </g>
      );

      return { defs, content };
    }

    if (bgStyle === 'wavy') {
      const gradientId = `${backgroundClipId}-wavy-gradient`;
      const crestGradientId = `${backgroundClipId}-wavy-crest`;
      const bubbleGradientId = `${backgroundClipId}-wavy-bubble`;
      const defs = (
        <>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={inkFriendly ? '#f1f5f9' : '#e0f2fe'} />
            <stop offset="100%" stopColor={inkFriendly ? '#e2e8f0' : '#fff7ed'} />
          </linearGradient>
          <linearGradient id={crestGradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={paletteAccent} stopOpacity={inkFriendly ? 0.4 : 0.65} />
            <stop offset="100%" stopColor={paletteBadge} stopOpacity={inkFriendly ? 0.2 : 0.4} />
          </linearGradient>
          <radialGradient id={bubbleGradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={paletteBadge} stopOpacity={inkFriendly ? 0.38 : 0.55} />
            <stop offset="65%" stopColor={paletteAccent} stopOpacity={inkFriendly ? 0.22 : 0.35} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </>
      );

      const content = (
        <g aria-hidden="true">
          <rect x="24" y="24" width="1072" height="752" fill={`url(#${gradientId})`} opacity={inkFriendly ? 0.5 : 0.75} />
          <path
            d="M24 230 C224 90 404 310 604 210 C804 110 1004 290 1096 170 L1096 24 L24 24 Z"
            fill={`url(#${crestGradientId})`}
            opacity={inkFriendly ? 0.45 : 0.7}
          />
          <path
            d="M24 650 C214 580 404 740 604 640 C804 540 1004 660 1096 600 L1096 776 L24 776 Z"
            fill={paletteBadge}
            opacity={inkFriendly ? 0.35 : 0.55}
          />
          {[{ cx: 240, cy: 320, r: 190 }, { cx: 820, cy: 260, r: 150 }, { cx: 660, cy: 570, r: 200 }, { cx: 980, cy: 420, r: 120 }].map((bubble, index) => (
            <circle key={`bubble-${index}`} cx={bubble.cx} cy={bubble.cy} r={bubble.r} fill={`url(#${bubbleGradientId})`} opacity={inkFriendly ? 0.28 : 0.45} />
          ))}
          <g stroke={paletteText} strokeOpacity={inkFriendly ? 0.3 : 0.38} fill="none" strokeWidth="1.5">
            <path d="M150 360 C300 250 430 330 550 210" />
            <path d="M320 520 C490 430 640 520 820 430" />
            <path d="M520 670 C660 590 800 660 950 560" />
          </g>
        </g>
      );

      return { defs, content };
    }

    if (bgStyle === 'rosette') {
      const radialGradientId = `${backgroundClipId}-rosette-radial`;
      const spokeGradientId = `${backgroundClipId}-rosette-spoke`;
      const sparkleGradientId = `${backgroundClipId}-rosette-sparkle`;
      const defs = (
        <>
          <radialGradient id={radialGradientId} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={inkFriendly ? '#f8fafc' : '#fff7ed'} />
            <stop offset="80%" stopColor={inkFriendly ? '#e2e8f0' : '#fde2ff'} stopOpacity={inkFriendly ? 0.55 : 0.75} />
            <stop offset="100%" stopColor={inkFriendly ? '#cbd5e1' : '#f1f5f9'} stopOpacity={inkFriendly ? 0.35 : 0.45} />
          </radialGradient>
          <linearGradient id={spokeGradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={paletteAccent} stopOpacity={inkFriendly ? 0.35 : 0.55} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <radialGradient id={sparkleGradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={inkFriendly ? '#f8fafc' : '#fff'} stopOpacity={0.8} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </>
      );

      const content = (
        <g aria-hidden="true">
          <circle cx={560} cy={400} r={320} fill={`url(#${radialGradientId})`} opacity={inkFriendly ? 0.6 : 0.85} />
          {Array.from({ length: 36 }).map((_, index) => (
            <path
              key={`spoke-${index}`}
              d="M560 400 L560 120 A280 280 0 0 1 560 400"
              fill={`url(#${spokeGradientId})`}
              transform={`rotate(${(360 / 36) * index} 560 400)`}
              opacity={inkFriendly ? 0.35 : 0.52}
            />
          ))}
          {Array.from({ length: 20 }).map((_, index) => (
            <circle
              key={`ring-${index}`}
              cx={560}
              cy={400}
              r={90 + index * 14}
              stroke={paletteAccent}
              strokeOpacity={inkFriendly ? 0.3 : 0.42 - index * 0.012}
              strokeWidth={index % 2 === 0 ? 2.4 : 1.4}
              fill="none"
            />
          ))}
          <circle cx={560} cy={400} r={130} fill={`url(#${sparkleGradientId})`} opacity={inkFriendly ? 0.45 : 0.6} />
        </g>
      );

      return { defs, content };
    }

    if (bgStyle === 'sparkle') {
      const gradientId = `${backgroundClipId}-sparkle-base`;
      const sparklePatternId = `${backgroundClipId}-sparkle-pattern`;
      const defs = (
        <>
          <radialGradient id={gradientId} cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor={inkFriendly ? '#f8fafc' : '#fff7ed'} />
            <stop offset="65%" stopColor={inkFriendly ? '#e2e8f0' : '#ffe4e6'} stopOpacity={inkFriendly ? 0.55 : 0.7} />
            <stop offset="100%" stopColor={inkFriendly ? '#cbd5e1' : '#fde68a'} stopOpacity={inkFriendly ? 0.35 : 0.5} />
          </radialGradient>
          <pattern id={sparklePatternId} width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 0 L48 24 L72 32 L48 40 L40 64 L32 40 L8 32 L32 24 Z" fill={paletteAccent} fillOpacity={inkFriendly ? 0.2 : 0.45} />
            <circle cx="18" cy="18" r="4" fill={paletteBadge} opacity={inkFriendly ? 0.22 : 0.55} />
            <circle cx="62" cy="54" r="3" fill={inkFriendly ? '#94a3b8' : '#facc15'} opacity={inkFriendly ? 0.18 : 0.45} />
          </pattern>
        </>
      );

      const content = (
        <g aria-hidden="true">
          <rect x="24" y="24" width="1072" height="752" fill={`url(#${gradientId})`} opacity={inkFriendly ? 0.55 : 0.85} />
          <rect x="24" y="24" width="1072" height="752" fill={`url(#${sparklePatternId})`} opacity={inkFriendly ? 0.25 : 0.45} />
          {Array.from({ length: 12 }).map((_, index) => (
            <circle
              key={`spark-${index}`}
              cx={160 + (index % 4) * 240}
              cy={140 + Math.floor(index / 4) * 220}
              r={index % 3 === 0 ? 24 : 16}
              fill={index % 2 === 0 ? paletteAccent : paletteBadge}
              opacity={inkFriendly ? 0.25 : 0.5}
            />
          ))}
        </g>
      );

      return { defs, content };
    }

    if (bgStyle === 'sunburst') {
      const baseGradientId = `${backgroundClipId}-sunburst-base`;
      const rayGradientId = `${backgroundClipId}-sunburst-ray`;
      const defs = (
        <>
          <radialGradient id={baseGradientId} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={inkFriendly ? '#f1f5f9' : '#fff4d6'} />
            <stop offset="100%" stopColor={inkFriendly ? '#e2e8f0' : '#ffe0a3'} />
          </radialGradient>
          <linearGradient id={rayGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={paletteAccent} stopOpacity={inkFriendly ? 0.35 : 0.6} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </>
      );

      const content = (
        <g aria-hidden="true">
          <rect x="24" y="24" width="1072" height="752" fill={`url(#${baseGradientId})`} opacity={inkFriendly ? 0.55 : 0.85} />
          {Array.from({ length: 24 }).map((_, index) => (
            <path
              key={`ray-${index}`}
              d="M560 24 L620 200 L500 200 Z"
              fill={`url(#${rayGradientId})`}
              transform={`rotate(${(360 / 24) * index} 560 400)`}
              opacity={inkFriendly ? 0.3 : 0.5}
            />
          ))}
          <circle cx={560} cy={400} r={120} fill={paletteBadge} opacity={inkFriendly ? 0.28 : 0.45} />
        </g>
      );

      return { defs, content };
    }

    return baseResult;
  }, [bgStyle, backgroundClipId, colors, inkFriendly]);

  const badgePrefix = React.useMemo(() => `badge-${reactId.replace(/:/g, '')}`, [reactId]);
  const badgePosition = React.useMemo(() => {
    if (templateStyle === 'medal' || templateStyle === 'trophy') {
      return { cx: 90, cy: 100 };
    }
    return { cx: 1000, cy: 100 };
  }, [templateStyle]);

  const badgeGraphic = React.useMemo(() => {
    if (badgeIcon === 'none') return null;
    const centerTransform = `translate(${badgePosition.cx} ${badgePosition.cy})`;

    switch (badgeIcon) {
      case 'gold-seal': {
        const outerGradient = `${badgePrefix}-gold-outer`;
        const innerGradient = `${badgePrefix}-gold-inner`;
        return (
          <>
            <defs>
              <radialGradient id={outerGradient} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={inkFriendly ? '#e2e8f0' : '#fff9db'} />
                <stop offset="55%" stopColor={inkFriendly ? '#cbd5f5' : '#facc15'} />
                <stop offset="100%" stopColor={inkFriendly ? '#94a3b8' : '#d97706'} />
              </radialGradient>
              <radialGradient id={innerGradient} cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor={inkFriendly ? '#f8fafc' : '#fff'} />
                <stop offset="100%" stopColor={inkFriendly ? '#e2e8f0' : '#fde68a'} />
              </radialGradient>
            </defs>
            <g transform={centerTransform} aria-hidden="true">
              {Array.from({ length: 32 }).map((_, index) => (
                <rect
                  key={`gold-tooth-${index}`}
                  x={-4}
                  y={-48}
                  width={8}
                  height={20}
                  rx={3}
                  fill={inkFriendly ? '#94a3b8' : '#fbbf24'}
                  opacity={inkFriendly ? 0.35 : 0.65}
                  transform={`rotate(${(360 / 32) * index} 0 0)`}
                />
              ))}
              <circle r={34} fill={`url(#${outerGradient})`} />
              <circle r={24} fill={`url(#${innerGradient})`} />
              <circle r={29} fill="none" stroke={inkFriendly ? '#94a3b8' : '#f59e0b'} strokeWidth={3} strokeOpacity={0.6} />
              <polygon
                points="0,-10 3,-3 10,-3 4,1 7,8 0,3 -7,8 -4,1 -10,-3 -3,-3"
                fill={inkFriendly ? '#475569' : '#fff9db'}
              />
            </g>
          </>
        );
      }
      case 'silver-seal': {
        const outerGradient = `${badgePrefix}-silver-outer`;
        const innerGradient = `${badgePrefix}-silver-inner`;
        return (
          <>
            <defs>
              <radialGradient id={outerGradient} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={inkFriendly ? '#e2e8f0' : '#f8fafc'} />
                <stop offset="55%" stopColor={inkFriendly ? '#cbd5f5' : '#d1d5db'} />
                <stop offset="100%" stopColor={inkFriendly ? '#94a3b8' : '#6b7280'} />
              </radialGradient>
              <radialGradient id={innerGradient} cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor={inkFriendly ? '#f8fafc' : '#ffffff'} />
                <stop offset="100%" stopColor={inkFriendly ? '#dbeafe' : '#e5e7eb'} />
              </radialGradient>
            </defs>
            <g transform={centerTransform} aria-hidden="true">
              {Array.from({ length: 36 }).map((_, index) => (
                <rect
                  key={`silver-tooth-${index}`}
                  x={-3.5}
                  y={-46}
                  width={7}
                  height={18}
                  rx={2.5}
                  fill={inkFriendly ? '#94a3b8' : '#9ca3af'}
                  opacity={inkFriendly ? 0.4 : 0.7}
                  transform={`rotate(${(360 / 36) * index} 0 0)`}
                />
              ))}
              <circle r={33} fill={`url(#${outerGradient})`} />
              <circle r={23} fill={`url(#${innerGradient})`} />
              <circle r={28} fill="none" stroke={inkFriendly ? '#94a3b8' : '#94a3a8'} strokeWidth={2.5} strokeOpacity={0.55} />
              <path
                d="M0 -12 C3 -9 6 -6 8 -2 C6 2 3 6 0 9 C-3 6 -6 2 -8 -2 C-6 -6 -3 -9 0 -12 Z"
                fill={inkFriendly ? '#475569' : '#0f172a'}
              />
              <path d="M-6 4 L0 14 L6 4" stroke={inkFriendly ? '#475569' : '#0f172a'} strokeWidth={2} strokeLinecap="round" fill="none" />
            </g>
          </>
        );
      }
      case 'blue-ribbon': {
        const medallionGradient = `${badgePrefix}-blue-medal`;
        const ribbonGradient = `${badgePrefix}-blue-ribbon`;
        return (
          <>
            <defs>
              <radialGradient id={medallionGradient} cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor={inkFriendly ? '#e0e7ff' : '#dbeafe'} />
                <stop offset="100%" stopColor={inkFriendly ? '#64748b' : '#2563eb'} />
              </radialGradient>
              <linearGradient id={ribbonGradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={inkFriendly ? '#64748b' : '#1d4ed8'} />
                <stop offset="100%" stopColor={inkFriendly ? '#475569' : '#1e3a8a'} />
              </linearGradient>
            </defs>
            <g transform={centerTransform} aria-hidden="true">
              <path d="M-18 26 L-30 60 L-12 46" fill={`url(#${ribbonGradient})`} opacity={inkFriendly ? 0.6 : 0.85} />
              <path d="M18 26 L30 60 L12 46" fill={`url(#${ribbonGradient})`} opacity={inkFriendly ? 0.6 : 0.85} />
              <circle r={30} fill={`url(#${medallionGradient})`} stroke={inkFriendly ? '#475569' : '#1e3a8a'} strokeWidth={2} />
              <circle r={18} fill={inkFriendly ? '#f8fafc' : '#fff'} opacity={0.9} />
              <polygon points="0,-9 2.8,-2.5 9.5,-2.5 4.2,1 6.5,7 0,3 -6.5,7 -4.2,1 -9.5,-2.5 -2.8,-2.5" fill={inkFriendly ? '#475569' : '#1d4ed8'} />
            </g>
          </>
        );
      }
      case 'green-laurel': {
        const crestGradient = `${badgePrefix}-laurel-crest`;
        const leafColor = inkFriendly ? '#64748b' : '#22c55e';
        return (
          <>
            <defs>
              <linearGradient id={crestGradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={inkFriendly ? '#e2e8f0' : '#bbf7d0'} />
                <stop offset="100%" stopColor={inkFriendly ? '#94a3b8' : '#16a34a'} />
              </linearGradient>
            </defs>
            <g transform={centerTransform} aria-hidden="true">
              <path
                d="M0 -28 C16 -28 28 -14 28 -2 C28 16 12 30 0 38 C-12 30 -28 16 -28 -2 C-28 -14 -16 -28 0 -28 Z"
                fill={`url(#${crestGradient})`}
                stroke={inkFriendly ? '#475569' : '#15803d'}
                strokeWidth={2}
              />
              {Array.from({ length: 6 }).map((_, index) => {
                const y = -18 + index * 8;
                return (
                  <path
                    key={`leaf-left-${index}`}
                    d={`M-36 ${y} C-30 ${y - 4} -24 ${y - 4} -20 ${y} C-24 ${y + 4} -30 ${y + 6} -36 ${y + 2} Z`}
                    fill={leafColor}
                    opacity={inkFriendly ? 0.4 : 0.75}
                  />
                );
              })}
              {Array.from({ length: 6 }).map((_, index) => {
                const y = -18 + index * 8;
                return (
                  <path
                    key={`leaf-right-${index}`}
                    d={`M36 ${y} C30 ${y - 4} 24 ${y - 4} 20 ${y} C24 ${y + 4} 30 ${y + 6} 36 ${y + 2} Z`}
                    fill={leafColor}
                    opacity={inkFriendly ? 0.4 : 0.75}
                  />
                );
              })}
              <circle r={10} fill={inkFriendly ? '#475569' : '#15803d'} opacity={0.85} />
              <path d="M-2 0 L0 -10 L2 0 Z" fill={inkFriendly ? '#f8fafc' : '#bbf7d0'} />
            </g>
          </>
        );
      }
      case 'red-medal': {
        const strapGradient = `${badgePrefix}-strap`;
        const medalGradient = `${badgePrefix}-medal`;
        return (
          <>
            <defs>
              <linearGradient id={strapGradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={inkFriendly ? '#9ca3af' : '#ef4444'} />
                <stop offset="100%" stopColor={inkFriendly ? '#6b7280' : '#b91c1c'} />
              </linearGradient>
              <radialGradient id={medalGradient} cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor={inkFriendly ? '#f8fafc' : '#fff5f5'} />
                <stop offset="100%" stopColor={inkFriendly ? '#9ca3af' : '#ef4444'} />
              </radialGradient>
            </defs>
            <g transform={centerTransform} aria-hidden="true">
              <path d="M-18 -38 H18 L8 -6 H-8 Z" fill={`url(#${strapGradient})`} opacity={inkFriendly ? 0.6 : 0.85} />
              <circle cy={12} r={30} fill={`url(#${medalGradient})`} stroke={inkFriendly ? '#6b7280' : '#991b1b'} strokeWidth={2} />
              <circle cy={12} r={18} fill={inkFriendly ? '#e2e8f0' : '#fff'} opacity={0.9} />
              <polygon points="0,2 4,12 14,12 6,18 9,28 0,22 -9,28 -6,18 -14,12 -4,12" fill={inkFriendly ? '#6b7280' : '#b91c1c'} />
            </g>
          </>
        );
      }
      case 'starburst': {
        const burstGradient = `${badgePrefix}-burst`;
        const centerGradient = `${badgePrefix}-burst-center`;
        return (
          <>
            <defs>
              <radialGradient id={burstGradient} cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor={inkFriendly ? '#e2e8f0' : '#ffe4e6'} />
                <stop offset="100%" stopColor={inkFriendly ? '#94a3b8' : '#f472b6'} />
              </radialGradient>
              <radialGradient id={centerGradient} cx="50%" cy="45%" r="45%">
                <stop offset="0%" stopColor={inkFriendly ? '#f8fafc' : '#fff'} />
                <stop offset="100%" stopColor={inkFriendly ? '#cbd5f5' : '#f9a8d4'} />
              </radialGradient>
            </defs>
            <g transform={centerTransform} aria-hidden="true">
              <polygon
                points="0,-34 8,-16 28,-16 12,-4 18,16 0,6 -18,16 -12,-4 -28,-16 -8,-16"
                fill={`url(#${burstGradient})`}
                stroke={inkFriendly ? '#6b7280' : '#ec4899'}
                strokeWidth={2}
              />
              <circle r={14} fill={`url(#${centerGradient})`} />
              <circle r={6} fill={inkFriendly ? '#6b7280' : '#db2777'} />
            </g>
          </>
        );
      }
      case 'shield': {
        const shieldGradient = `${badgePrefix}-shield-base`;
        const highlightGradient = `${badgePrefix}-shield-highlight`;
        return (
          <>
            <defs>
              <linearGradient id={shieldGradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={inkFriendly ? '#e2e8f0' : '#bfdbfe'} />
                <stop offset="100%" stopColor={inkFriendly ? '#94a3b8' : '#3b82f6'} />
              </linearGradient>
              <linearGradient id={highlightGradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={inkFriendly ? '#f8fafc' : '#fff'} stopOpacity={0.8} />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <g transform={centerTransform} aria-hidden="true">
              <path
                d="M0 -32 C20 -32 32 -18 32 -2 C32 16 18 32 0 38 C-18 32 -32 16 -32 -2 C-32 -18 -20 -32 0 -32 Z"
                fill={`url(#${shieldGradient})`}
                stroke={inkFriendly ? '#475569' : '#1d4ed8'}
                strokeWidth={2}
              />
              <path d="M0 -24 C14 -24 24 -12 24 -2 C24 12 12 24 0 30 C-12 24 -24 12 -24 -2 C-24 -12 -14 -24 0 -24 Z" fill={`url(#${highlightGradient})`} />
              <path d="M-10 -2 H10 V10 C10 18 3 24 0 24 C-3 24 -10 18 -10 10 Z" fill={inkFriendly ? '#475569' : '#1e3a8a'} opacity={0.8} />
            </g>
          </>
        );
      }
      default:
        return null;
    }
  }, [badgeIcon, badgePosition, badgePrefix, inkFriendly]);

  // Seal is always positioned at center-bottom
  const sealPositionCoords = React.useMemo(() => ({ x: 560, y: 680 }), []);

  const sealGraphic = React.useMemo(() => {
    if (!showSeal) return null;
    const sealPrefix = `seal-${reactId.replace(/:/g, '')}`;
    const sealSize = 55; // Increased from 40 to 55 for bigger seal
    const sealOuterGradient = `${sealPrefix}-outer-grad`;
    const sealInnerGradient = `${sealPrefix}-inner-grad`;
    const sealEmbossGradient = `${sealPrefix}-emboss`;
    const sealShadowGradient = `${sealPrefix}-shadow`;
    
    // Color schemes for different seal styles
    const getSealColors = () => {
      switch (sealStyle) {
        case 'notary':
          return {
            color: inkFriendly ? '#64748b' : '#1e40af',
            light: inkFriendly ? '#cbd5e1' : '#dbeafe',
            dark: inkFriendly ? '#475569' : '#1e3a8a',
            mid: inkFriendly ? '#94a3b8' : '#3b82f6'
          };
        case 'academic':
          return {
            color: inkFriendly ? '#64748b' : '#d97706',
            light: inkFriendly ? '#cbd5e1' : '#fef3c7',
            dark: inkFriendly ? '#475569' : '#b45309',
            mid: inkFriendly ? '#94a3b8' : '#f59e0b'
          };
        case 'government':
          return {
            color: inkFriendly ? '#64748b' : '#059669',
            light: inkFriendly ? '#cbd5e1' : '#d1fae5',
            dark: inkFriendly ? '#475569' : '#047857',
            mid: inkFriendly ? '#94a3b8' : '#10b981'
          };
        case 'corporate':
          return {
            color: inkFriendly ? '#64748b' : '#7c3aed',
            light: inkFriendly ? '#cbd5e1' : '#ede9fe',
            dark: inkFriendly ? '#475569' : '#5b21b6',
            mid: inkFriendly ? '#94a3b8' : '#8b5cf6'
          };
        case 'medallion':
          return {
            color: inkFriendly ? '#64748b' : '#dc2626',
            light: inkFriendly ? '#cbd5e1' : '#fee2e2',
            dark: inkFriendly ? '#475569' : '#991b1b',
            mid: inkFriendly ? '#94a3b8' : '#ef4444'
          };
        default: // classic-official
          return {
            color: inkFriendly ? '#64748b' : '#d97706',
            light: inkFriendly ? '#cbd5e1' : '#fef3c7',
            dark: inkFriendly ? '#475569' : '#b45309',
            mid: inkFriendly ? '#94a3b8' : '#f59e0b'
          };
      }
    };
    
    const { color: sealColor, light: sealLight, dark: sealDark, mid: sealMid } = getSealColors();
    
    return (
      <g transform={`translate(${sealPositionCoords.x} ${sealPositionCoords.y})`} aria-label="Official seal">
        <defs>
          {/* Outer ring gradient - realistic embossed effect */}
          <radialGradient id={sealOuterGradient} cx="45%" cy="45%" r="60%">
            <stop offset="0%" stopColor={inkFriendly ? '#f1f5f9' : sealLight} stopOpacity="1" />
            <stop offset="30%" stopColor={sealLight} stopOpacity="0.9" />
            <stop offset="60%" stopColor={sealColor} stopOpacity="0.85" />
            <stop offset="85%" stopColor={sealMid} stopOpacity="0.9" />
            <stop offset="100%" stopColor={sealDark} stopOpacity="1" />
          </radialGradient>
          {/* Inner circle gradient */}
          <radialGradient id={sealInnerGradient} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={inkFriendly ? '#ffffff' : '#ffffff'} stopOpacity="1" />
            <stop offset="50%" stopColor={sealLight} stopOpacity="0.6" />
            <stop offset="100%" stopColor={sealColor} stopOpacity="0.3" />
          </radialGradient>
          {/* Embossed highlight effect */}
          <radialGradient id={sealEmbossGradient} cx="40%" cy="40%" r="45%">
            <stop offset="0%" stopColor={inkFriendly ? '#ffffff' : '#ffffff'} stopOpacity="0.8" />
            <stop offset="60%" stopColor={inkFriendly ? '#ffffff' : '#ffffff'} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          {/* Shadow for depth */}
          <radialGradient id={sealShadowGradient} cx="55%" cy="55%" r="50%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="70%" stopColor={sealDark} stopOpacity="0.2" />
            <stop offset="100%" stopColor={sealDark} stopOpacity="0.4" />
          </radialGradient>
        </defs>
        
        {/* Drop shadow for realistic effect */}
        <circle r={sealSize + 8} fill={`url(#${sealShadowGradient})`} opacity="0.6" />
        
        {/* Render different seal styles */}
        {sealStyle === 'classic-official' && (
          <>
            {/* Outer decorative ring with embossed teeth */}
            <g opacity={inkFriendly ? 0.5 : 0.85}>
              {Array.from({ length: 40 }).map((_, index) => {
                const angle = (360 / 40) * index;
                const isEven = index % 2 === 0;
                return (
                  <rect
                    key={`seal-tooth-${index}`}
                    x={-3}
                    y={-sealSize - 2}
                    width={6}
                    height={isEven ? 18 : 15}
                    rx={2.5}
                    fill={isEven ? sealLight : sealColor}
                    opacity={isEven ? 0.9 : 0.7}
                    transform={`rotate(${angle} 0 0)`}
                  />
                );
              })}
            </g>
            {/* Main seal body */}
            <circle r={sealSize} fill={`url(#${sealOuterGradient})`} />
            <circle r={sealSize} fill="none" stroke={sealDark} strokeWidth={2} opacity={0.4} />
            {/* Inner raised circle */}
            <circle r={sealSize * 0.7} fill={`url(#${sealInnerGradient})`} />
            <circle r={sealSize * 0.7} fill="none" stroke={sealDark} strokeWidth={1.2} opacity={0.3} />
            <circle r={sealSize * 0.7} fill={`url(#${sealEmbossGradient})`} />
            {/* Decorative inner rings */}
            <circle r={sealSize * 0.6} fill="none" stroke={sealDark} strokeWidth={1} opacity={0.25} strokeDasharray="2 3" />
            <circle r={sealSize * 0.5} fill="none" stroke={sealDark} strokeWidth={1} opacity={0.2} />
            {/* Central star emblem */}
            <g opacity={inkFriendly ? 0.7 : 0.9}>
              <polygon points="0,-16 4.5,-4.5 16,-4.5 6.5,1.5 9,13 0,6.5 -9,13 -6.5,1.5 -16,-4.5 -4.5,-4.5" fill={sealDark} stroke={sealLight} strokeWidth={0.8} />
              <circle r={8} fill={sealLight} opacity={0.9} />
              <circle r={8} fill="none" stroke={sealDark} strokeWidth={1} />
              <polygon points="0,-5.5 2,-2 5.5,-2 2.5,0.5 3.5,4.5 0,2.5 -3.5,4.5 -2.5,0.5 -5.5,-2 -2,-2" fill={sealDark} />
            </g>
            {/* Curved text */}
            <path id={`${sealPrefix}-top-text-path`} d={`M -${sealSize * 0.7},0 A ${sealSize * 0.7},${sealSize * 0.7} 0 0,1 ${sealSize * 0.7},0`} fill="none" />
            <text fontSize="11" fill={sealDark} fontFamily="serif" fontWeight="bold" letterSpacing="2" opacity={inkFriendly ? 0.6 : 0.85}>
              <textPath href={`#${sealPrefix}-top-text-path`} startOffset="50%" textAnchor="middle">✦ OFFICIAL SEAL ✦</textPath>
            </text>
            {date && (
              <>
                <path id={`${sealPrefix}-bottom-text-path`} d={`M ${sealSize * 0.7},0 A ${sealSize * 0.7},${sealSize * 0.7} 0 0,1 -${sealSize * 0.7},0`} fill="none" />
                <text fontSize="8" fill={sealDark} fontFamily="serif" fontWeight="600" letterSpacing="1.5" opacity="0.7">
                  <textPath href={`#${sealPrefix}-bottom-text-path`} startOffset="50%" textAnchor="middle">
                    {(() => { try { return new Date(date).getFullYear(); } catch {} return ''; })()}
                  </textPath>
                </text>
              </>
            )}
            {/* Decorative dots */}
            {Array.from({ length: 12 }).map((_, index) => {
              const angle = (360 / 12) * index;
              const radius = sealSize * 0.75;
              return <circle key={`dot-${index}`} cx={Math.cos((angle * Math.PI) / 180) * radius} cy={Math.sin((angle * Math.PI) / 180) * radius} r={2} fill={sealDark} opacity={inkFriendly ? 0.4 : 0.6} />;
            })}
          </>
        )}
        
        {sealStyle === 'notary' && (
          <>
            {/* Notary seal - blue with scales of justice */}
            <g opacity={inkFriendly ? 0.5 : 0.85}>
              {Array.from({ length: 32 }).map((_, index) => {
                const angle = (360 / 32) * index;
                return <rect key={`tooth-${index}`} x={-2.5} y={-sealSize - 2} width={5} height={16} rx={2} fill={sealColor} opacity={0.7} transform={`rotate(${angle} 0 0)`} />;
              })}
            </g>
            <circle r={sealSize} fill={`url(#${sealOuterGradient})`} />
            <circle r={sealSize} fill="none" stroke={sealDark} strokeWidth={2.5} opacity={0.5} />
            <circle r={sealSize * 0.75} fill={`url(#${sealInnerGradient})`} />
            <circle r={sealSize * 0.75} fill={`url(#${sealEmbossGradient})`} />
            {/* Scales of justice */}
            <g opacity={inkFriendly ? 0.7 : 0.9}>
              <path d="M0,-20 L0,8 M-12,-8 L12,-8 M-12,-8 L-8,-4 L-4,-4 L0,-8 L4,-4 L8,-4 L12,-8" stroke={sealDark} strokeWidth={2} fill="none" strokeLinecap="round" />
              <circle cx={-6} cy={-4} r={3} fill={sealDark} opacity={0.8} />
              <circle cx={6} cy={-4} r={3} fill={sealDark} opacity={0.8} />
            </g>
            <path id={`${sealPrefix}-notary-top`} d={`M -${sealSize * 0.7},0 A ${sealSize * 0.7},${sealSize * 0.7} 0 0,1 ${sealSize * 0.7},0`} fill="none" />
            <text fontSize="10" fill={sealDark} fontFamily="serif" fontWeight="bold" letterSpacing="1.8" opacity={inkFriendly ? 0.6 : 0.85}>
              <textPath href={`#${sealPrefix}-notary-top`} startOffset="50%" textAnchor="middle">NOTARY PUBLIC</textPath>
            </text>
          </>
        )}
        
        {sealStyle === 'academic' && (
          <>
            {/* Academic seal - with laurel wreath */}
            <circle r={sealSize} fill={`url(#${sealOuterGradient})`} />
            <circle r={sealSize} fill="none" stroke={sealDark} strokeWidth={2.5} opacity={0.5} />
            {/* Laurel wreath */}
            <g opacity={inkFriendly ? 0.6 : 0.85}>
              {Array.from({ length: 16 }).map((_, index) => {
                const angle = (360 / 16) * index;
                const radius = sealSize * 0.8;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                return <ellipse key={`leaf-${index}`} cx={x} cy={y} rx={4} ry={8} fill={sealDark} opacity={0.6} transform={`rotate(${angle} ${x} ${y})`} />;
              })}
            </g>
            <circle r={sealSize * 0.6} fill={`url(#${sealInnerGradient})`} />
            <circle r={sealSize * 0.6} fill={`url(#${sealEmbossGradient})`} />
            {/* Open book emblem */}
            <g opacity={inkFriendly ? 0.7 : 0.9}>
              <rect x={-12} y={-4} width={24} height={16} rx={1} fill={sealLight} stroke={sealDark} strokeWidth={1.5} />
              <line x1={0} y1={-4} x2={0} y2={12} stroke={sealDark} strokeWidth={1.5} />
              <line x1={-8} y1={2} x2={-2} y2={2} stroke={sealDark} strokeWidth={1} />
              <line x1={2} y1={2} x2={8} y2={2} stroke={sealDark} strokeWidth={1} />
            </g>
            <path id={`${sealPrefix}-academic-top`} d={`M -${sealSize * 0.7},0 A ${sealSize * 0.7},${sealSize * 0.7} 0 0,1 ${sealSize * 0.7},0`} fill="none" />
            <text fontSize="10" fill={sealDark} fontFamily="serif" fontWeight="bold" letterSpacing="1.8" opacity={inkFriendly ? 0.6 : 0.85}>
              <textPath href={`#${sealPrefix}-academic-top`} startOffset="50%" textAnchor="middle">ACADEMIC EXCELLENCE</textPath>
            </text>
          </>
        )}
        
        {sealStyle === 'government' && (
          <>
            {/* Government seal - with eagle/shield */}
            <g opacity={inkFriendly ? 0.5 : 0.85}>
              {Array.from({ length: 44 }).map((_, index) => {
                const angle = (360 / 44) * index;
                return <rect key={`tooth-${index}`} x={-2} y={-sealSize - 2} width={4} height={14} rx={2} fill={sealColor} opacity={0.6} transform={`rotate(${angle} 0 0)`} />;
              })}
            </g>
            <circle r={sealSize} fill={`url(#${sealOuterGradient})`} />
            <circle r={sealSize} fill="none" stroke={sealDark} strokeWidth={2.5} opacity={0.5} />
            <circle r={sealSize * 0.7} fill={`url(#${sealInnerGradient})`} />
            <circle r={sealSize * 0.7} fill={`url(#${sealEmbossGradient})`} />
            {/* Shield emblem */}
            <g opacity={inkFriendly ? 0.7 : 0.9}>
              <path d="M0,-14 L-8,0 L-6,8 L0,12 L6,8 L8,0 Z" fill={sealDark} stroke={sealLight} strokeWidth={1} />
              <polygon points="0,-10 -4,0 0,6 4,0" fill={sealLight} opacity={0.8} />
            </g>
            <path id={`${sealPrefix}-gov-top`} d={`M -${sealSize * 0.7},0 A ${sealSize * 0.7},${sealSize * 0.7} 0 0,1 ${sealSize * 0.7},0`} fill="none" />
            <text fontSize="9" fill={sealDark} fontFamily="serif" fontWeight="bold" letterSpacing="1.5" opacity={inkFriendly ? 0.6 : 0.85}>
              <textPath href={`#${sealPrefix}-gov-top`} startOffset="50%" textAnchor="middle">OFFICIAL GOVERNMENT SEAL</textPath>
            </text>
          </>
        )}
        
        {sealStyle === 'corporate' && (
          <>
            {/* Corporate seal - modern with building/star */}
            <circle r={sealSize} fill={`url(#${sealOuterGradient})`} />
            <circle r={sealSize} fill="none" stroke={sealDark} strokeWidth={2} opacity={0.4} />
            <circle r={sealSize * 0.75} fill={`url(#${sealInnerGradient})`} />
            <circle r={sealSize * 0.75} fill={`url(#${sealEmbossGradient})`} />
            {/* Corporate building/tower emblem */}
            <g opacity={inkFriendly ? 0.7 : 0.9}>
              <rect x={-10} y={-2} width={6} height={14} fill={sealDark} />
              <rect x={-2} y={-4} width={4} height={16} fill={sealDark} />
              <rect x={4} y={0} width={6} height={12} fill={sealDark} />
              <polygon points="0,-8 3,-5 0,-2 -3,-5" fill={sealLight} />
            </g>
            <path id={`${sealPrefix}-corp-top`} d={`M -${sealSize * 0.7},0 A ${sealSize * 0.7},${sealSize * 0.7} 0 0,1 ${sealSize * 0.7},0`} fill="none" />
            <text fontSize="9" fill={sealDark} fontFamily="serif" fontWeight="bold" letterSpacing="1.5" opacity={inkFriendly ? 0.6 : 0.85}>
              <textPath href={`#${sealPrefix}-corp-top`} startOffset="50%" textAnchor="middle">CORPORATE SEAL</textPath>
            </text>
          </>
        )}
        
        {sealStyle === 'medallion' && (
          <>
            {/* Medallion seal - ornate with ribbon */}
            <g opacity={inkFriendly ? 0.5 : 0.85}>
              {Array.from({ length: 48 }).map((_, index) => {
                const angle = (360 / 48) * index;
                const isEven = index % 3 === 0;
                return <rect key={`tooth-${index}`} x={-2} y={-sealSize - 2} width={4} height={isEven ? 16 : 12} rx={2} fill={isEven ? sealLight : sealColor} opacity={0.8} transform={`rotate(${angle} 0 0)`} />;
              })}
            </g>
            <circle r={sealSize} fill={`url(#${sealOuterGradient})`} />
            <circle r={sealSize} fill="none" stroke={sealDark} strokeWidth={3} opacity={0.5} />
            <circle r={sealSize * 0.85} fill="none" stroke={sealDark} strokeWidth={1.5} opacity={0.3} />
            <circle r={sealSize * 0.7} fill={`url(#${sealInnerGradient})`} />
            <circle r={sealSize * 0.7} fill={`url(#${sealEmbossGradient})`} />
            {/* Ribbon banner */}
            <g opacity={inkFriendly ? 0.7 : 0.9}>
              <path d="M-18,4 Q-18,0 0,0 Q18,0 18,4 L18,8 Q18,12 0,12 Q-18,12 -18,8 Z" fill={sealDark} />
              <text x="0" y="9" textAnchor="middle" fontSize="8" fill={sealLight} fontFamily="serif" fontWeight="bold">AWARD</text>
            </g>
            {/* Central medallion star */}
            <polygon points="0,-14 4,-4 14,-4 6,1 9,11 0,6 -9,11 -6,1 -14,-4 -4,-4" fill={sealDark} stroke={sealLight} strokeWidth={1} />
            <circle r={6} fill={sealLight} opacity={0.9} />
            <path id={`${sealPrefix}-med-top`} d={`M -${sealSize * 0.7},0 A ${sealSize * 0.7},${sealSize * 0.7} 0 0,1 ${sealSize * 0.7},0`} fill="none" />
            <text fontSize="9" fill={sealDark} fontFamily="serif" fontWeight="bold" letterSpacing="1.5" opacity={inkFriendly ? 0.6 : 0.85}>
              <textPath href={`#${sealPrefix}-med-top`} startOffset="50%" textAnchor="middle">CERTIFICATE OF MERIT</textPath>
            </text>
          </>
        )}
      </g>
    );
  }, [showSeal, sealPositionCoords, inkFriendly, reactId, date, sealStyle]);

  const showGoldGradient = theme === 'gold' || templateStyle === 'academic';
  const backgroundDefs = backgroundLayers.defs;
  const backgroundContent = backgroundLayers.content;
  const interiorFillColor = inkFriendly ? '#f8fafc' : '#ffffff';
  const interiorFillOpacity = inkFriendly ? 0.9 : 0.78;

  const svg = (
    <svg viewBox="0 0 1120 800" role="img" aria-label="Certificate preview">
      <defs>
        <clipPath id={backgroundClipId}>
          <rect x="24" y="24" width="1072" height="752" rx="18" />
        </clipPath>
        {showGoldGradient ? (
          <linearGradient id={goldGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={inkFriendly ? '#9ca3af' : '#fef3c7'} />
            <stop offset="50%" stopColor={inkFriendly ? '#6b7280' : '#d4af37'} />
            <stop offset="100%" stopColor={inkFriendly ? '#9ca3af' : '#fde68a'} />
          </linearGradient>
        ) : null}
        {backgroundDefs}
      </defs>

      {/* Border */}
      {showGoldGradient ? (
        <>
          <rect x="10" y="10" width="1100" height="780" rx="20" fill="#fff" stroke={`url(#${goldGradientId})`} strokeWidth="10" />
          {templateStyle === 'academic' && (
            <>
              <rect x="34" y="34" width="1052" height="732" rx="14" fill="none" stroke={inkFriendly ? '#475569' : '#b7791f'} strokeWidth="3" />
              {/* corner ornaments */}
              <g opacity="0.35" stroke={inkFriendly ? '#94a3b8' : '#b45309'} fill="none" strokeWidth="3">
                <path d="M60 60 L120 60 L60 120 Z" />
                <path d="M1060 60 L1000 60 L1060 120 Z" />
                <path d="M60 740 L120 740 L60 680 Z" />
                <path d="M1060 740 L1000 740 L1060 680 Z" />
              </g>
            </>
          )}
        </>
      ) : (
        <rect x="10" y="10" width="1100" height="780" rx="20" fill="#fff" stroke={colors.border} strokeWidth="8" />
      )}

      {backgroundContent && (
        <g
          clipPath={`url(#${backgroundClipId})`}
          opacity={bgStyle === 'none' ? 0 : 1}
          style={{ transition: 'opacity 0.35s ease-in-out', mixBlendMode: inkFriendly ? 'multiply' : 'normal' }}
          pointerEvents="none"
        >
          {backgroundContent}
        </g>
      )}
      {/* Inner border / ribbons */}
      {templateStyle === 'ribbon' ? (
        <>
          <polygon points="10,10 140,10 10,140" fill={inkFriendly ? '#94a3b8' : colors.accent} opacity={0.25} />
          <polygon points="1110,10 980,10 1110,140" fill={inkFriendly ? '#94a3b8' : colors.accent} opacity={0.25} />
          <polygon points="10,790 140,790 10,660" fill={inkFriendly ? '#94a3b8' : colors.accent} opacity={0.25} />
          <polygon points="1110,790 980,790 1110,660" fill={inkFriendly ? '#94a3b8' : colors.accent} opacity={0.25} />
          <rect
            x="40"
            y="40"
            width="1040"
            height="720"
            rx="24"
            fill={interiorFillColor}
            fillOpacity={interiorFillOpacity}
          />
        </>
      ) : templateStyle === 'academic' ? (
        <>
          <rect
            x="50"
            y="50"
            width="1020"
            height="700"
            rx="10"
            fill={interiorFillColor}
            fillOpacity={interiorFillOpacity}
            stroke={colors.accent}
            strokeWidth="2"
          />
        </>
      ) : (
        <rect
          x="26"
          y="26"
          width="1068"
          height="748"
          rx="14"
          fill={interiorFillColor}
          fillOpacity={interiorFillOpacity}
          stroke={colors.accent}
          strokeDasharray="12 10"
          strokeWidth="3"
        />
      )}
      {/* Badge */}
      {badgeIcon !== 'none' && (
        <>
          <circle cx={badgePosition.cx} cy={badgePosition.cy} r={36} fill={colors.badge} />
          {badgeGraphic}
        </>
      )}
      {/* Title */}
      <text x="560" y="200" textAnchor="middle" fontSize="48" fontWeight="800" fill={effective.text} fontFamily={effective.fontFamily}
        style={{ letterSpacing: '1px' }}>
        {awardTitle || 'Certificate of Achievement'}
      </text>
      {/* Recipient */}
      <text x="560" y="300" textAnchor="middle" fontSize="36" fill={effective.text} fontFamily={effective.fontFamily}>
        Awarded to
      </text>
      <text x="560" y="360" textAnchor="middle" fontSize="56" fontWeight="700" fill={effective.accent} fontFamily={effective.fontFamily}
        style={{ letterSpacing: '1px' }}>
        {recipient || 'Your Name Here'}
      </text>
      {/* Reason */}
      <foreignObject x="160" y="420" width="800" height="120">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ textAlign: 'center', color: effective.text, fontSize: 24, whiteSpace: 'pre-line', fontFamily: effective.fontFamily as any }}>
          {reason || 'For outstanding effort and kindness'}
        </div>
      </foreignObject>
      {/* Footer lines */}
      <line x1="200" y1="620" x2="460" y2="620" stroke="#94a3b8" strokeWidth="2" />
      <text x="330" y="650" textAnchor="middle" fontSize="18" fill={effective.text} fontFamily={effective.fontFamily}>Date{formattedDate ? `: ${formattedDate}` : ''}</text>
      {/* Signature area - signature above the line */}
      {signatureImage ? (
        <g>
          <image
            href={signatureImage}
            x={660}
            y={580}
            width={260}
            height={40}
            preserveAspectRatio="xMidYMid meet"
            opacity="0.9"
          />
          {issuer && (
            <text x="790" y="575" textAnchor="middle" fontSize="16" fill={effective.text} fontFamily={effective.fontFamily}>{issuer}</text>
          )}
        </g>
      ) : null}
      <line x1="660" y1="620" x2="920" y2="620" stroke="#94a3b8" strokeWidth="2" />
      {!signatureImage && (
        <text x="790" y="650" textAnchor="middle" fontSize="18" fill={effective.text} fontFamily={effective.fontFamily}>Signature{issuer ? `: ${issuer}` : ''}</text>
      )}
      {/* Official Seal/Stamp */}
      {sealGraphic}
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-amber-50">
      <UnifiedNavigation currentPage="kids" />
      {/* JSON-LD Structured Data */}
      {(() => {
        const canonical = 'https://wizqo.com/printables/certificate-maker';
        const breadcrumbId = `${canonical}#breadcrumbs`;
        const breadcrumbLd = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          '@id': breadcrumbId,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wizqo.com/' },
            { '@type': 'ListItem', position: 2, name: 'Printables', item: 'https://wizqo.com/printables' },
            { '@type': 'ListItem', position: 3, name: 'Certificate Maker', item: canonical }
          ]
        } as const;
        const faqLd = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Is this certificate maker free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can customize and print your certificates for free.' } },
            { '@type': 'Question', name: 'How do I print or save as PDF?', acceptedAnswer: { '@type': 'Answer', text: 'Click ?Print / Save as PDF? and choose your browser?s Save as PDF option.' } }
          ]
        } as const;
        return (
          <>
            <script id="breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
          </>
        );
      })()}

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 lg:pb-28 space-y-10">
        <header className="space-y-4 text-center lg:text-left">
          <Badge variant="secondary" className="mx-auto w-fit rounded-full border border-indigo-100 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 lg:mx-0">
            Printables
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            Design a printable certificate they&apos;ll be proud to receive
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-600 lg:mx-0 lg:text-base">
            Personalize the name, award reason, colors, and badge. Preview updates instantly and print in one click?no design skills required.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,420px)_1fr] items-start lg:items-stretch lg:pb-12">
          <div className="lg:sticky lg:top-24 lg:pr-2">
            <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl backdrop-blur-sm lg:h-[calc(100vh-8rem)] lg:min-h-[680px]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" aria-hidden />
              <div className="flex flex-col gap-4 px-6 pb-6 pt-7 sm:px-8 lg:flex-1 lg:overflow-y-auto">
                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">General details</p>
                    <h2 className="text-lg font-semibold text-slate-900">Personalize the award</h2>
                    <p className="text-sm text-slate-500">Tell us who the certificate is for and why they&apos;re being celebrated.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient" className="text-slate-700">Recipient name</Label>
                      <Input id="recipient" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Student name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="awardTitle" className="text-slate-700">Award title</Label>
                      <Input id="awardTitle" value={awardTitle} onChange={e => setAwardTitle(e.target.value)} placeholder="Certificate of Achievement" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-slate-700">Reason / message</Label>
                      <Textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="For outstanding effort and kindness" className="min-h-[120px]" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-slate-700">Date</Label>
                        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issuer" className="text-slate-700">Signature / issuer</Label>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setSignatureMode('text')}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                signatureMode === 'text'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              Text
                            </button>
                            <button
                              type="button"
                              onClick={() => setSignatureMode('upload')}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                signatureMode === 'upload'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              Upload
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSignatureMode('draw');
                                setShowSignatureDrawer(true);
                              }}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                signatureMode === 'draw'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              Draw
                            </button>
                          </div>
                          
                          {signatureMode === 'text' && (
                            <div className="space-y-1">
                              <Input 
                                id="issuer" 
                                value={issuer} 
                                onChange={e => {
                                  if (e.target.value.length <= 30) {
                                    setIssuer(e.target.value);
                                  }
                                }} 
                                placeholder="Teacher / Parent"
                                maxLength={30}
                              />
                              <p className="text-xs text-slate-500">{issuer.length}/30 characters</p>
                            </div>
                          )}
                          
                          {signatureMode === 'upload' && (
                            <div className="space-y-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      setSignatureImage(event.target?.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                              />
                              {signatureImage && (
                                <div className="relative">
                                  <img src={signatureImage} alt="Signature preview" className="max-h-20 border border-slate-200 rounded" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSignatureImage(null);
                                      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                                      if (input) input.value = '';
                                    }}
                                    className="absolute top-1 right-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                              <div className="mt-2 space-y-1">
                                <Input
                                  value={issuer}
                                  onChange={e => {
                                    if (e.target.value.length <= 30) {
                                      setIssuer(e.target.value);
                                    }
                                  }}
                                  placeholder="Name (optional)"
                                  maxLength={30}
                                />
                                <p className="text-xs text-slate-500">{issuer.length}/30 characters</p>
                              </div>
                            </div>
                          )}
                          
                          {signatureMode === 'draw' && (
                            <div className="space-y-2">
                              {signatureImage ? (
                                <div className="relative">
                                  <img src={signatureImage} alt="Drawn signature" className="max-h-20 border border-slate-200 rounded" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSignatureImage(null);
                                      setShowSignatureDrawer(true);
                                    }}
                                    className="absolute top-1 right-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                  >
                                    Clear
                                  </button>
                                </div>
                              ) : (
                                <div className="text-sm text-slate-500">Click "Draw" button above to open signature pad</div>
                              )}
                              <div className="mt-2 space-y-1">
                                <Input
                                  value={issuer}
                                  onChange={e => {
                                    if (e.target.value.length <= 30) {
                                      setIssuer(e.target.value);
                                    }
                                  }}
                                  placeholder="Name (optional)"
                                  maxLength={30}
                                />
                                <p className="text-xs text-slate-500">{issuer.length}/30 characters</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Style &amp; layout</p>
                    <h2 className="text-lg font-semibold text-slate-900">Pick the look</h2>
                    <p className="text-sm text-slate-500">Experiment with themes, layouts, badges, and background accents.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme" className="text-slate-700">Theme</Label>
                      <div className="relative">
                        <select
                          id="theme"
                          value={theme}
                          onChange={e => setTheme(e.target.value as typeof theme)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="classic">Classic</option>
                          <option value="rainbow">Rainbow</option>
                          <option value="space">Space</option>
                          <option value="animals">Animals</option>
                          <option value="gold">Gold (formal)</option>
                          <option value="confetti">Confetti (colorful)</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="M3.5 5.5L8 10l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateStyle" className="text-slate-700">Template</Label>
                      <div className="relative">
                        <select
                          id="templateStyle"
                          value={templateStyle}
                          onChange={e => setTemplateStyle(e.target.value as typeof templateStyle)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="simple">Simple border</option>
                          <option value="ribbon">Corner ribbons</option>
                          <option value="medal">Medal badge (top-left)</option>
                          <option value="trophy">Trophy badge (top-left)</option>
                          <option value="academic">Academic border (gold)</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="M3.5 5.5L8 10l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="badgeIcon" className="text-slate-700">Badges</Label>
                      <div className="relative">
                        <select
                          id="badgeIcon"
                          value={badgeIcon}
                          onChange={e => setBadgeIcon(e.target.value as typeof badgeIcon)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="none">None (no badge)</option>
                          <option value="gold-seal">Gold seal (classic)</option>
                          <option value="silver-seal">Silver seal (modern)</option>
                          <option value="blue-ribbon">Blue ribbon</option>
                          <option value="green-laurel">Emerald laurel</option>
                          <option value="red-medal">Crimson medal</option>
                          <option value="starburst">Sunrise starburst</option>
                          <option value="shield">Royal shield</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="M3.5 5.5L8 10l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3">
                      <div>
                        <Label htmlFor="showSeal" className="text-slate-700 font-semibold">Official seal/stamp</Label>
                        <p className="text-xs text-slate-500">Add an official seal or stamp to the certificate</p>
                      </div>
                      <Switch checked={showSeal} onCheckedChange={setShowSeal} aria-label="Toggle official seal" />
                    </div>
                    {showSeal && (
                      <div className="space-y-2">
                        <Label htmlFor="sealStyle" className="text-slate-700">Seal style</Label>
                        <div className="relative">
                          <select
                            id="sealStyle"
                            value={sealStyle}
                            onChange={e => setSealStyle(e.target.value as typeof sealStyle)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                          >
                            <option value="classic-official">Classic Official Seal</option>
                            <option value="notary">Notary Public Seal</option>
                            <option value="academic">Academic Excellence Seal</option>
                            <option value="government">Government Official Seal</option>
                            <option value="corporate">Corporate Seal</option>
                            <option value="medallion">Medallion Award Seal</option>
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                              <path d="M3.5 5.5L8 10l4.5-4.5" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="bgStyle" className="text-slate-700">Background style</Label>
                      <div className="relative">
                        <select
                          id="bgStyle"
                          value={bgStyle}
                          onChange={e => setBgStyle(e.target.value as typeof bgStyle)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="none">None</option>
                          <option value="wavy">Wavy bands</option>
                          <option value="bands">Diagonal bands</option>
                          <option value="rosette">Center rosette</option>
                          <option value="sparkle">Sparkle shimmer</option>
                          <option value="sunburst">Sunburst rays</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="M3.5 5.5L8 10l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fontStyle" className="text-slate-700">Font style</Label>
                      <div className="relative">
                        <select
                          id="fontStyle"
                          value={fontStyle}
                          onChange={e => setFontStyle(e.target.value as typeof fontStyle)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="print">Print (Sans)</option>
                          <option value="cursive">Cursive (Script)</option>
                          <option value="serif">Serif (Formal)</option>
                          <option value="comic">Comic (Playful)</option>
                          <option value="handwritten">Handwritten</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="M3.5 5.5L8 10l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="flex flex-1 flex-col gap-4 pb-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Colors &amp; print</p>
                    <h2 className="text-lg font-semibold text-slate-900">Make it print-ready</h2>
                    <p className="text-sm text-slate-500">Fine-tune colors and export settings so everything looks crisp on paper.</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Ink-friendly colors</p>
                        <p className="text-xs text-slate-500">Reduce heavy fills for economical home printing.</p>
                      </div>
                      <Switch checked={inkFriendly} onCheckedChange={setInkFriendly} aria-label="Toggle ink-friendly colors" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="textColor" className="text-slate-700">Text color</Label>
                        <input
                          id="textColor"
                          type="color"
                          value={textColorOverride || colors.text}
                          onChange={e => setTextColorOverride(e.target.value)}
                          className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accentColor" className="text-slate-700">Name color</Label>
                        <input
                          id="accentColor"
                          type="color"
                          value={accentColorOverride || colors.accent}
                          onChange={e => setAccentColorOverride(e.target.value)}
                          className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-inner"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => { setTextColorOverride(''); setAccentColorOverride(''); }}
                        className="rounded-full border-slate-300 bg-white/80 text-slate-600 hover:bg-slate-100"
                      >
                        Reset colors to theme
                      </Button>
                    </div>
                    <div className="mt-auto pt-2 space-y-2">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          downloadPNG();
                        }}
                        disabled={isDownloadingPNG}
                        className="w-full justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-sm font-semibold shadow-lg hover:from-emerald-600/90 hover:via-teal-600/90 hover:to-cyan-600/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                        type="button"
                      >
                        <span className="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
                          {isDownloadingPNG ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          )}
                        </span>
                        <span>{isDownloadingPNG ? 'Generating PNG...' : 'Download PNG'}</span>
                      </Button>
                      <Button
                        onClick={printPreview}
                        className="w-full justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-sm font-semibold shadow-lg hover:from-purple-600/90 hover:via-indigo-600/90 hover:to-blue-600/90"
                        size="lg"
                      >
                        <span className="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                          >
                            <path d="M7 17h10v4H7z" />
                            <path d="M7 17H6a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1" />
                            <path d="M7 8V3h10v5" />
                            <path d="M17 13h.01" />
                          </svg>
                        </span>
                        <span>Print / Save as PDF</span>
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="relative flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:h-[calc(100vh-8rem)] lg:min-h-[680px] lg:overflow-hidden">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Live preview</p>
                  <h2 className="text-2xl font-semibold text-slate-900">Watch your certificate update in real time</h2>
                  <p className="text-sm text-slate-500">Sized perfectly for US letter paper (landscape).</p>
                </div>
                <div className="w-full rounded-full border border-white/80 bg-white/70 px-4 py-2 text-center text-xs font-semibold text-slate-500 shadow-sm lg:w-auto">
                  Print-ready landscape layout
                </div>
              </div>
              <div className="relative flex-1 min-h-[480px] lg:min-h-[520px]">
                <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-gradient-to-br from-indigo-300/25 via-purple-300/20 to-amber-200/25 blur-3xl" aria-hidden />
                <div className="relative flex h-full flex-col rounded-[32px] border border-white/70 bg-white p-4 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.45)]">
                  <div className="flex-1 overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-50/60 p-4 shadow-inner">
                    <div id="certificate-sheet" className="h-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                      {svg}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <section aria-label="Explore more printables" className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-3xl border border-white/80 bg-white/70 p-8 shadow-lg backdrop-blur-sm sm:grid-cols-2 md:grid-cols-4">
          <a
            href="/printables"
            className="group flex flex-col gap-2 rounded-2xl border border-indigo-100/60 bg-indigo-50/60 p-4 text-sm text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white shadow-sm">PR</span>
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">More Printables</span>
            <span className="text-sm text-indigo-700/80">Discover themed worksheets, writing practice, and print-ready games.</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
              Explore
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 1h8v8" />
                <path d="M11 1L1 11" />
              </svg>
            </span>
          </a>
          <a
            href="/printables/handwriting-maker"
            className="group flex flex-col gap-2 rounded-2xl border border-emerald-100/60 bg-emerald-50/60 p-4 text-sm text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm">HW</span>
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">Handwriting Builder</span>
            <span className="text-sm text-emerald-700/80">Generate cursive or print practice sheets instantly.</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Start Writing
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 1h8v8" />
                <path d="M11 1L1 11" />
              </svg>
            </span>
          </a>
          <a
            href="/printables/name-tracing-generator"
            className="group flex flex-col gap-2 rounded-2xl border border-rose-100/60 bg-rose-50/60 p-4 text-sm text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-sm">NT</span>
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">Name Tracing</span>
            <span className="text-sm text-rose-700/80">Create my child's name tracing printable with dotted or bubble letters.</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
              Try It Now
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 1h8v8" />
                <path d="M11 1L1 11" />
              </svg>
            </span>
          </a>
          <a
            href="/printables/worksheets"
            className="group flex flex-col gap-2 rounded-2xl border border-amber-100/60 bg-amber-50/60 p-4 text-sm text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white shadow-sm">WS</span>
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">Grade-Level Worksheets</span>
            <span className="text-sm text-amber-700/80">Math, reading, and comprehension sets curated by grade.</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
              View Sets
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 1h8v8" />
                <path d="M11 1L1 11" />
              </svg>
            </span>
          </a>
        </div>
      </section>
      <Footer />
      
      {/* Signature Drawing Modal */}
      {showSignatureDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowSignatureDrawer(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900">Draw Your Signature</h3>
              <button
                onClick={() => setShowSignatureDrawer(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="border-2 border-slate-200 rounded-lg bg-white mb-4" style={{ touchAction: 'none' }}>
              <canvas
                ref={signatureCanvasRef}
                width={600}
                height={200}
                className="w-full cursor-crosshair"
                onMouseDown={(e) => {
                  if (!signatureCanvasRef.current) return;
                  const canvas = signatureCanvasRef.current;
                  const rect = canvas.getBoundingClientRect();
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  ctx.strokeStyle = '#1e293b';
                  ctx.lineWidth = 2;
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';
                  ctx.beginPath();
                  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                  setIsDrawing(true);
                }}
                onMouseMove={(e) => {
                  if (!isDrawing || !signatureCanvasRef.current) return;
                  const canvas = signatureCanvasRef.current;
                  const rect = canvas.getBoundingClientRect();
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                  ctx.stroke();
                }}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (!signatureCanvasRef.current) return;
                  const canvas = signatureCanvasRef.current;
                  const rect = canvas.getBoundingClientRect();
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  const touch = e.touches[0];
                  ctx.strokeStyle = '#1e293b';
                  ctx.lineWidth = 2;
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';
                  ctx.beginPath();
                  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
                  setIsDrawing(true);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  if (!isDrawing || !signatureCanvasRef.current) return;
                  const canvas = signatureCanvasRef.current;
                  const rect = canvas.getBoundingClientRect();
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  const touch = e.touches[0];
                  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
                  ctx.stroke();
                }}
                onTouchEnd={() => setIsDrawing(false)}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (signatureCanvasRef.current) {
                    const ctx = signatureCanvasRef.current.getContext('2d');
                    if (ctx) {
                      ctx.clearRect(0, 0, signatureCanvasRef.current.width, signatureCanvasRef.current.height);
                    }
                  }
                }}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  if (signatureCanvasRef.current) {
                    const dataURL = signatureCanvasRef.current.toDataURL('image/png');
                    setSignatureImage(dataURL);
                    setShowSignatureDrawer(false);
                  }
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { UnifiedNavigation } from '@/components/UnifiedNavigation';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/TranslationContext';

export default function CertificateMakerPage() {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();
  
  // Initialize date with today's date
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [recipient, setRecipient] = React.useState<string>('');
  const [awardTitle, setAwardTitle] = React.useState<string>('');
  const [reason, setReason] = React.useState<string>('');
  
  // Initialize default values after translation context is ready
  React.useEffect(() => {
    if (!awardTitle) {
      setAwardTitle(t('pages.certificate.defaultAwardTitle'));
    }
    if (!reason) {
      setReason(t('pages.certificate.defaultReason'));
    }
  }, [t, awardTitle, reason]);
  const [date, setDate] = React.useState<string>(getTodayDate());
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
        toast({
          title: t('pages.certificate.error'),
          description: t('pages.certificate.certificateNotFound'),
          variant: 'destructive',
        });
        console.error('Certificate sheet not found');
        return;
      }
      const svg = sheet.querySelector('svg');
      if (!svg) {
        toast({
          title: t('pages.certificate.error'),
          description: t('pages.certificate.svgNotFound'),
          variant: 'destructive',
        });
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
            // If it's already a data URL, use it directly
            if (href.startsWith('data:')) {
              resolve();
              return;
            }
            
            const imgElement = new Image();
            // Don't set crossOrigin for data URLs or same-origin images
            if (!href.startsWith('data:') && !href.startsWith(window.location.origin)) {
              imgElement.crossOrigin = 'anonymous';
            }
            
            imgElement.onload = () => {
              try {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = imgElement.width || 200;
                tempCanvas.height = imgElement.height || 50;
                const tempCtx = tempCanvas.getContext('2d');
                if (tempCtx) {
                  // Set white background first
                  tempCtx.fillStyle = '#ffffff';
                  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                  // Then draw the image
                  tempCtx.drawImage(imgElement, 0, 0);
                  
                  // Try to get data URL - if it fails due to tainted canvas, use the original data URL if available
                  try {
                    const dataURL = tempCanvas.toDataURL('image/png');
                    img.setAttribute('href', dataURL);
                    img.removeAttribute('xlink:href');
                  } catch (toDataURLError) {
                    // If toDataURL fails (tainted canvas), check if we have the original data URL
                    if (href.startsWith('data:')) {
                      // Keep the original data URL
                      img.setAttribute('href', href);
                    } else {
                      // Remove the image if we can't convert it
                      console.warn('Cannot convert image to data URL, removing:', href);
                      img.remove();
                    }
                  }
                }
                resolve();
              } catch (error) {
                console.error('Error converting image to data URL:', error);
                // If conversion fails, remove the image element
                img.remove();
                resolve(); // Continue even if one image fails
              }
            };
            imgElement.onerror = () => {
              console.error('Error loading image:', href);
              // Remove the image if it fails to load
              img.remove();
              resolve(); // Continue even if image fails to load
            };
            
            // Try to load the image
            try {
              imgElement.src = href;
            } catch (error) {
              console.error('Error setting image src:', error);
              img.remove();
              resolve();
            }
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
            toast({
              title: t('pages.certificate.error'),
              description: t('pages.certificate.cannotCreateCanvas'),
              variant: 'destructive',
            });
            console.error('Could not get canvas context');
            setIsDownloadingPNG(false);
            return;
          }

          // Set white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Convert SVG to image - ensure proper namespace and all images are data URLs
          const svgData = new XMLSerializer().serializeToString(svgClone);
          // Fix namespace issues
          const fixedSvgData = svgData.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');
          
          // Convert SVG to data URL directly instead of blob URL to avoid CORS issues
          const svgBase64 = btoa(unescape(encodeURIComponent(fixedSvgData)));
          const svgDataURL = `data:image/svg+xml;base64,${svgBase64}`;

          const img = new Image();
          // No need to set crossOrigin for data URLs
          img.onload = () => {
            try {
              // Draw the image on canvas
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

              // Try toDataURL first (works even with some tainted canvases in some browsers)
              let downloadSuccess = false;
              try {
                const dataURL = canvas.toDataURL('image/png');
                // Check if dataURL is valid (not the default empty image)
                if (dataURL && dataURL !== 'data:,') {
                  const link = document.createElement('a');
                  link.href = dataURL;
                  const filename = `certificate-${recipient ? recipient.replace(/[^a-z0-9]/gi, '-').toLowerCase() : 'certificate'}-${Date.now()}.png`;
                  link.download = filename;
                  link.style.display = 'none';
                  document.body.appendChild(link);
                  link.click();
                  setTimeout(() => {
                    document.body.removeChild(link);
                    setIsDownloadingPNG(false);
                    toast({
                      title: t('pages.certificate.downloadComplete'),
                      description: t('pages.certificate.downloadCompleteDesc'),
                    });
                  }, 100);
                  downloadSuccess = true;
                }
              } catch (dataURLError) {
                console.warn('toDataURL failed:', dataURLError);
              }
              
              // If toDataURL failed, try toBlob as fallback
              if (!downloadSuccess) {
                try {
                  canvas.toBlob((blob) => {
                    if (!blob) {
                      toast({
                        title: t('pages.certificate.exportFailed'),
                        description: t('pages.certificate.exportFailedDesc'),
                        variant: 'destructive',
                      });
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
                      toast({
                        title: 'Download Complete',
                        description: 'Your certificate has been downloaded successfully.',
                      });
                    }, 100);
                  }, 'image/png', 1.0);
                } catch (toBlobError) {
                  console.error('toBlob also failed:', toBlobError);
                  toast({
                    title: t('pages.certificate.exportFailed'),
                    description: t('pages.certificate.exportFailedSecurity'),
                    variant: 'destructive',
                  });
                  setIsDownloadingPNG(false);
                }
              }
            } catch (error) {
              console.error('Error creating PNG:', error);
              toast({
                title: t('pages.certificate.error'),
                description: `${t('pages.certificate.errorCreatingPNG')}${error instanceof Error ? error.message : t('pages.certificate.unknownError')}. ${t('pages.certificate.tryPrintPDF')}`,
                variant: 'destructive',
              });
              setIsDownloadingPNG(false);
            }
          };
          img.onerror = (error) => {
            console.error('Error loading SVG image:', error);
            toast({
              title: t('pages.certificate.error'),
              description: t('pages.certificate.failedToLoadSVG'),
              variant: 'destructive',
            });
            setIsDownloadingPNG(false);
          };
          img.src = svgDataURL;
        } catch (error) {
          console.error('Error in PNG conversion:', error);
          toast({
            title: t('pages.certificate.error'),
            description: `${t('pages.certificate.errorConvertingPNG')}${error instanceof Error ? error.message : t('pages.certificate.unknownError')}`,
            variant: 'destructive',
          });
          setIsDownloadingPNG(false);
        }
      }).catch((error) => {
        console.error('Error processing images:', error);
        toast({
          title: t('pages.certificate.error'),
          description: `${t('pages.certificate.errorProcessingImages')}${error instanceof Error ? error.message : t('pages.certificate.unknownError')}`,
          variant: 'destructive',
        });
        setIsDownloadingPNG(false);
      });
    } catch (error) {
      console.error('Download PNG error:', error);
        toast({
          title: t('pages.certificate.error'),
          description: `${t('pages.certificate.failedToDownloadPNG')}${error instanceof Error ? error.message : t('pages.certificate.unknownError')}. ${t('pages.certificate.tryAgainOrPrintPDF')}`,
          variant: 'destructive',
        });
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
        {awardTitle || t('pages.certificate.defaultAwardTitle')}
      </text>
      {/* Recipient */}
      <text x="560" y="300" textAnchor="middle" fontSize="36" fill={effective.text} fontFamily={effective.fontFamily}>
        {t('pages.certificate.awardedTo')}
      </text>
      <text x="560" y="360" textAnchor="middle" fontSize="56" fontWeight="700" fill={effective.accent} fontFamily={effective.fontFamily}
        style={{ letterSpacing: '1px' }}>
        {recipient || t('pages.certificate.yourNameHere')}
      </text>
      {/* Reason */}
      <foreignObject x="160" y="420" width="800" height="120">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ textAlign: 'center', color: effective.text, fontSize: 24, whiteSpace: 'pre-line', fontFamily: effective.fontFamily as any }}>
          {reason || t('pages.certificate.defaultReason')}
        </div>
      </foreignObject>
      {/* Footer lines */}
      <line x1="200" y1="620" x2="460" y2="620" stroke="#94a3b8" strokeWidth="2" />
      <text x="330" y="650" textAnchor="middle" fontSize="18" fill={effective.text} fontFamily={effective.fontFamily}>{t('pages.handwriting.date')}{formattedDate ? `: ${formattedDate}` : ''}</text>
      {/* Signature area - signature image above the line, name text below the line */}
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
        </g>
      ) : null}
      <line x1="660" y1="620" x2="920" y2="620" stroke="#94a3b8" strokeWidth="2" />
      {/* Name text always below the line */}
      {signatureImage && issuer ? (
        <text x="790" y="650" textAnchor="middle" fontSize="16" fill={effective.text} fontFamily={effective.fontFamily}>{issuer}</text>
      ) : !signatureImage && issuer ? (
        <text x="790" y="650" textAnchor="middle" fontSize="18" fill={effective.text} fontFamily={effective.fontFamily}>{t('pages.certificate.signature')}{issuer ? `: ${issuer}` : ''}</text>
      ) : null}
      {/* Official Seal/Stamp */}
      {sealGraphic}
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-amber-50" dir={isRTL ? 'rtl' : 'ltr'}>
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
            {t('pages.printables.title')}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            {t('pages.certificate.title')}
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-600 lg:mx-0 lg:text-base">
            {t('pages.certificate.subtitle')}
          </p>
        </header>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,420px)_1fr] items-start lg:items-stretch lg:pb-12">
          <div className="lg:sticky lg:top-24 lg:pr-2">
            <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl backdrop-blur-sm lg:h-[calc(100vh-8rem)] lg:min-h-[680px] max-h-[90vh] sm:max-h-none">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" aria-hidden />
              <div className="flex flex-col gap-4 px-6 pb-6 pt-7 sm:px-8 lg:flex-1 lg:overflow-y-auto">
                <section className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{t('pages.certificate.generalDetails')}</p>
                    <h2 className="text-lg font-semibold text-slate-900">{t('pages.certificate.personalizeAward')}</h2>
                    <p className="text-sm text-slate-500">{t('pages.certificate.personalizeAwardDesc')}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient" className="text-slate-700">{t('pages.certificate.recipientName')}</Label>
                      <Input id="recipient" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder={t('pages.certificate.recipientPlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="awardTitle" className="text-slate-700">{t('pages.certificate.awardTitle')}</Label>
                      <Input id="awardTitle" value={awardTitle} onChange={e => setAwardTitle(e.target.value)} placeholder={t('pages.certificate.awardTitlePlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-slate-700">{t('pages.certificate.reason')}</Label>
                      <Textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder={t('pages.certificate.reasonPlaceholder')} className="min-h-[120px]" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-slate-700">{t('pages.handwriting.date')}</Label>
                        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issuer" className="text-slate-700">{t('pages.certificate.signatureIssuer')}</Label>
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
                              {t('pages.certificate.text')}
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
                              {t('pages.certificate.upload')}
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
                              {t('pages.certificate.draw')}
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
                                placeholder={t('pages.certificate.issuerPlaceholder')}
                                maxLength={30}
                              />
                              <p className="text-xs text-slate-500">{issuer.length}/30 {t('pages.certificate.characters')}</p>
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
                                    // Validate file size (max 5MB)
                                    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                                    if (file.size > maxSize) {
                                      toast({
                                        title: t('pages.certificate.fileTooLarge'),
                                        description: t('pages.certificate.fileTooLargeDesc'),
                                        variant: 'destructive',
                                      });
                                      // Reset the input
                                      e.target.value = '';
                                      return;
                                    }
                                    
                                    // Validate file type
                                    if (!file.type.startsWith('image/')) {
                                      toast({
                                        title: t('pages.certificate.invalidFileType'),
                                        description: t('pages.certificate.invalidFileTypeDesc'),
                                        variant: 'destructive',
                                      });
                                      e.target.value = '';
                                      return;
                                    }
                                    
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      setSignatureImage(event.target?.result as string);
                                      toast({
                                        title: t('pages.certificate.signatureUploaded'),
                                        description: t('pages.certificate.signatureUploadedDesc'),
                                      });
                                    };
                                    reader.onerror = () => {
                                      toast({
                                        title: t('pages.certificate.uploadFailed'),
                                        description: t('pages.certificate.uploadFailedDesc'),
                                        variant: 'destructive',
                                      });
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
                                    {t('pages.certificate.remove')}
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
                                    {t('pages.certificate.clear')}
                                  </button>
                                </div>
                              ) : (
                                <div className="text-sm text-slate-500">{t('pages.certificate.clickDrawToOpen')}</div>
                              )}
                              <div className="mt-2 space-y-1">
                                <Input
                                  value={issuer}
                                  onChange={e => {
                                    if (e.target.value.length <= 30) {
                                      setIssuer(e.target.value);
                                    }
                                  }}
                                  placeholder={t('pages.certificate.nameOptional')}
                                  maxLength={30}
                                />
                                <p className="text-xs text-slate-500">{issuer.length}/30 {t('pages.certificate.characters')}</p>
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{t('pages.certificate.styleLayout')}</p>
                    <h2 className="text-lg font-semibold text-slate-900">{t('pages.certificate.pickTheLook')}</h2>
                    <p className="text-sm text-slate-500">{t('pages.certificate.pickTheLookDesc')}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700">{t('pages.certificate.quickStartTemplates')}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAwardTitle(t('pages.certificate.templates.studentOfMonth.title'));
                            setReason(t('pages.certificate.templates.studentOfMonth.reason'));
                            setTheme('gold');
                            setTemplateStyle('academic');
                            setBadgeIcon('gold-seal');
                            setShowSeal(true);
                            setSealStyle('academic');
                            setFontStyle('serif');
                            setBgStyle('none');
                            toast({
                              title: t('pages.certificate.templateApplied'),
                              description: t('pages.certificate.templates.studentOfMonth.applied'),
                            });
                          }}
                          className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
                        >
                          {t('pages.certificate.templates.studentOfMonth.title')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAwardTitle(t('pages.certificate.templates.perfectAttendance.title'));
                            setReason(t('pages.certificate.templates.perfectAttendance.reason'));
                            setTheme('classic');
                            setTemplateStyle('simple');
                            setBadgeIcon('blue-ribbon');
                            setShowSeal(false);
                            setFontStyle('print');
                            setBgStyle('none');
                            toast({
                              title: t('pages.certificate.templateApplied'),
                              description: t('pages.certificate.templates.perfectAttendance.applied'),
                            });
                          }}
                          className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
                        >
                          {t('pages.certificate.templates.perfectAttendance.title')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAwardTitle(t('pages.certificate.templates.excellence.title'));
                            setReason(t('pages.certificate.templates.excellence.reason'));
                            setTheme('rainbow');
                            setTemplateStyle('ribbon');
                            setBadgeIcon('starburst');
                            setShowSeal(false);
                            setFontStyle('cursive');
                            setBgStyle('sparkle');
                            toast({
                              title: t('pages.certificate.templateApplied'),
                              description: t('pages.certificate.templates.excellence.applied'),
                            });
                          }}
                          className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
                        >
                          {t('pages.certificate.templates.excellence.title')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAwardTitle(t('pages.certificate.templates.readingAchievement.title'));
                            setReason(t('pages.certificate.templates.readingAchievement.reason'));
                            setTheme('animals');
                            setTemplateStyle('medal');
                            setBadgeIcon('green-laurel');
                            setShowSeal(false);
                            setFontStyle('comic');
                            setBgStyle('wavy');
                            toast({
                              title: t('pages.certificate.templateApplied'),
                              description: t('pages.certificate.templates.readingAchievement.applied'),
                            });
                          }}
                          className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
                        >
                          {t('pages.certificate.templates.readingAchievement.title')}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme" className="text-slate-700">{t('pages.certificate.theme')}</Label>
                      <div className="relative">
                        <select
                          id="theme"
                          value={theme}
                          onChange={e => setTheme(e.target.value as typeof theme)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="classic">{t('pages.certificate.themes.classic')}</option>
                          <option value="rainbow">{t('pages.certificate.themes.rainbow')}</option>
                          <option value="space">{t('pages.certificate.themes.space')}</option>
                          <option value="animals">{t('pages.certificate.themes.animals')}</option>
                          <option value="gold">{t('pages.certificate.themes.gold')}</option>
                          <option value="confetti">{t('pages.certificate.themes.confetti')}</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="M3.5 5.5L8 10l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateStyle" className="text-slate-700">{t('pages.certificate.template')}</Label>
                      <div className="relative">
                        <select
                          id="templateStyle"
                          value={templateStyle}
                          onChange={e => setTemplateStyle(e.target.value as typeof templateStyle)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="simple">{t('pages.certificate.templates.simple')}</option>
                          <option value="ribbon">{t('pages.certificate.templates.ribbon')}</option>
                          <option value="medal">{t('pages.certificate.templates.medal')}</option>
                          <option value="trophy">{t('pages.certificate.templates.trophy')}</option>
                          <option value="academic">{t('pages.certificate.templates.academic')}</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="M3.5 5.5L8 10l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="badgeIcon" className="text-slate-700">{t('pages.certificate.badges')}</Label>
                      <div className="relative">
                        <select
                          id="badgeIcon"
                          value={badgeIcon}
                          onChange={e => setBadgeIcon(e.target.value as typeof badgeIcon)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="none">{t('pages.certificate.badgeOptions.none')}</option>
                          <option value="gold-seal">{t('pages.certificate.badgeOptions.goldSeal')}</option>
                          <option value="silver-seal">{t('pages.certificate.badgeOptions.silverSeal')}</option>
                          <option value="blue-ribbon">{t('pages.certificate.badgeOptions.blueRibbon')}</option>
                          <option value="green-laurel">{t('pages.certificate.badgeOptions.greenLaurel')}</option>
                          <option value="red-medal">{t('pages.certificate.badgeOptions.redMedal')}</option>
                          <option value="starburst">{t('pages.certificate.badgeOptions.starburst')}</option>
                          <option value="shield">{t('pages.certificate.badgeOptions.shield')}</option>
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
                        <Label htmlFor="showSeal" className="text-slate-700 font-semibold">{t('pages.certificate.officialSeal')}</Label>
                        <p className="text-xs text-slate-500">{t('pages.certificate.officialSealDesc')}</p>
                      </div>
                      <Switch checked={showSeal} onCheckedChange={setShowSeal} aria-label={t('pages.certificate.toggleOfficialSeal')} />
                    </div>
                    {showSeal && (
                      <div className="space-y-2">
                        <Label htmlFor="sealStyle" className="text-slate-700">{t('pages.certificate.sealStyle')}</Label>
                        <div className="relative">
                          <select
                            id="sealStyle"
                            value={sealStyle}
                            onChange={e => setSealStyle(e.target.value as typeof sealStyle)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                          >
                            <option value="classic-official">{t('pages.certificate.sealStyles.classicOfficial')}</option>
                            <option value="notary">{t('pages.certificate.sealStyles.notary')}</option>
                            <option value="academic">{t('pages.certificate.sealStyles.academic')}</option>
                            <option value="government">{t('pages.certificate.sealStyles.government')}</option>
                            <option value="corporate">{t('pages.certificate.sealStyles.corporate')}</option>
                            <option value="medallion">{t('pages.certificate.sealStyles.medallion')}</option>
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
                      <Label htmlFor="bgStyle" className="text-slate-700">{t('pages.certificate.backgroundStyle')}</Label>
                      <div className="relative">
                        <select
                          id="bgStyle"
                          value={bgStyle}
                          onChange={e => setBgStyle(e.target.value as typeof bgStyle)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="none">{t('pages.certificate.bgStyles.none')}</option>
                          <option value="wavy">{t('pages.certificate.bgStyles.wavy')}</option>
                          <option value="bands">{t('pages.certificate.bgStyles.bands')}</option>
                          <option value="rosette">{t('pages.certificate.bgStyles.rosette')}</option>
                          <option value="sparkle">{t('pages.certificate.bgStyles.sparkle')}</option>
                          <option value="sunburst">{t('pages.certificate.bgStyles.sunburst')}</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="M3.5 5.5L8 10l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fontStyle" className="text-slate-700">{t('pages.certificate.fontStyle')}</Label>
                      <div className="relative">
                        <select
                          id="fontStyle"
                          value={fontStyle}
                          onChange={e => setFontStyle(e.target.value as typeof fontStyle)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="print">{t('pages.certificate.fontStyles.print')}</option>
                          <option value="cursive">{t('pages.certificate.fontStyles.cursive')}</option>
                          <option value="serif">{t('pages.certificate.fontStyles.serif')}</option>
                          <option value="comic">{t('pages.certificate.fontStyles.comic')}</option>
                          <option value="handwritten">{t('pages.certificate.fontStyles.handwritten')}</option>
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{t('pages.certificate.colorsPrint')}</p>
                    <h2 className="text-lg font-semibold text-slate-900">{t('pages.certificate.makePrintReady')}</h2>
                    <p className="text-sm text-slate-500">{t('pages.certificate.makePrintReadyDesc')}</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{t('pages.certificate.inkFriendly')}</p>
                        <p className="text-xs text-slate-500">{t('pages.certificate.inkFriendlyDesc')}</p>
                      </div>
                      <Switch checked={inkFriendly} onCheckedChange={setInkFriendly} aria-label={t('pages.certificate.toggleInkFriendly')} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="textColor" className="text-slate-700">{t('pages.certificate.textColor')}</Label>
                        <input
                          id="textColor"
                          type="color"
                          value={textColorOverride || colors.text}
                          onChange={e => setTextColorOverride(e.target.value)}
                          className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accentColor" className="text-slate-700">{t('pages.certificate.nameColor')}</Label>
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
                        {t('pages.certificate.resetColors')}
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
                        <span>{isDownloadingPNG ? t('pages.certificate.generatingPNG') : t('pages.certificate.downloadPNG')}</span>
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
                        <span>{t('pages.certificate.printSavePDF')}</span>
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{t('pages.certificate.livePreview')}</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{t('pages.certificate.watchUpdate')}</h2>
                  <p className="text-sm text-slate-500">{t('pages.certificate.sizedForPaper')}</p>
                </div>
                <div className="w-full rounded-full border border-white/80 bg-white/70 px-4 py-2 text-center text-xs font-semibold text-slate-500 shadow-sm lg:w-auto">
                  {t('pages.certificate.printReadyLayout')}
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
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">{t('pages.certificate.exploreMore.printables')}</span>
            <span className="text-sm text-indigo-700/80">{t('pages.certificate.exploreMore.printablesDesc')}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
              {t('pages.certificate.exploreMore.explore')}
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
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">{t('pages.certificate.exploreMore.handwriting')}</span>
            <span className="text-sm text-emerald-700/80">{t('pages.certificate.exploreMore.handwritingDesc')}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              {t('pages.certificate.exploreMore.startWriting')}
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
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">{t('pages.certificate.exploreMore.nameTracing')}</span>
            <span className="text-sm text-rose-700/80">{t('pages.certificate.exploreMore.nameTracingDesc')}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
              {t('pages.certificate.exploreMore.tryItNow')}
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
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">{t('pages.certificate.exploreMore.worksheets')}</span>
            <span className="text-sm text-amber-700/80">{t('pages.certificate.exploreMore.worksheetsDesc')}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
              {t('pages.certificate.exploreMore.viewSets')}
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
              <h3 className="text-xl font-semibold text-slate-900">{t('pages.certificate.drawSignature')}</h3>
              <button
                onClick={() => setShowSignatureDrawer(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label={t('pages.certificate.close')}
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
                {t('pages.certificate.clear')}
              </button>
              <button
                onClick={() => {
                  if (signatureCanvasRef.current) {
                    const dataURL = signatureCanvasRef.current.toDataURL('image/png');
                    setSignatureImage(dataURL);
                    setShowSignatureDrawer(false);
                    toast({
                      title: t('pages.certificate.signatureSaved'),
                      description: t('pages.certificate.signatureSavedDesc'),
                    });
                  }
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                {t('pages.certificate.saveSignature')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import jsPDF from 'jspdf';

/**
 * Helper to convert hex to RGB for jsPDF
 */
export const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

/**
 * Draws a single worksheet layout on a jsPDF instance.
 * Replicates the SVG structure from NameTracingGeneratorPage.
 */
export const drawWorksheetOnPDF = (
    doc: any,
    name: string,
    config: {
        pageWidth: number;
        pageHeight: number;
        margin: number;
        fontStyle: string;
        lineStyle: string;
        patternStyle: string;
        showGuideDots: boolean;
        rowCount: number;
        letterCase: 'original' | 'title' | 'upper' | 'lower';
        sizeMultiplier: number;
        baseFontSize: number;
        xOffset?: number;
        yOffset?: number;
        scale?: number;
        colorTheme?: string;
        decoration?: string;
    },
    formatName: (n: string, c: any) => string
) => {
    const {
        pageWidth,
        pageHeight,
        margin,
        fontStyle,
        lineStyle,
        patternStyle,
        showGuideDots,
        rowCount,
        letterCase,
        sizeMultiplier,
        baseFontSize,
        xOffset = 0,
        yOffset = 0,
        scale = 1,
        colorTheme = 'classic',
        decoration = 'none',
    } = config;

    const THEMES: Record<string, any> = {
        classic: { primary: '#94a3b8', secondary: '#cbd5f5', text: '#94a3b8', dots: '#34d399', bg: '#f8fafc' },
        rainbow: { primary: '#cbd5f1', secondary: '#e2e8f0', text: '#475569', dots: '#ec4899', bg: '#fffafb', rainbow: true },
        ocean: { primary: '#0ea5e9', secondary: '#bae6fd', text: '#0369a1', dots: '#2DD4BF', bg: '#f0f9ff' },
        candy: { primary: '#db2777', secondary: '#fbcfe8', text: '#be185d', dots: '#a855f7', bg: '#fff1f2' },
        forest: { primary: '#059669', secondary: '#d1fae5', text: '#065f46', dots: '#f59e0b', bg: '#f0fdf4' },
        sunset: { primary: '#ea580c', secondary: '#ffedd5', text: '#9a3412', dots: '#ef4444', bg: '#fff7ed' },
    };

    const RAINBOW_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    const theme = THEMES[colorTheme] || THEMES.classic;

    const formatted = formatName(name, letterCase);

    const practicingRows = (() => {
        const sequence = patternStyle === 'traceOnly' ? ['trace'] : ['trace', 'trace', 'blank'];
        const rows: Array<'trace' | 'blank'> = [];
        for (let i = 0; rows.length < rowCount; i += 1) {
            rows.push(sequence[i % sequence.length] as 'trace' | 'blank');
        }
        return rows;
    })();

    const startX = (margin + 40) * scale + xOffset;
    const endX = (pageWidth - margin + 20) * scale + xOffset;
    const usableWidth = endX - startX;
    const maxWidth = Math.max(140 * scale, usableWidth - 80 * scale);

    doc.setFont('Codystar', 'normal');
    doc.setFontSize(baseFontSize * scale);
    const measuredWidth = doc.getTextWidth(formatted);

    const traceMinBase = fontStyle === 'bubble' ? 52 : fontStyle === 'script' ? 48 : 44;
    const blankMinBase = fontStyle === 'bubble' ? 60 : fontStyle === 'script' ? 54 : 50;
    const baseMin = practicingRows.includes('trace') ? traceMinBase : blankMinBase;
    const minFontSize = Math.max(36, Math.round(baseMin * sizeMultiplier * (practicingRows.includes('trace') ? 1 : 0.9)));

    let fittedSize = baseFontSize * scale;
    if (measuredWidth > maxWidth && measuredWidth > 0) {
        const ratio = maxWidth / measuredWidth;
        fittedSize = Math.max(Math.round(baseFontSize * scale * ratio), minFontSize * scale);
    }

    const baselineOffset = (lineStyle === 'primary' ? 96 : 88) * scale;
    const rowGap = (lineStyle === 'primary' ? 170 : 150) * scale;
    const maxRows = Math.min(rowCount, Math.max(3, Math.floor(((pageHeight - margin * 2) * scale) / rowGap)));
    const rowsToDraw = practicingRows.slice(0, maxRows);

    // Background (Sheet color)
    const bgRGB = hexToRgb(theme.bg);
    doc.setFillColor(bgRGB.r, bgRGB.g, bgRGB.b);
    doc.roundedRect(0 + xOffset, 0 + yOffset, pageWidth * scale, pageHeight * scale, 36 * scale, 36 * scale, 'F');

    // Frame (using theme secondary color for border if not classic)
    const frameStroke = hexToRgb(theme.secondary);
    doc.setDrawColor(frameStroke.r, frameStroke.g, frameStroke.b);
    doc.setFillColor(255, 255, 255); // Inner frame always white
    doc.setLineWidth(2 * scale);
    doc.roundedRect(
        (margin - 24) * scale + xOffset,
        (margin - 24) * scale + yOffset,
        (pageWidth - (margin - 24) * 2) * scale,
        (pageHeight - (margin - 24) * 2) * scale,
        28 * scale,
        28 * scale,
        'FD'
    );

    // Decorations
    if (decoration !== 'none') {
        const decoRGB = hexToRgb(theme.dots);
        doc.setFillColor(decoRGB.r, decoRGB.g, decoRGB.b);
        const decoPos = [
            { x: (margin + 10) * scale + xOffset, y: (margin + 10) * scale + yOffset },
            { x: (pageWidth - margin - 10) * scale + xOffset, y: (margin + 10) * scale + yOffset },
            { x: (margin + 10) * scale + xOffset, y: (pageHeight - margin - 10) * scale + yOffset },
            { x: (pageWidth - margin - 10) * scale + xOffset, y: (pageHeight - margin - 10) * scale + yOffset }
        ];

        decoPos.forEach(pos => {
            if (decoration === 'stars') {
                const r = 10 * scale;
                const innerR = 4 * scale;
                const points: number[][] = [];
                for (let i = 0; i < 11; i++) {
                    const radius = i % 2 === 0 ? r : innerR;
                    const angle = (Math.PI * i) / 5 - Math.PI / 2;
                    points.push([pos.x + radius * Math.cos(angle), pos.y + radius * Math.sin(angle)]);
                }
                // Draw star using polygon lines
                for (let i = 0; i < points.length - 1; i++) {
                    doc.line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
                }
                // Fill the star (approximate with a center point and triangles)
                for (let i = 0; i < points.length - 1; i++) {
                    doc.triangle(pos.x, pos.y, points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], 'F');
                }
            } else if (decoration === 'hearts') {
                const s = 6 * scale;
                doc.setFillColor(decoRGB.r, decoRGB.g, decoRGB.b);
                // Heart shape using three circles and a triangle
                doc.circle(pos.x - s / 1.5, pos.y - s / 2, s, 'F');
                doc.circle(pos.x + s / 1.5, pos.y - s / 2, s, 'F');
                // The bottom triangle
                doc.triangle(pos.x - s, pos.y + s / 4, pos.x + s, pos.y + s / 4, pos.x, pos.y + s * 2, 'F');
            }
        });
    }

    rowsToDraw.forEach((rowType, index) => {
        const baselineY = (margin + 120) * scale + index * rowGap + yOffset;
        const currentStartX = (margin + 40) * scale + xOffset;
        const currentEndX = (pageWidth - margin + 20) * scale + xOffset;
        const topLine = baselineY - baselineOffset;
        const midLine = baselineY - baselineOffset / 2;
        const showPrimary = lineStyle === 'primary';

        const secondaryRGB = hexToRgb(theme.secondary);
        const primaryRGB = hexToRgb(theme.primary);

        if (showPrimary) {
            doc.setDrawColor(secondaryRGB.r, secondaryRGB.g, secondaryRGB.b);
            doc.setLineWidth(3 * scale);
            doc.setLineDashPattern([10 * scale, 14 * scale], 0);
            doc.line(currentStartX, topLine, currentEndX, topLine);

            doc.setLineWidth(2.5 * scale);
            doc.setLineDashPattern([14 * scale, 14 * scale], 0);
            doc.line(currentStartX, midLine, currentEndX, midLine);
        }

        doc.setDrawColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
        doc.setLineWidth(4 * scale);
        doc.setLineDashPattern([], 0);
        doc.line(currentStartX, baselineY, currentEndX, baselineY);

        if (rowType === 'blank') {
            doc.setDrawColor(secondaryRGB.r, secondaryRGB.g, secondaryRGB.b);
            doc.setLineWidth(2 * scale);
            doc.setLineDashPattern([14 * scale, 16 * scale], 0);
            doc.line(currentStartX, baselineY + 26 * scale, currentEndX, baselineY + 26 * scale);
        } else {
            if (showGuideDots) {
                const dotRGB = hexToRgb(theme.dots);
                doc.setFillColor(dotRGB.r, dotRGB.g, dotRGB.b);
                doc.circle(currentStartX - 16 * scale, baselineY - baselineOffset / 3, 8 * scale, 'F');
            }

            doc.setFont('Codystar', 'normal');
            doc.setFontSize(fittedSize);

            // Calculate letter spacing (approximate from SVG)
            const letterSpacing = (fittedSize * 0.05); // Rough 5% spacing to match preview
            doc.setCharSpace(letterSpacing);

            if (theme.rainbow) {
                let currentX = currentStartX;
                const chars = Array.from(formatted);
                chars.forEach((char, i) => {
                    const charColor = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
                    const rgb = hexToRgb(charColor);
                    doc.setTextColor(rgb.r, rgb.g, rgb.b);
                    doc.text(char, currentX, baselineY - 8 * scale);
                    // Update X with actual text width + char spacing
                    currentX += doc.getTextWidth(char) + letterSpacing;
                });
            } else {
                const textRGB = hexToRgb(theme.text);
                doc.setTextColor(textRGB.r, textRGB.g, textRGB.b);
                doc.text(formatted, currentStartX, baselineY - 8 * scale);
            }
            doc.setCharSpace(0); // Reset for next elements
        }
    });

    // Trace slowing text at bottom
    const footerRGB = hexToRgb(theme.primary);
    doc.setTextColor(footerRGB.r, footerRGB.g, footerRGB.b);
    doc.setFontSize(14 * scale);
    doc.text('Trace slowly and carefully...', margin * scale + xOffset, (pageHeight - margin + 10) * scale + yOffset);

    return doc;
};

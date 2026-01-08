import { jsPDF } from 'jspdf';

/**
 * Draws a single worksheet layout on a jsPDF instance.
 * Replicates the SVG structure from generateSVGForName.
 */
export const drawWorksheetOnPDF = (
    doc: jsPDF,
    name: string,
    config: {
        pageWidth: number;
        pageHeight: number;
        margin: number;
        fontStyle: string;
        lineStyle: string;
        patternStyle: 'traceOnly' | 'traceBlank' | 'traceAndWrite';
        showGuideDots: boolean;
        rowCount: number;
        letterCase: 'original' | 'title' | 'upper' | 'lower';
        sizeMultiplier: number;
        baseFontSize: number;
        xOffset?: number;
        yOffset?: number;
        scale?: number;
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
    } = config;

    const formatted = formatName(name, letterCase);

    const practicingRows = (() => {
        // Correct mapping of patternStyle to row types
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

    // Measure text width for jsPDF.
    doc.setFont('Codystar', 'normal');
    doc.setFontSize(baseFontSize * scale);
    const measuredWidth = doc.getTextWidth(formatted);

    const dominantRowType = practicingRows.find((row) => row === 'trace') ? 'trace' : 'blank';
    const isTraceRow = dominantRowType === 'trace';

    const traceMinBase = fontStyle === 'bubble' ? 52 : fontStyle === 'script' ? 48 : 44;
    const blankMinBase = fontStyle === 'bubble' ? 60 : fontStyle === 'script' ? 54 : 50;
    const baseMin = isTraceRow ? traceMinBase : blankMinBase;
    const minFontSize = Math.max(36, Math.round(baseMin * sizeMultiplier * (isTraceRow ? 1 : 0.9)));

    let fittedSize = baseFontSize * scale;
    if (measuredWidth > maxWidth && measuredWidth > 0) {
        const ratio = maxWidth / measuredWidth;
        fittedSize = Math.max(Math.round(baseFontSize * scale * ratio), minFontSize * scale);
    }

    const baselineOffset = (lineStyle === 'primary' ? 96 : 88) * scale;
    const rowGap = (lineStyle === 'primary' ? 170 : 150) * scale;
    const maxRows = Math.min(rowCount, Math.max(3, Math.floor(((pageHeight - margin * 2) * scale) / rowGap)));
    const rowsToDraw = practicingRows.slice(0, maxRows);

    // Background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(0 + xOffset, 0 + yOffset, pageWidth * scale, pageHeight * scale, 36 * scale, 36 * scale, 'F');

    // Frame
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
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

    rowsToDraw.forEach((rowType, index) => {
        const baselineY = (margin + 120) * scale + index * rowGap + yOffset;
        const currentStartX = (margin + 40) * scale + xOffset;
        const currentEndX = (pageWidth - margin + 20) * scale + xOffset;
        const topLine = baselineY - baselineOffset;
        const midLine = baselineY - baselineOffset / 2;
        const showPrimary = lineStyle === 'primary';

        if (showPrimary) {
            // Top dashed line
            doc.setDrawColor(203, 213, 245);
            doc.setLineWidth(3 * scale);
            doc.setLineDashPattern([10 * scale, 14 * scale], 0);
            doc.line(currentStartX, topLine, currentEndX, topLine);

            // Mid dashed line
            doc.setDrawColor(219, 234, 254);
            doc.setLineWidth(2.5 * scale);
            doc.setLineDashPattern([14 * scale, 14 * scale], 0);
            doc.line(currentStartX, midLine, currentEndX, midLine);
        }

        // Baseline solid
        doc.setDrawColor(148, 163, 184);
        doc.setLineWidth(4 * scale);
        doc.setLineDashPattern([], 0);
        doc.line(currentStartX, baselineY, currentEndX, baselineY);

        if (rowType === 'blank') {
            // Descent line for blank rows
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(2 * scale);
            doc.setLineDashPattern([14 * scale, 16 * scale], 0);
            doc.line(currentStartX, baselineY + 26 * scale, currentEndX, baselineY + 26 * scale);
        } else {
            // Guide dots
            if (showGuideDots) {
                doc.setFillColor(52, 211, 153);
                doc.circle(currentStartX - 16 * scale, baselineY - baselineOffset / 3, 8 * scale, 'F');
            }

            // Draw Name
            doc.setFont('Codystar', 'normal');
            doc.setFontSize(fittedSize);
            doc.setTextColor(30, 41, 59); // Slate 800

            // jsPDF text drawing
            // @ts-ignore
            if (doc.setCharSpace) {
                // @ts-ignore
                doc.setCharSpace(0);
            }
            doc.text(formatted, currentStartX, baselineY - 8 * scale);
        }
    });

    return doc;
};

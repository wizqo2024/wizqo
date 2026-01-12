import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { CEDARVILLE_CURSIVE_TTF_BASE64, CODYSTAR_TTF_BASE64 } from '@/lib/fonts'

export interface PDFOptions {
    filename?: string
    scale?: number
    showAnswers?: boolean
    docTitle?: string
    orientation?: 'p' | 'l'
    packSections?: boolean // New option to allow multiple sections per page
}

/**
 * Unified utility to generate high-quality PDFs from worksheet sections.
 * This avoids "blind splitting" and ensures consistent branding and resolution.
 */
export async function generateWorksheetPDF(
    containerOrId: HTMLElement | string,
    options: PDFOptions = {}
) {
    const container = typeof containerOrId === 'string'
        ? document.getElementById(containerOrId)
        : containerOrId

    if (!container) {
        throw new Error(`Container element not found: ${containerOrId}`)
    }
    const {
        filename = 'worksheet.pdf',
        scale = 4.0, // Increased to 4.0 for higher quality
        docTitle = '',
        orientation = 'p',
        packSections = false
    } = options

    try {
        // 1. Find all worksheet sections to capture them individually (avoids blind splitting)
        let sections = Array.from(container.querySelectorAll('.worksheet-section')) as HTMLElement[]

        // Fallback: If no .worksheet-section found, try checking for InteractiveWorksheetSection children
        if (sections.length === 0) {
            // Find direct children that look like sections
            sections = Array.from(container.querySelectorAll(':scope > section')) as HTMLElement[]
        }

        // Fallback: If still no sections, capture the whole container as a single section
        if (sections.length === 0) {
            sections = [container]
        }

        const pdf = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: 'a4',
            compress: true // Enable compression for the PDF file
        })
        const pageWidthMm = orientation === 'p' ? 210 : 297
        const pageHeightMm = orientation === 'p' ? 297 : 210
        const footerHeightMm = 25 // Space reserved for footer at bottom
        const contentMaxHeightMm = pageHeightMm - footerHeightMm

        // Helper to draw footer on current PDF page
        const drawFooter = () => {
            const footerY = pageHeightMm - 15
            const xCenter = pageWidthMm / 2

            // Draw Logo using vector commands (safer than SVG/PNG data URLs in some browsers)
            const logoX = xCenter - 25
            const logoY = footerY - 5

            pdf.setFillColor(72, 69, 210) // #4845D2
            pdf.roundedRect(logoX, logoY, 9, 5, 1, 1, 'F')
            pdf.setFillColor(165, 180, 252) // #A5B4FC
            pdf.roundedRect(logoX + 1, logoY + 1, 7, 3, 0.5, 0.5, 'F')
            pdf.setFillColor(0, 0, 0)
            pdf.circle(logoX + 2.5, logoY + 2.5, 0.5, 'F')

            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(10)
            pdf.setTextColor(72, 69, 210) // #4845D2
            pdf.text('www.wizqo.com', xCenter - 13, footerY)

            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(8)
            pdf.setTextColor(100, 116, 139) // #64748b
            pdf.text(`Copyright © ${new Date().getFullYear()} Wizqo. All rights reserved.`, xCenter, footerY + 5, { align: 'center' })
        }

        // 2. Wait for fonts to be loaded in the main document first
        await (document as any).fonts?.ready;

        let currentY = 0

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i]

            // Check if this section explicitly requests a page break
            const forcePageBreak = section.classList.contains('pdf-force-page-break')

            // Capture each section
            const canvas = await html2canvas(section, {
                scale: scale,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: 60000,
                onclone: (clonedDoc: Document) => {
                    // 1. Inject custom fonts into the cloned document's head
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        @font-face {
                            font-family: 'Cedarville Cursive';
                            src: url(data:font/ttf;base64,${CEDARVILLE_CURSIVE_TTF_BASE64}) format('truetype');
                            font-display: block;
                        }
                        @font-face {
                            font-family: 'Codystar';
                            src: url(data:font/ttf;base64,${CODYSTAR_TTF_BASE64}) format('truetype');
                            font-display: block;
                        }
                        @font-face {
                            font-family: 'Inter';
                            src: local('Inter'), local('sans-serif');
                        }
                        body, text, span, div {
                            font-smoothing: antialiased !important;
                            -webkit-font-smoothing: antialiased !important;
                        }
                    `;
                    clonedDoc.getElementsByTagName('head')[0].appendChild(style);

                    // 2. CRITICAL: Inject fonts into SVGs specifically
                    const svgs = clonedDoc.querySelectorAll('svg');
                    svgs.forEach(svg => {
                        let defs = svg.querySelector('defs');
                        if (!defs) {
                            defs = clonedDoc.createElementNS('http://www.w3.org/2000/svg', 'defs');
                            svg.prepend(defs);
                        }
                        const svgStyle = clonedDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
                        svgStyle.innerHTML = `
                            @font-face {
                                font-family: 'Cedarville Cursive';
                                src: url(data:font/ttf;base64,${CEDARVILLE_CURSIVE_TTF_BASE64}) format('truetype');
                                font-display: block;
                            }
                            @font-face {
                                font-family: 'Codystar';
                                src: url(data:font/ttf;base64,${CODYSTAR_TTF_BASE64}) format('truetype');
                                font-display: block;
                            }
                        `;
                        defs.appendChild(svgStyle);
                    });

                    // 3. Force-trigger font loading
                    const fontForceLoad = clonedDoc.createElement('div');
                    fontForceLoad.style.cssText = 'position: absolute !important; opacity: 0 !important; pointer-events: none !important; top: 0 !important; left: 0 !important; z-index: -1 !important;';
                    fontForceLoad.innerHTML = `
                        <span style="font-family: 'Cedarville Cursive' !important;">force load</span>
                        <span style="font-family: 'Codystar' !important;">force load</span>
                    `;
                    clonedDoc.body.appendChild(fontForceLoad);

                    // 4. Adjust cloned section styles for better PDF look
                    const clonedSection = clonedDoc.querySelector('.worksheet-section') || clonedDoc.body.firstChild as HTMLElement
                    if (clonedSection instanceof HTMLElement) {
                        // Tighter padding if packing is enabled
                        const paddingBottom = packSections ? '30px' : '60px'
                        clonedSection.style.setProperty('padding', `20px 32px ${paddingBottom} 32px`, 'important')
                        clonedSection.style.setProperty('border-radius', '12px', 'important')
                        clonedSection.style.setProperty('position', 'relative', 'important')
                        clonedSection.style.setProperty('background', 'white', 'important')
                        clonedSection.style.setProperty('image-rendering', 'auto', 'important')
                        clonedSection.style.setProperty('border', 'none', 'important')
                        clonedSection.style.setProperty('box-shadow', 'none', 'important')

                        // Remove corner accents and other decorative elements
                        const accents = clonedSection.querySelectorAll('[class*="rounded-bl-full"], [class*="rounded-tr-full"], [class*="animate-gradient-x"]');
                        accents.forEach(el => {
                            if (el instanceof HTMLElement) {
                                el.style.setProperty('display', 'none', 'important');
                            }
                        });
                    }
                }
            })

            // Use PNG for lossless text and sharp lines
            const imgData = canvas.toDataURL('image/png')
            const imgWidth = pageWidthMm
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            const fitToPageThreshold = 1.3 // More conservative scaling

            // Logic to handle packing vs. one-per-page
            if (packSections) {
                // If the section is too tall for ANY page, scale it down or split it
                if (imgHeight > contentMaxHeightMm) {
                    if (imgHeight <= contentMaxHeightMm * fitToPageThreshold) {
                        // Scale to fit whole page
                        if (currentY > 0) {
                            drawFooter()
                            pdf.addPage()
                            currentY = 0
                        }
                        const scaleFactor = contentMaxHeightMm / imgHeight
                        const finalWidth = imgWidth * scaleFactor
                        const xPos = (pageWidthMm - finalWidth) / 2
                        pdf.addImage(imgData, 'JPEG', xPos, 0, finalWidth, contentMaxHeightMm, undefined, 'FAST')
                        currentY = contentMaxHeightMm
                    } else {
                        // Split across multiple pages
                        if (currentY > 0) {
                            drawFooter()
                            pdf.addPage()
                            currentY = 0
                        }
                        const totalSections = Math.ceil(imgHeight / contentMaxHeightMm)
                        for (let j = 0; j < totalSections; j++) {
                            const ySource = -(j * contentMaxHeightMm)
                            pdf.addImage(imgData, 'JPEG', 0, ySource, imgWidth, imgHeight, undefined, 'FAST')
                            drawFooter()
                            if (j < totalSections - 1) {
                                pdf.addPage()
                            } else {
                                currentY = imgHeight % contentMaxHeightMm
                            }
                        }
                    }
                } else {
                    // Check if it fits on CURRENT page
                    if (currentY + imgHeight > contentMaxHeightMm || forcePageBreak) {
                        drawFooter()
                        pdf.addPage()
                        currentY = 0
                    }
                    pdf.addImage(imgData, 'JPEG', 0, currentY, imgWidth, imgHeight, undefined, 'FAST')
                    currentY += imgHeight
                }
            } else {
                // Classic behavior: one section per page
                if (imgHeight <= pageHeightMm) {
                    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
                } else if (imgHeight <= pageHeightMm * fitToPageThreshold) {
                    const scaleFactor = pageHeightMm / imgHeight
                    const finalWidth = imgWidth * scaleFactor
                    const xPos = (pageWidthMm - finalWidth) / 2
                    pdf.addImage(imgData, 'JPEG', xPos, 0, finalWidth, pageHeightMm, undefined, 'FAST')
                } else {
                    const totalPages = Math.ceil(imgHeight / pageHeightMm)
                    for (let j = 0; j < totalPages; j++) {
                        const yPos = -(j * pageHeightMm)
                        pdf.addImage(imgData, 'JPEG', 0, yPos, imgWidth, imgHeight, undefined, 'FAST')
                        if (j < totalPages - 1) pdf.addPage()
                    }
                }
                drawFooter()
                if (i < sections.length - 1) {
                    pdf.addPage()
                }
            }
        }

        // Final footer for packed layout if anything was left
        if (packSections && currentY > 0) {
            drawFooter()
        }

        pdf.save(filename)
    } catch (error) {
        console.error('Unified PDF generation failed:', error)
        throw error
    }
}

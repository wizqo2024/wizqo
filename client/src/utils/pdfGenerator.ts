import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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
        const footerHeightMm = 35 // Increased to 35 for better breathing room
        const contentMaxHeightMm = pageHeightMm - footerHeightMm

        // Helper to draw footer on current PDF page
        const drawFooter = () => {
            const footerY = pageHeightMm - 12 // Lowered from 15 to 12
            const xCenter = pageWidthMm / 2

            // Mask any content bleeding into the footer zone
            pdf.setFillColor(255, 255, 255)
            pdf.rect(0, pageHeightMm - footerHeightMm, pageWidthMm, footerHeightMm, 'F')

            // Draw Logo using vector commands (safer than SVG/PNG data URLs in some browsers)
            const logoX = xCenter - 25
            const logoY = footerY - 5

            pdf.setFillColor(72, 69, 210) // #4845D2
            pdf.roundedRect(logoX, logoY, 9, 5, 1, 1, 'F')
            pdf.setFillColor(165, 180, 252) // #A5B4FC
            pdf.roundedRect(logoX + 1, logoY + 1, 7, 3, 0.5, 0.5, 'F')
            pdf.setFillColor(0, 0, 0)
            pdf.circle(logoX + 2.5, logoY + 2.5, 0.5, 'F')
            pdf.circle(logoX + 6.5, logoY + 2.5, 0.5, 'F') // Restored second eye

            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(10)
            pdf.setTextColor(72, 69, 210) // #4845D2
            pdf.text('www.wizqo.com', xCenter - 13, footerY)

            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(8)
            pdf.setTextColor(100, 116, 139) // #64748b
            pdf.text(`Copyright © ${new Date().getFullYear()} Wizqo. All rights reserved.`, xCenter, footerY + 5, { align: 'center' })
        }

        // Helper to fetch font as Base64
        const fetchFontBase64 = async (path: string) => {
            const res = await fetch(path)
            const buffer = await res.arrayBuffer()
            const bytes = new Uint8Array(buffer)
            let binary = ''
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i])
            }
            return window.btoa(binary)
        }

        const [cedarvilleB64, codystarB64, learningCurveB64, kgDotsB64] = await Promise.all([
            fetchFontBase64('/fonts/cedarville_cursive.ttf'),
            fetchFontBase64('/fonts/codystar.ttf'),
            fetchFontBase64('/fonts/learning_curve_dashed.ttf'),
            fetchFontBase64('/fonts/kg_primary_dots.ttf')
        ])

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
                            src: url(data:font/ttf;base64,${cedarvilleB64}) format('truetype');
                            font-display: block;
                        }
                        @font-face {
                            font-family: 'Codystar';
                            src: url(data:font/ttf;base64,${codystarB64}) format('truetype');
                            font-display: block;
                        }
                        @font-face {
                            font-family: 'Learning Curve Dashed';
                            src: url(data:font/ttf;base64,${learningCurveB64}) format('truetype');
                            font-display: block;
                        }
                        @font-face {
                            font-family: 'KG Primary Dots';
                            src: url(data:font/ttf;base64,${kgDotsB64}) format('truetype');
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
                        /* CRITICAL: Disable all animations to prevent capturing incomplete states (like zooming icons) */
                        * {
                            animation: none !important;
                            transition: none !important;
                            opacity: 1 !important; /* Ensure faded-in elements are visible */
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
                                font-family: 'Learning Curve Dashed';
                                src: url(data:font/ttf;base64,${learningCurveB64}) format('truetype');
                                font-display: block;
                            }
                            @font-face {
                                font-family: 'Cedarville Cursive';
                                src: url(data:font/ttf;base64,${cedarvilleB64}) format('truetype');
                                font-display: block;
                            }
                            @font-face {
                                font-family: 'Codystar';
                                src: url(data:font/ttf;base64,${codystarB64}) format('truetype');
                                font-display: block;
                            }
                            @font-face {
                                font-family: 'KG Primary Dots';
                                src: url(data:font/ttf;base64,${kgDotsB64}) format('truetype');
                                font-display: block;
                            }
                        `;
                        defs.appendChild(svgStyle);
                    });

                    // 3. Fix Gradient Text (background-clip: text) support in html2canvas
                    const gradientTexts = clonedDoc.querySelectorAll('.pdf-gradient-text');
                    gradientTexts.forEach(el => {
                        const htmlEl = el as HTMLElement;
                        const colors = htmlEl.dataset.gradientColors;
                        if (colors) {
                            const text = htmlEl.innerText;
                            const rect = htmlEl.getBoundingClientRect();
                            const style = window.getComputedStyle(htmlEl);

                            // Create SVG replacement
                            const svgNS = "http://www.w3.org/2000/svg";
                            const svg = document.createElementNS(svgNS, "svg");
                            svg.setAttribute("width", rect.width + "px");
                            svg.setAttribute("height", rect.height + "px");
                            svg.style.display = "block";
                            svg.style.margin = "0 auto";

                            // Define gradient
                            const defs = document.createElementNS(svgNS, "defs");
                            const gradient = document.createElementNS(svgNS, "linearGradient");
                            gradient.id = "textGradient-" + Math.random().toString(36).substr(2, 9);
                            gradient.setAttribute("x1", "0%");
                            gradient.setAttribute("y1", "100%");
                            gradient.setAttribute("x2", "100%");
                            gradient.setAttribute("y2", "0%"); // 45deg approx

                            const colorList = colors.split(',').map(c => c.trim());
                            colorList.forEach((c, idx) => {
                                const stop = document.createElementNS(svgNS, "stop");
                                stop.setAttribute("offset", `${(idx / (colorList.length - 1)) * 100}%`);
                                stop.setAttribute("stop-color", c);
                                gradient.appendChild(stop);
                            });
                            defs.appendChild(gradient);

                            // Add Font Style to SVG
                            const fontStyle = document.createElementNS(svgNS, "style");
                            fontStyle.textContent = `
                                @font-face {
                                    font-family: 'KG Primary Dots';
                                    src: url(data:font/ttf;base64,${kgDotsB64}) format('truetype');
                                }
                                text {
                                    font-family: 'KG Primary Dots', sans-serif;
                                    font-size: ${style.fontSize};
                                    font-weight: normal;
                                    dominant-baseline: central;
                                    text-anchor: middle;
                                }
                            `;
                            defs.appendChild(fontStyle);
                            svg.appendChild(defs);

                            // Create Text
                            const svgText = document.createElementNS(svgNS, "text");
                            svgText.textContent = text;
                            svgText.setAttribute("x", "50%");
                            svgText.setAttribute("y", "50%");
                            svgText.setAttribute("fill", `url(#${gradient.id})`);

                            svg.appendChild(svgText);

                            // Replace element
                            htmlEl.parentNode?.replaceChild(svg, htmlEl);
                        }
                    });

                    // 4. Force-trigger font loading
                    const fontForceLoad = clonedDoc.createElement('div');
                    fontForceLoad.style.cssText = 'position: absolute !important; opacity: 0 !important; pointer-events: none !important; top: 0 !important; left: 0 !important; z-index: -1 !important;';
                    fontForceLoad.innerHTML = `
                        <span style="font-family: 'Cedarville Cursive' !important;">force load</span>
                        <span style="font-family: 'Codystar' !important;">force load</span>
                        <span style="font-family: 'KG Primary Dots' !important;">force load</span>
                    `;
                    clonedDoc.body.appendChild(fontForceLoad);

                    // 5. Adjust cloned section styles for better PDF look
                    const clonedSections = clonedDoc.querySelectorAll('.worksheet-section');
                    clonedSections.forEach(clonedSection => {
                        if (clonedSection instanceof HTMLElement) {
                            // Match Print CSS Padding (0.5in ≈ 48px)
                            const paddingBottom = packSections ? '20px' : '48px'
                            const paddingTop = packSections ? '5px' : '48px'
                            const paddingSide = '48px';

                            clonedSection.style.setProperty('padding', `${paddingTop} ${paddingSide} ${paddingBottom} ${paddingSide}`, 'important')
                            clonedSection.style.setProperty('border-radius', '0', 'important') // 0 radius for print
                            clonedSection.style.setProperty('position', 'relative', 'important')
                            clonedSection.style.setProperty('background', 'white', 'important')
                            clonedSection.style.setProperty('image-rendering', 'auto', 'important')

                            // Only remove borders if they are 1px or less (to keep design borders on covers)
                            // or if the keeping class is NOT present
                            const borderStyle = window.getComputedStyle(clonedSection);
                            const borderWidth = parseFloat(borderStyle.borderWidth);
                            if (borderWidth <= 1 && !clonedSection.classList.contains('pdf-keep-border')) {
                                clonedSection.style.setProperty('border', 'none', 'important')
                            }

                            clonedSection.style.setProperty('box-shadow', 'none', 'important')
                            clonedSection.style.setProperty('width', '8.5in', 'important') // Explicit width
                            clonedSection.style.setProperty('height', '11in', 'important') // Explicit height

                            // Remove corner accents and other decorative elements
                            const accents = clonedSection.querySelectorAll('[class*="rounded-bl-full"], [class*="rounded-tr-full"], [class*="animate-gradient-x"]');
                            accents.forEach(el => {
                                if (el instanceof HTMLElement) {
                                    el.style.setProperty('display', 'none', 'important');
                                }
                            });
                        }
                    });
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
                        pdf.addImage(imgData, 'PNG', xPos, 0, finalWidth, contentMaxHeightMm, undefined, 'FAST')
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
                            pdf.addImage(imgData, 'PNG', 0, ySource, imgWidth, imgHeight, undefined, 'FAST')
                            drawFooter()
                            if (j < totalSections - 1) {
                                pdf.addPage()
                            } else {
                                currentY = (imgHeight % contentMaxHeightMm) + 8 // Added safety margin
                            }
                        }
                    }
                } else {
                    // Check if it fits on CURRENT page
                    if (currentY + imgHeight > contentMaxHeightMm || forcePageBreak) {
                        drawFooter()
                        pdf.addPage()
                        currentY = 5 // Initial top margin on new page
                    }
                    pdf.addImage(imgData, 'PNG', 0, currentY, imgWidth, imgHeight, undefined, 'FAST')
                    currentY += imgHeight + 8 // Increased gap between stacked sections
                }
            } else {
                // Classic behavior: one section per page
                if (imgHeight <= contentMaxHeightMm) {
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
                } else if (imgHeight <= contentMaxHeightMm * fitToPageThreshold) {
                    const scaleFactor = contentMaxHeightMm / imgHeight
                    const finalWidth = imgWidth * scaleFactor
                    const xPos = (pageWidthMm - finalWidth) / 2
                    pdf.addImage(imgData, 'PNG', xPos, 0, finalWidth, contentMaxHeightMm, undefined, 'FAST')
                } else {
                    const totalPages = Math.ceil(imgHeight / contentMaxHeightMm)
                    for (let j = 0; j < totalPages; j++) {
                        const yPos = -(j * contentMaxHeightMm)
                        pdf.addImage(imgData, 'PNG', 0, yPos, imgWidth, imgHeight, undefined, 'FAST')
                        drawFooter()
                        if (j < totalPages - 1) pdf.addPage()
                    }
                }
                if (!(imgHeight > contentMaxHeightMm * fitToPageThreshold)) {
                    drawFooter()
                }
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

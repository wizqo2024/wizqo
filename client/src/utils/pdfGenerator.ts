import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFOptions {
    filename?: string
    scale?: number
    showAnswers?: boolean
    docTitle?: string
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
        scale = 4, // Increased from 3 to 4 for better quality
        docTitle = ''
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
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            compress: true // Enable compression for the PDF file
        })
        const pageWidthMm = 210
        const pageHeightMm = 297

        // Wizqo Logo SVG (Cleaned)
        const logoBase64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NCA0MyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwgMSkiPjxwYXRoIGQ9Ik0wLjQ1IDIwLjgxQzAuNDUgOS43NiA5LjQxIDAuODEgMjAuNDUgMC44MUg0Ni43QzU3Ljc1IDAuODEgNjYuNyA5Ljc2IDY2LjcgMjAuODFWNDAuODFIMjAuNDVDOS40MSA0MC44MSAwLjQ1IDMxLjg2IDAuNDUgMjAuODFaIiBmaWxsPSIjNDg0NUQyIi8+PHBhdGggZD0iTTQ2LjcgOC4zMUgyMC40NUMxMy41NSA4LjMxIDcuOTUgMTMuOTEgNy45NSAyMC44MUM3Ljk1IDI3LjcxIDEzLjU1IDMzLjMxIDIwLjQ1IDMzLjMxSDQ2LjdDNTMuNjEgMzMuMzEgNTkuMiAyNy43MSA1OS4yIDIwLjgxQzU5LjIgMTMuOTEgNTMuNjEgOC4zMSA0Ni43IDguMzFaIiBmaWxsPSIjQTVCNEZDIi8+PHBhdGggZD0iTTIwLjQ1IDI3LjA2QzIzLjkgMjcuMDYgMjYuNyAyNC4yNiAyNi43IDIwLjgxQzI2LjcgMTcuMzYgMjMuOSAxNC41NiAyMC40NSAxNC41NkMxNyAxNC41NiAxNC4yIDE3LjM2IDE0LjIgMjAuODFDMTQuMiAyNC4yNiAxNyAyNy4wNiAyMC40NSAyNy4wNloiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTTE3Ljk1IDE5LjU2QzE4LjY0IDE5LjU2IDE5LjIgMTkgMTkuMiAxOC4zMUMxOS4yIDE3LjYyIDE4LjY0IDE3LjA2IDE3Ljk1IDE3LjA2QzE3LjI2IDE3LjA2IDE2LjcgMTcuNjIgMTY3IDE4LjMxQzE2LjcgMTkgMTcuMjYgMTkuNTYgMTcuOTUgMTkuNTZaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik00Ny45NSAyNy4wNloiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTTUwLjcgMTguMzFIMTcuOTVaIiBmaWxsPSJ3aGl0ZSIvPjwvZz48L3N2Zz4=`

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i]

            // Capture each section
            const canvas = await html2canvas(section, {
                scale: scale,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: 30000, // Increase timeout for complex rendering
                onclone: (clonedDoc: Document) => {
                    // Adjust cloned section styles for better PDF look
                    const clonedSection = clonedDoc.querySelector('.worksheet-section') || clonedDoc.body.firstChild as HTMLElement
                    if (clonedSection instanceof HTMLElement) {
                        clonedSection.style.setProperty('padding', '20px 32px 80px 32px', 'important')
                        clonedSection.style.setProperty('border-radius', '12px', 'important')
                        clonedSection.style.setProperty('position', 'relative', 'important')
                        clonedSection.style.setProperty('background', 'white', 'important')
                        // Improve text/image rendering in the clone
                        clonedSection.style.setProperty('image-rendering', 'auto', 'important')
                        clonedSection.style.setProperty('-webkit-font-smoothing', 'antialiased', 'important')

                        // Inject Footer
                        const footer = clonedDoc.createElement('div')
                        footer.style.cssText = 'position: absolute !important; bottom: 25px !important; left: 0 !important; right: 0 !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 4px !important; z-index: 9999 !important; width: 100% !important;'
                        footer.innerHTML = `
              <div style="display: flex !important; align-items: center !important; gap: 8px !important; justify-content: center !important;">
                <img src="${logoBase64}" style="width: 42px !important; height: 24px !important; opacity: 0.8 !important;" />
                <span style="font-size: 12pt !important; font-weight: 700 !important; color: #4845D2 !important; font-family: system-ui, -apple-system, sans-serif !important;">www.wizqo.com</span>
              </div>
              <div style="font-size: 10pt !important; color: #64748b !important; opacity: 0.7 !important; font-family: system-ui, -apple-system, sans-serif !important;">
                Copyright © ${new Date().getFullYear()} Wizqo. All rights reserved.
              </div>
            `
                        clonedSection.appendChild(footer)
                    }
                }
            })

            // Use PNG for lossless quality
            const imgData = canvas.toDataURL('image/png')
            const imgWidth = pageWidthMm
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            // If section is taller than one page, we might still have to split it, 
            // but at least we split by section first.
            if (imgHeight <= pageHeightMm) {
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
            } else {
                // Fallback split for extra long sections (rare but possible)
                const totalPages = Math.ceil(imgHeight / pageHeightMm)
                for (let j = 0; j < totalPages; j++) {
                    const yPos = -(j * pageHeightMm)
                    pdf.addImage(imgData, 'PNG', 0, yPos, imgWidth, imgHeight, undefined, 'FAST')
                    if (j < totalPages - 1) pdf.addPage()
                }
            }

            // Add new page for next section, except for the last one
            if (i < sections.length - 1) {
                pdf.addPage()
            }
        }

        pdf.save(filename)
    } catch (error) {
        console.error('Unified PDF generation failed:', error)
        throw error // Re-throw to be handled by caller
    }
}

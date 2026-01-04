declare module 'jspdf' {
    const jsPDF: any;
    export default jsPDF;
}

declare module 'html2canvas' {
    const html2canvas: any;
    export default html2canvas;
}

declare module 'react-helmet';
declare module 'react-lazy-load-image-component';



// Global JSX namespace to satisfy linter for intrinsic elements
declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}

// Augment ImportMeta for Vite env
interface ImportMeta {
    env: Record<string, string>;
}

// Augment CSSStyleDeclaration for legacy property
interface CSSStyleDeclaration {
    webkitPrintColorAdjust: string;
}

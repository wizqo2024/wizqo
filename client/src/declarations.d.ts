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

declare module 'react' {
    const React: any;
    export = React;
}

declare module 'react-dom' {
    const ReactDOM: any;
    export = ReactDOM;
}

declare module 'react-dom/client' {
    const ReactDOMClient: any;
    export = ReactDOMClient;
}

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

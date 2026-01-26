
import React, { useState } from 'react';
import { getAllWorksheetSEO, getWorksheetSEOBySlug } from '@shared/worksheetSEO';

export default function DebugSEOPage() {
    const [testSlug, setTestSlug] = useState('how-many-objects-1-15');
    const [lookupResult, setLookupResult] = useState<any>(null);

    const allSEO = getAllWorksheetSEO();

    const handleTest = () => {
        const result = getWorksheetSEOBySlug(testSlug);
        setLookupResult(result || 'NOT FOUND');
    };

    return (
        <div className="p-8 font-mono text-sm max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">SEO Debugger</h1>

            <div className="bg-gray-100 p-4 rounded mb-8">
                <h2 className="font-bold mb-2">Total Mapped Worksheets: {allSEO.length}</h2>
                {allSEO.length === 0 && <p className="text-red-600 font-bold">WARNING: Map is empty! initializeWorksheetSEO failed?</p>}
            </div>

            <div className="mb-8 border p-4 rounded">
                <h2 className="font-bold mb-2">Slug Lookup Test</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={testSlug}
                        onChange={e => setTestSlug(e.target.value)}
                        className="border p-2 flex-grow"
                    />
                    <button onClick={handleTest} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Test Lookup
                    </button>
                </div>

                <pre className="bg-black text-green-400 p-4 rounded overflow-auto">
                    {JSON.stringify(lookupResult, null, 2)}
                </pre>
            </div>

            <div className="border p-4 rounded">
                <h2 className="font-bold mb-2">First 10 Entries in Map</h2>
                <pre className="bg-gray-100 p-4 rounded h-96 overflow-auto">
                    {JSON.stringify(allSEO.slice(0, 10), null, 2)}
                </pre>
            </div>
        </div>
    );
}

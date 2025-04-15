import React from 'react';
import { useMonaco } from '@monaco-editor/react';

const OpponentEditor = () => {
    const monaco = useMonaco();

    return (
        <div className="opponent-editor-wrapper">
            <h2 className="text-white">Opponent's Code</h2>
            {/* Read-only Monaco Editor */}
        </div>
    );
};

export default OpponentEditor;

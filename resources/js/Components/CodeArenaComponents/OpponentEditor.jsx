// src/components/CodeArenaComponents/OpponentEditor.js

import React from 'react';
import MonacoEditor from '@monaco-editor/react';

const OpponentEditor = ({ language, code }) => (
    <MonacoEditor
        height="400px"
        language={language}
        theme="vs-dark"
        value={code}
        options={{
            readOnly: true,
            fontSize: 12,
            minimap: { enabled: false },
            fontFamily: 'Courier New',
            automaticLayout: true,
        }}
    />
);

export default OpponentEditor;
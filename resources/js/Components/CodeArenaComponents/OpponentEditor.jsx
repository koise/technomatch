// src/components/CodeArenaComponents/OpponentEditor.js

import React from 'react';
import MonacoEditor from '@monaco-editor/react';

const OpponentEditor = ({ language, fontSize, fontFamily, code }) => (
    <MonacoEditor
        height="400px"
        language={language}
        theme="vs-dark"
        value={code}
        options={{
            readOnly: true,
            fontSize: fontSize,
            minimap: { enabled: false },
            fontFamily: fontFamily,
            automaticLayout: true,
        }}
    />
);

export default OpponentEditor;

import React, { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

const CodeEditor = ({ language, fontSize, fontFamily, code, onChange }) => {
    const [editorCode, setEditorCode] = useState(code);

    // Update the code if the language changes
    useEffect(() => {
        setEditorCode(code);
    }, [language, code]);

    const editorOptions = {
        selectOnLineNumbers: true,
        fontSize: fontSize,
        fontFamily: fontFamily,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderLineHighlight: 'all',
        scrollbar: {
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12
        },
        theme: 'vs-dark',
    };

    const handleEditorChange = (newValue) => {
        setEditorCode(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const getLanguageForMonaco = (lang) => {
        const mapping = {
            'Python': 'python',
            'Java': 'java',
            'C': 'c'
        };
        return mapping[lang] || lang.toLowerCase();
    };

    return (
        <div className="code-editor-wrapper">
            <MonacoEditor
                height="80vh"
                language={getLanguageForMonaco(language)}
                value={editorCode}
                options={editorOptions}
                onChange={handleEditorChange}
                className="monaco-editor"
            />
        </div>
    );
};

export default CodeEditor;

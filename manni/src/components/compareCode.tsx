// components/CodeComparison.jsx
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// Import two themes to illustrate dynamic formatting (choose your preferred themes)
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeComparisonProps {
  beforeCode: string;
  afterCode: string;
  initialLanguage?: string;
}

const CodeComparison: React.FC<CodeComparisonProps> = ({ beforeCode, afterCode, initialLanguage = "javascript" }) => {
  const [language, setLanguage] = useState(initialLanguage);

  const handleLanguageChange = (e:any) => {
    setLanguage(e.target.value);
  };

  // You can expand this list with other languages supported by the syntax highlighter.
  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
  ];

  return (
    <div className="code-comparison">
      <div className="language-selector" style={{ marginBottom: "1rem", width:400 }}>
        <label htmlFor="language">Select Language: </label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="code-panels" style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        {/* Input Code Block */}
        <div style={{ flex: 1, border: "2px solid #ccc", padding: "10px", maxWidth: "800px" }}>
          <h3>Before Code</h3>
          <SyntaxHighlighter language={language} style={tomorrow}>
            {beforeCode}
          </SyntaxHighlighter>
        </div>

        {/* Output Code Block */}
        <div style={{ flex: 1, border: "2px solid #ccc", padding: "10px", maxWidth: "800px" }}>
          <h3>After Code</h3>
          <SyntaxHighlighter language={language} style={tomorrow}>
            {afterCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeComparison;

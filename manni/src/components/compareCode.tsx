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
  linesToHighlight?: number[];
  issues?: {[key: string]: string};
}

const CodeComparison: React.FC<CodeComparisonProps> = ({ 
  beforeCode, 
  afterCode, 
  initialLanguage = "javascript",
  linesToHighlight = [],
  issues = {}
}) => {
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

  // Custom renderer to highlight specific lines
  const lineProps = (lineNumber: number) => {
    const style: React.CSSProperties = {};
    if (linesToHighlight.includes(lineNumber)) {
      style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
      style.display = 'block';
      style.width = '100%';
    }
    return { style };
  };

  // Split code into lines for the issue panel
  const codeLines = afterCode.split('\n');

  return (
    <div className="code-comparison">
      <div className="language-selector" style={{ marginBottom: "1rem", width:400 }}>
        <label htmlFor="language" style={{fontWeight:'bold'}}>Select Language: </label>
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
          <h3 style={{fontWeight:'bold'}}>Your Code</h3>
          <SyntaxHighlighter language={language} style={tomorrow}>
            {beforeCode}
          </SyntaxHighlighter>
        </div>

        {/* Output Code Block with Highlighted Issues */}
        <div style={{ flex: 1, border: "2px solid #ccc", padding: "10px", maxWidth: "800px" }}>
          <h3 style={{fontWeight:'bold'}}>Analyzed Code</h3>
          <SyntaxHighlighter 
            language={language} 
            style={tomorrow}
            wrapLines={true}
            lineProps={lineProps}
            showLineNumbers={true}
          >
            {afterCode}
          </SyntaxHighlighter>
          
          {/* Issues Panel */}
          {Object.keys(issues).length > 0 && (
            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "transparent", borderRadius: "5px" }}>
              <h4 style={{fontWeight:'bold', marginBottom: "10px"}}>Potential Issues:</h4>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                {Object.entries(issues).map(([line, issue]) => (
                  <li key={line} style={{ marginBottom: "5px" }}>
                    <strong>Line {line}:</strong> {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeComparison;
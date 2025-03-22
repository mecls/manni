"use client";

import { FileIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CodeComparisonProps {
  beforeCode: string;
  afterCode: string;
  language: string;
  filename: string;
  lightTheme: string;
  darkTheme: string;
}

export function CodeComparison({
  beforeCode,
  afterCode,
  language,
  filename,
  lightTheme,
  darkTheme,
}: CodeComparisonProps) {
  const { theme, systemTheme } = useTheme();
  const [highlightedBefore, setHighlightedBefore] = useState("");
  const [highlightedAfter, setHighlightedAfter] = useState("");

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    const selectedTheme = currentTheme === "dark" ? darkTheme : lightTheme;

    async function highlightCode() {
      try {
        const { codeToHtml } = await import("shiki");
        const before = await codeToHtml(beforeCode, {
          lang: language,
          theme: selectedTheme,
        });
        const after = await codeToHtml(afterCode, {
          lang: language,
          theme: selectedTheme,
        });
        setHighlightedBefore(before);
        setHighlightedAfter(after);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedBefore(`<pre>${beforeCode}</pre>`);
        setHighlightedAfter(`<pre>${afterCode}</pre>`);
      }
    }
    highlightCode();
  }, [
    theme,
    systemTheme,
    beforeCode,
    afterCode,
    language,
    lightTheme,
    darkTheme,
  ]);

  const renderCode = (code: string, highlighted: string) => {
    return (
      <div
        className="bg-black h-full text-white text-xs [&_code]:break-all [&>pre]:!bg-transparent [&>pre]:h-full [&>pre]:p-4 font-mono overflow-auto"
        dangerouslySetInnerHTML={{ __html: highlighted || `<pre>${code}</pre>` }}
        style={{ maxWidth: "800px", maxHeight: "800px", overflowY: "auto" }}
      />
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-black border border-border rounded-md text-white w-full overflow-hidden relative">
        <div className="flex flex-row md:divide-border md:divide-x md:grid-cols-2 relative">
          <div>
            <div className="flex bg-gray-800 p-2 text-sm text-white items-center">
              <FileIcon className="h-4 text-white w-4 mr-2" />
              {filename}
              <span className="ml-auto">before</span>
            </div>
            {renderCode(beforeCode, highlightedBefore)}
          </div>
          <div>
            <div className="flex bg-gray-800 p-2 text-sm text-white items-center">
              <FileIcon className="h-4 text-white w-4 mr-2" />
              {filename}
              <span className="ml-auto">after</span>
            </div>
            {renderCode(afterCode, highlightedAfter)}
          </div>
        </div>
        <div className="flex bg-gray-800 h-8 justify-center rounded-md text-white text-xs w-8 -translate-x-1/2 -translate-y-1/2 absolute items-center left-1/2 top-1/2">
          VS
        </div>
      </div>
    </div>
  );
}

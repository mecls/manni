"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import CodeComparison from "@/components/compareCode";
import { s } from "framer-motion/client";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [output, setOutput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([]);
  const [issues, setIssues] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    adjustHeight();
  }, [inputText]);

  const summarize = async (text: any) => {
    try {
      const encodedCode = encodeURIComponent(text);
      const response = await fetch(`http://127.0.0.1:8000/summarize?code=${encodedCode}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Data:", data);
      
      // Extract line numbers from LineWithIssue
      const linesWithIssues = Object.keys(data.LineWithIssue).map(line => parseInt(line, 10));
      
      setLinesToHighlight(linesWithIssues);
      setIssues(data.LineWithIssue);
      setOutput(text); // Set the same code for display with highlighted issues
      setInput(text);
      setIsVisible(true);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setOutput("Error: " + (error instanceof Error ? error.message : "An unknown error occurred"));
      setIsVisible(true);
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "100px"; // Reset height
      const newHeight = Math.min(textarea.scrollHeight, 300);
      textarea.style.height = `${newHeight}px`; // Adjust height dynamically
    }
  };

  const handleChange = (e: any) => {
    setInputText(e.target.value);
  };

  const handleSend = async () => {
    if (inputText.trim()) {
      await summarize(inputText);
      setInputText("");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center p-8 font-[family-name:var(--font-geist-sans)] gap-16 items-center min-h-screen pb-20 sm:p-20">
      <main className="flex flex-col row-start-2 gap-[32px] items-center">
        {isVisible && (
          <div className="flex flex-row justify-center p-4 w-full max-w-[820px] space-x-4">
            <CodeComparison 
              beforeCode={input} 
              afterCode={output} 
              initialLanguage="javascript" 
              linesToHighlight={linesToHighlight}
              issues={issues}
            />
          </div>
        )}
        <div className="fixed-top ">
          <h1 className="text-4xl text-center font-bold mb-12 sm:text-5xl">
            Vibe debug with <span className="text-primary">Manni ⚡️</span>.
          </h1>
          <div className="flex flex-col  w-full gap-4 items-center sm:flex-row sm:items-center">
            <textarea
              ref={textareaRef}
              className="border border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary lg:w-[200%] max-w-[90%] md:w-[135%] overflow-y-scroll px-4 py-2 resize-none sm:px-5 sm:text-base"
              placeholder="Ask something..."
              value={inputText}
              onChange={handleChange}
              rows={1}
              style={{ minHeight: "100px", maxHeight: "300px", width: "700px", marginTop: "10px" }}
            />
            <button
              className="bg-amber-400 rounded-full text-sm text-white hover:bg-opacity-0 px-4 py-2 sm:h-12 sm:px-5 sm:text-base transition-colors"
              onClick={handleSend}
            >
              <Image className="dark:invert" src="/up-arrow.png" alt="Send button" width={24} height={24} priority />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
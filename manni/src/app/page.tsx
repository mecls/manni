"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [output, setOutput] = useState("");
  const [isVisible, setIsVisible] = useState(false);

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
      console.log
      const data = await response.json();
      setOutput(data.summary || "No summary available");
      setIsVisible(true);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      if (error instanceof Error) {
        setOutput("Error: " + error.message);
      } else {
        setOutput("An unknown error occurred");
      }
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
      await summarize(inputText);  // Just call it once
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center p-8 font-[family-name:var(--font-geist-sans)] gap-16 items-center min-h-screen pb-20 sm:p-20">
      <main className="flex flex-col row-start-2 gap-[32px] items-center sm:items-start">
        <h1 className="text-4xl text-center font-bold sm:text-5xl">
          Vibe debug with <a className="text-primary">Manni.</a>
        </h1>

        {isVisible && (
          <div className="bg-white border border-gray-300 p-4 rounded-md mb-4 ps-10 sm:w-[50%]">
            <h3 className="font-bold mb-2">Code Summary:</h3>
            <p>{output}</p>
          </div>
        )}        
        <div className="flex flex-col w-full gap-4 items-center sm:flex-row sm:items-center">
          <textarea
            ref={textareaRef}
            className="border border-gray-300 text-sm w-full focus:outline-none 
            focus:ring-2 focus:ring-primary lg:w-[200%] max-w-[90%] md:w-[135%] 
            px-4 py-2 resize-none sm:px-5 sm:text-base 
            overflow-y-scroll"
            placeholder="Ask something..."
            value={inputText}
            onChange={handleChange}
            rows={1}
            style={{ minHeight: "100px", maxHeight: "300px", width: "700px" }}
          />
          <button
            className="bg-amber-400 rounded-full text-sm text-white hover:bg-opacity-0 px-4 py-2 sm:h-12 sm:px-5 sm:text-base transition-colors"
            onClick={handleSend}
          >
            <Image
              className="dark:invert"
              src="/up-arrow.png"
              alt="Send button"
              width={24}
              height={24}
              priority
            />
          </button>
        </div>

      </main>
    </div>
  );
}
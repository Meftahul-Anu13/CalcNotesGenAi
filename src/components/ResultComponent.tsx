"use client";
import {  useState } from "react";
// import dynamic from "next/dynamic";
import { MathJax ,MathJaxContext} from "better-react-mathjax";
interface ResultComponentsProps {
  latexExpressions: string[];
  onRun: () => void;
}




const ResultComponents = ({ latexExpressions, onRun }: ResultComponentsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVisibility = () => setIsOpen(!isOpen);

  return (
    <div>
      <button
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-blue-500 
        text-white flex items-center justify-center cursor-pointer shadow-lg z-40"
        onClick={() => {
          if (!isOpen) onRun(); 
          toggleVisibility();
        }}
      >
        {isOpen ? "Close" : "Run"}
      </button>

      {isOpen && (
        <div
          className="fixed top-12 right-6 bg-white text-black rounded-lg 
          shadow-lg w-80 max-h-[40vh] overflow-auto p-4 border border-gray-300 z-50"
        >
          <h2 className="text-lg font-semibold mb-2 text-center">Calculation Results</h2>
          <div className="space-y-4">
            <MathJaxContext>
              {latexExpressions.map((expression, index) => (
                <div key={index} className="latex-result bg-gray-100 p-3 rounded shadow-md border border-gray-200">
                  
                  <MathJax inline>{`${expression}`}</MathJax>
                </div>
              ))}
            </MathJaxContext>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultComponents;

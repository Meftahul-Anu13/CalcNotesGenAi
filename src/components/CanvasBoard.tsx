"use client";

import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { MathJax, MathJaxContext } from "better-react-mathjax";

interface CanvasBoardProps {
  color: string;
  isErasing: boolean;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({ color, isErasing }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [latex, setLatex] = useState("\\int_{a}^{b} f(x) \, dx");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = isErasing ? 10 : 5;
        setContext(ctx);
      }
    }
  }, [color, isErasing]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const renderLatexOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.innerHTML = `<span id='mathjax-latex'>${latex}</span>`;
    document.body.appendChild(tempDiv);

    MathJax.typesetPromise([tempDiv]).then(() => {
      const mathElement = tempDiv.querySelector("#mathjax-latex") as HTMLElement;
      if (mathElement) {
        const svg = mathElement.querySelector("svg");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const img = new Image();
          img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;

          img.onload = () => {
            context.drawImage(img, 50, 50);
            document.body.removeChild(tempDiv);
          };
        }
      }
    });
  };

  const runAction = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const response = await axios.post("http://127.0.0.1:8000/api", {
      image: canvas.toDataURL("image/png"),
    });
    console.log("Response:", response.data);
  };

  return (
    <MathJaxContext>
      <div>
        <input
          type="text"
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          placeholder="Enter LaTeX here"
          className="latex-input"
        />
        <button onClick={renderLatexOnCanvas} className="render-latex-btn">
          Render LaTeX
        </button>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ display: "block", cursor: isErasing ? "not-allowed" : "crosshair" }}
        />
      </div>
    </MathJaxContext>
  );
};

export default CanvasBoard;

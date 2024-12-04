"use client";
import { useEffect, useRef, useState } from "react";
import ColorPalette from "@/components/ColorPicker";
import Toolbar from "@/components/ControlButtons";
import "./globals.css";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState("white");
  const colors = ["white", "red", "blue", "green", "yellow"];
  const [isErasing, setIsErasing] = useState(false);

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
        ctx.lineWidth = 5;
        setContext(ctx);
      }
    }

    const handleResize = () => {
      if (canvas && context) {
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.putImageData(imageData, 0, 0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [context]);

  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
    }
  }, [color, context]);

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

  const resetCanvas = () => {
    if (canvasRef.current && context) {
      context.fillStyle = "black";
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      setIsErasing(false);
      setColor("white");
      context.lineWidth = 5;
    }
  };

  const toggleEraser = () => {
    if (context) {
      if (isErasing) {
        setIsErasing(false);
        context.lineWidth = 5; 
        setColor("white"); 
      } else {
        setIsErasing(true);
        context.lineWidth = 5; 
        setColor("black"); 
      }
    }
  };

  const runAction = () => {
    alert("Run action clicked!");
  };

  return (
    <main>
      <div className="p-4">
        <Toolbar
          onReset={resetCanvas}
          isErasing={isErasing}
          onToggleEraser={toggleEraser}
          onRun={runAction}
        />
        <ColorPalette
          colors={colors}
          selectedColor={color}
          onSelectColor={setColor}
        />
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ display: "block", cursor: "crosshair" }}
        />
      </div>
    </main>
  );
}

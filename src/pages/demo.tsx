import React, { JSX, useEffect, useRef, useState } from 'react';

type Tool = 'line' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'eraser';

const DrawingCanvas: () => JSX.Element = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tool, setTool] = useState<Tool>('line');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const context = canvas.getContext('2d');
      if (context) setCtx(context);
    }
  }, []);

  useEffect(() => {
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineWidth = tool === 'eraser' ? 10 : 2;
      ctx.strokeStyle =
        tool === 'eraser'
          ? isDarkMode
            ? '#555'
            : '#fff'
          : isDarkMode
            ? 'white'
            : 'black';
    }
  }, [ctx, tool, isDarkMode]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  });

  const drawShape = (end: { x: number; y: number }) => {
    if (!ctx || !startPos) return;

    const { x: startX, y: startY } = startPos;
    const { x: endX, y: endY } = end;

    if (tool === 'line' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2),
      );
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'arrow') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const angle = Math.atan2(endY - startY, endX - startX);
      const headLength = 10;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLength * Math.cos(angle - Math.PI / 6),
        endY - headLength * Math.sin(angle - Math.PI / 6),
      );
      ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 6),
        endY - headLength * Math.sin(angle + Math.PI / 6),
      );
      ctx.lineTo(endX, endY);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    } else if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        ctx.font = '16px Arial';
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillText(text, endX, endY);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setStartPos(getPos(e));
    setIsDrawing(true);
    if (tool === 'text') {
      drawShape(getPos(e));
      setIsDrawing(false);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    drawShape(getPos(e));
    setIsDrawing(false);
    setStartPos(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    if (tool === 'line' || tool === 'eraser') {
      drawShape(getPos(e));
      setStartPos(getPos(e));
    }
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#333' : '#fff',
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 2,
          display: 'flex',
          gap: '8px',
        }}
      >
        <button onClick={toggleTheme}>
          {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
        <button onClick={() => setTool('line')}>Line</button>
        <button onClick={() => setTool('rectangle')}>Rectangle</button>
        <button onClick={() => setTool('circle')}>Circle</button>
        <button onClick={() => setTool('arrow')}>Arrow</button>
        <button onClick={() => setTool('text')}>Text</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
        <button onClick={clearCanvas}>Clear</button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDrawing(false)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: isDarkMode ? '#555' : '#fff',
          cursor: tool === 'text' ? 'text' : 'crosshair',
        }}
      />
    </div>
  );
};

export default DrawingCanvas;

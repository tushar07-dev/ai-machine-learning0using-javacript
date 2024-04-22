import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import html2canvas from 'html2canvas';
import socketIOClient from 'socket.io-client';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [undoStack, setUndoStack] = useState<fabric.Object[][]>([]);
  const [redoStack, setRedoStack] = useState<fabric.Object[][]>([]);
  const [brushColor, setBrushColor] = useState<string>('black');
  const [brushSize, setBrushSize] = useState<number>(5);
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current!);
    setCanvas(newCanvas);

    // Add drawing functionality
    if (newCanvas) {
      newCanvas.isDrawingMode = true;
      newCanvas.freeDrawingBrush.width = brushSize;
      newCanvas.freeDrawingBrush.color = brushColor;
    }

    // Undo/Redo functionality
    newCanvas?.on('object:added', () => {
      if (!canvas) return;
      setUndoStack((prevStack) => [...prevStack, canvas.toJSON().objects]);
      setRedoStack([]);
    });

    // Socket initialization
    socketRef.current = socketIOClient('http://localhost:8000'); // Adjust URL accordingly

    return () => {
      newCanvas.dispose();
      socketRef.current!.disconnect();
    };
  }, [brushSize, brushColor]);

  useEffect(() => {
    const socket = socketRef.current!;
    canvas?.on('mouse:move', (event: any) => {
      const pointer = canvas!.getPointer(event.e);
      socket.emit('cursorMove', { x: pointer.x, y: pointer.y });
      canvas!.renderAll();
    });

    socket.on('cursorMove', (cursorPosition: { x: number; y: number }) => {
      const cursor = canvas!.getObjects().find(obj => obj.name === 'cursor');
      if (cursor) {
        cursor.set({ left: cursorPosition.x, top: cursorPosition.y });
        canvas!.renderAll();
      } else {
        const newCursor = new fabric.Circle({
          name: 'cursor',
          radius: 5,
          fill: 'red',
          left: cursorPosition.x,
          top: cursorPosition.y,
          selectable: false,
          evented: false,
        });
        canvas!.add(newCursor);
        canvas!.renderAll();
      }
    });

    socket.on('drawing', (data: { x: number, y: number, brushColor: string, brushSize: number }) => {
      const { x, y, brushColor, brushSize } = data;
      const brush = new fabric.CircleBrush(canvas!);
      brush.color = brushColor;
      brush.width = brushSize;
      brush.moveTo(x, y);
      brush.onMouseDown({ x, y } as any);
      brush.onMouseMove({ x, y } as any);
      brush.onMouseUp();
    });

    return () => {
      canvas?.off('mouse:move');
    };
  }, [canvas]);

  const undo = () => {
    if (!canvas || undoStack.length === 0) return;

    const lastAction = undoStack.pop();
    if (lastAction) {
      setRedoStack([...redoStack, canvas.toJSON().objects]);
      canvas.clear();
      canvas.loadFromJSON({ objects: lastAction });
      canvas.renderAll();
    }
  };

  const redo = () => {
    if (!canvas || redoStack.length === 0) return;

    const lastAction = redoStack.pop();
    if (lastAction) {
      setUndoStack([...undoStack, canvas.toJSON().objects]);
      canvas.clear();
      canvas.loadFromJSON({ objects: lastAction });
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    setUndoStack([]);
    setRedoStack([]);
  };

  const saveAsImage = () => {
    if (!canvas) return;

    html2canvas(canvas.getElement(), { backgroundColor: 'white' }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = imgData;
      link.click();
    });
  };

  const handleColorChange = (color: string) => {
    setBrushColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvas) return;
    const { x, y } = canvas.getPointer(e.e);
    const brush = new fabric.CircleBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    brush.moveTo(x, y);
    brush.onMouseDown({ x, y } as any);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvas) return;
    const { x, y } = canvas.getPointer(e.e);
    const brush = new fabric.CircleBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    brush.onMouseMove({ x, y } as any);
  };

  const handleCanvasMouseUp = () => {
    if (!canvas) return;
    const brush = new fabric.CircleBrush(canvas);
    brush.onMouseUp();
  };

  return (
    <div>
      <canvas 
        ref={canvasRef} 
        onMouseDown={(e) => canvas && handleCanvasMouseDown(e)}
        onMouseMove={(e) => canvas && handleCanvasMouseMove(e)}
        onMouseUp={handleCanvasMouseUp}
      />
      <div>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={saveAsImage}>Save as Image</button>
        <div>
          <label>Brush Color:</label>
          <input type="color" value={brushColor} onChange={(e) => handleColorChange(e.target.value)} />
        </div>
        <div>
          <label>Brush Size:</label>
          <input type="number" value={brushSize} min={1} max={20} onChange={(e) => handleBrushSizeChange(Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;

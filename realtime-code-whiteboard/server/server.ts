import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

interface DrawingEvent {
  type: string;
  data: any;
}

io.on('connection', (socket: Socket) => {
  console.log('WebSocket client connected');

  socket.on('drawing', (event: DrawingEvent) => {
    // Logic to handle drawing event
    socket.broadcast.emit('drawing', event);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

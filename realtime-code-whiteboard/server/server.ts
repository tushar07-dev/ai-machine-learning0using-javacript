import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const pgClient = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'whiteboard',
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
});

pgClient.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Failed to connect to PostgreSQL:', err));

interface DrawingEvent {
  type: string;
  data: any;
}

io.on('connection', (socket: Socket) => {
  console.log('WebSocket client connected');

  socket.on('drawing', async (event: DrawingEvent) => {
    try {
      await storeDrawingEvent(event);
      socket.broadcast.emit('drawing', event);
    } catch (err) {
      console.error('Error storing drawing event:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('WebSocket client disconnected');
  });
});

async function storeDrawingEvent(event: DrawingEvent) {
  const { type, data } = event;
  const query = `
    INSERT INTO drawing_events (type, data)
    VALUES ($1, $2)
  `;
  const values = [type, JSON.stringify(data)];

  try {
    await pgClient.query(query, values);
  } catch (err) {
    throw new Error(`Failed to store drawing event: ${err}`);
  }
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

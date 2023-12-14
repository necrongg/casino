import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import  setupIO  from './util/io.js';

dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

httpServer.listen(process.env.PORT, () => {
    console.log('server on port', process.env.PORT);
});

setupIO(io);

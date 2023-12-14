import express from 'express';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());

connect(process.env.DB)
    .then(() => console.log('데이터베이스 연결됨'))
    .catch((err) => console.error('데이터베이스 연결 오류:', err));

export default app;

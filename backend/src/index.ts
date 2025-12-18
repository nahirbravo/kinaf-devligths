import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import routes from './routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use('/api', routes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5001;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});

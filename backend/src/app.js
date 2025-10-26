import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import institutionRoutes from './routes/institutions.routes.js';
import monumentRoutes from './routes/monuments.routes.js';
import historicalRoutes from './routes/historicalData.routes.js';
import visitRoutes from './routes/visits.routes.js';
import quizRoutes from './routes/quizzes.routes.js';
import uploadRoutes from './routes/uploads.routes.js';
import healthRoutes from './routes/health.routes.js';

config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ name: 'HistoriAR API', status: 'ok' }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/monuments', monumentRoutes);
app.use('/api/history', historicalRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/uploads', uploadRoutes);

app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

export default app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db/database.js';
import bookRoutes from './routes/books.js';
import configRoutes from './routes/config.js';
import metadataRoutes from './routes/metadata.js';
import syncRoutes from './routes/sync.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database
initDB();

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/config', configRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/sync', syncRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

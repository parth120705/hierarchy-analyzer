import app from './app.js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Server] Health check available at http://localhost:${PORT}/health`);
  console.log(`[Server] Hierarchy analysis endpoint at POST http://localhost:${PORT}/bfhl`);
});

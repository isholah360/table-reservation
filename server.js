import express from 'express';
import dotenv from 'dotenv';
import prisma, { connectDB, disconnectDB } from './prisma/client.js';
import tableRouter from './routes/table.route.js';
import reservationRouter from './routes/reservation.route.js';
import restRouter from './routes/restaurant.route.js';
import waitlistRouter from './routes/waitlist.route.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(errorHandler);


app.use('/api/v1/tables', tableRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/restaurants', restRouter);
app.use('/api/v1/waitlist', waitlistRouter);


await connectDB();


app.get("/", (req, res) => {
  res.send("Welcome to the Table Reservation API");
});


// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected',
      prismaVersion: '7.x' 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}


// Start server
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT} with Prisma 7`);
// });

export default app;

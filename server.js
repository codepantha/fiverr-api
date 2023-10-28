import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import gigRoutes from './routes/gig.routes.js';
import messageRoutes from './routes/message.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
dotenv.config();
mongoose.set('strictQuery', true);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://127.0.0.1:5173', credentials: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/gigs', gigRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/messages', messageRoutes);

app.use(errorHandler);

try {
  await mongoose.connect(process.env.MONGO_URL);
} catch (error) {
  handleError(error);
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`app connnected on port ${PORT}`));

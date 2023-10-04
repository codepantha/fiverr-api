import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
mongoose.set('strictQuery', true);

try {
  await mongoose.connect(process.env.MONGO_URL)
} catch (error) {
  handleError(error);
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`app connnected on port ${PORT}`))
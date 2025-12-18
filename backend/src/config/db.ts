import mongoose from 'mongoose';
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB Conectado');
  } catch (error) {
    console.error('Error MongoDB:', error);
    process.exit(1);
  }
};

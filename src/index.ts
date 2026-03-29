import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import contactRoutes from './routes/contactRoutes';
import cartRoutes from './routes/cartRoutes';

import { limiter, authLimiter, errorHandler } from './middleware/security';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors({
  origin : "https://e-commerce-app-frontend-eosin-nine.vercel.app"
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(limiter);


app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

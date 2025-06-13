import express from 'express';
import userRoutes from './routes/user.routes';
import internshipRoutes from './routes/internship.routes';
import authRoutes from './routes/auth.routes';
import roleRoutes from './routes/role.routes';
import cors from 'cors';

const app = express();
app.use(express.json());


const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/internships', internshipRoutes);
app.use('/roles', roleRoutes);

export default app;
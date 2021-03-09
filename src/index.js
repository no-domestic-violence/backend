import express from 'express';
import cors from 'cors';
import {
  hotlineRoutes,
  shelterRoutes,
  articleRoutes,
  userRoutes,
} from './routes';
import { connectToDatabase } from './utils/database';
import swaggerUi from 'swagger-ui-express';
import { BASE_URI } from './constants';
import swaggerDocument from './assets/swagger.json';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO refactor authRoutes - split controller logic
const authRoutes = require('./routes/auth');

app.use(BASE_URI, authRoutes);
app.use(BASE_URI, shelterRoutes);
app.use(BASE_URI, hotlineRoutes);
app.use(BASE_URI, userRoutes);
app.use(BASE_URI, articleRoutes);

app.get(BASE_URI, (req, res) => {
  res.send('Welcome to the "Pool" project API');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export const startServer = async () => {
  try {
    await connectToDatabase();
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};

startServer();

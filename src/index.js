import express from 'express';
import { hotlineRoutes, shelterRoutes, articleRoutes } from './routes';
import { connectToDatabase } from './utils/database';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// TODO refactor authRoutes and sos - split controller logic
const authRoutes = require('./routes/auth');
const sosContactRoutes = require('./routes/sosContactRoutes');

app.use('/api', authRoutes);
app.use('/api', shelterRoutes);
app.use('/api', hotlineRoutes);
app.use('/api', sosContactRoutes);
app.use('/api', articleRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Pool API');
});

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


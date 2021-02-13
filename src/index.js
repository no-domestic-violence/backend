import express from 'express';
import mongoose from 'mongoose';
import config from './config/key';
import { hotlineRoutes, shelterRoutes, articleRoutes } from './routes/';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const sosContactRoutes = require('./routes/sosContactRoutes');
// const articlesRoutes = require('./routes/articlesRoutes');

app.use(authRoutes);
app.use(shelterRoutes);
app.use(hotlineRoutes);
app.use(sosContactRoutes);
app.use(articleRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Pool API');
});

mongoose
  .connect(config.mongoURI || process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB is connected!!!!'))
  .catch((err) => console.log(err));

mongoose.set('useCreateIndex', true);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server is running on port ${port}`));

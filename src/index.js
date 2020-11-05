const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/key');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing routes
const authRoutes = require('./routes/auth');
// const verifyToken = require('./routes/verifyToken');
const shelterRoutes = require('./routes/sheltersRoutes');
const hotlinesRoutes = require('./routes/hotlinesRoutes');
const sosContactRoutes = require('./routes/sosContactRoutes');

// Setting routes
app.use(authRoutes);
app.use(shelterRoutes);
app.use(hotlinesRoutes);
app.use(sosContactRoutes);

// app.get('api/user/profile', verifyToken, (req, res) => {
// res.send({success: true, data: req.user})
// })

app.get('/', (req, res) => {
  res.send('Welcome to auth');
});

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB is connected!!!!'))
  .catch((err) => console.log(err));

mongoose.set('useCreateIndex', true);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server is running on port ${port}`));

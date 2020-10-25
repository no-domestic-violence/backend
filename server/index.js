const express = require('express');
const mongoose = require('mongoose')
const config = require('./config/key')
const app = express();

app.use(express.json());


// Importing routes
const authRoutes = require('./routes/auth');
const verifyToken = require('./routes/verifyToken');

// Setting routes
app.use('/api/users', authRoutes);

//app.get('api/user/profile', verifyToken, (req, res) => {
    //res.send({success: true, data: req.user})
//})

app.get('/', (req, res) =>{
    res.send('Welcome to auth');
});
mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
       // app.listen (port, () => console.log(`Server is running on port ${port}`));
       
    })
    .catch(err => console.log(err))
    const port = process.env.PORT || 3000;
    app.listen (port, () => console.log(`Server is running on port ${port}`));



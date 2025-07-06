const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


//Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth',authRoutes);
const fileRoutes = require('./routes/fileRoutes');
app.use('/api/files', fileRoutes);
const folderRoutes = require('./routes/folderRoutes');
app.use('/api/folders', folderRoutes);


// DB + Server Start
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(5000,()=>{console.log("Server running on port 5000")});
    })
    .catch(err=>console.log(err));
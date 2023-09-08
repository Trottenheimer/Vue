require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path')

const PORT = process.env.PORT || 3000;

const app = express();
app
    .use(cors())
    .use(express.json())
    .use('/api', router)
    .use(express.static(path.resolve(__dirname)))

    .use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).json({message: 'Server on'})
});

const start = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start();
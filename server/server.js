const express = require('express');
const dbConnect = require('./config/dbconnect');
const initRoutes = require('./routes');
const cookieParse = require('cookie-parser');
const cors = require('cors');
const { notFound, errHandler } = require('./middlewares/errorHandler');

require('dotenv').config();

const app = express();
//chấp nhận cho localhost khác vào
app.use(
    cors({
        origin: process.env.URL_CLIENT,
        methods: ['POST', 'PUT', 'GET', 'DELETE'],
        credentials: true,
    }),
);

const port = process.env.PORT || 8888;

// đọc dữ liệu theo kiểu json hoặc urlencode
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// đọc dữ liệu trên cookie
app.use(cookieParse());

//liên kết db
dbConnect();

// liên kết api vào app
initRoutes(app);

app.use('/', (req, res) => {
    res.send('SERVER ON');
});

app.use(notFound);
app.use(errHandler);
// web server
app.listen(port, () => {
    console.log('Server running on the port: ' + port);
});

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config({ path: './.env' });

const corsOption = {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}
app.use(cors(corsOption));

app.use(express.json());

app.use('/api/post', require('./route/messageRoute'));
app.use('/api/like', require('./route/likeRoute'));
app.use('/api/comment', require('./route/commentRoute'));
app.use('/api/image', require('./route/imageRoute'));

const port = process.env.PORT;

require('./db/connection');

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});

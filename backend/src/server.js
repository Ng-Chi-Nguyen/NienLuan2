const express = require('express');
const viewEngine = require('./config/viewEngine');
const connectDB = require('./config/connect');

const UsersModel = require('./models/user.model')
const footballfield = require('./models/FoField.model')

require('dotenv').config();

const Routers = require('./routes')

const app = express();


// Middleware để đọc dữ liệu từ form HTML
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8081;
const hostname = process.env.HOST_NAME;
connectDB();
// Middleware quan trọng để đọc JSON
app.use(express.json()); // Cái này rất quan trọng!

// Cấu hình template engine
viewEngine(app);

Routers(app)



app.listen(port, hostname, () => {
   console.log(`Example app listening on port ${port}`);
});

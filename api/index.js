var express = require('express');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
const bodyParser = require('body-parser');

const userRouter =  require("../api/routing/user");
const carRouter = require('../api/routing/car');
const cors = require('cors');
const { User } = require('../api/models/user');

const app = express();
dotenv.config();
//middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.use(express.json());
app.use("/users", userRouter); 
app.use("/cars", carRouter);

mongoose.connect(
    process.env.MONGODB_URI
    )
    .then(() => app.listen(5050,() => console.log('listening to localhost port 5050'))
    )
    .catch((err) => console.log(err));


// let id= '6735e485441194c2acf01f3d';
// try {
//     const user = User.findById(id);
//     console.log(user);
// } catch (error) {
//     console.log(error);
// }
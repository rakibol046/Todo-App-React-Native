// external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");

// internal imports
const loginRouter = require("./router/loginRouter");
const taskRouter = require("./router/taskRouter");



// internal imports


const app = express();
const server = http.createServer(app);
dotenv.config();



// set comment as app locals
app.locals.moment = moment;

// database connection
// mongoose
//   .connect('mongodb+srv://chatapp:rakibchatapp@chat-application.qdxa8xl.mongodb.net/chat?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("database connection successful!"))
//   .catch((err) => console.log(err));
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));


// routing setup
app.use("/", loginRouter);
app.use("/task", taskRouter);




server.listen(process.env.PORT, () => {
  console.log(`server running at port http://localhost:${process.env.PORT}`);
});

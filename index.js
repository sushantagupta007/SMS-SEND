const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const Nexmo = require("nexmo");
const socketio = require("socket.io");

require("dotenv").config();
//Init Nexmo
const nexmo = new Nexmo(
  {
    apiKey: `${process.env.API_KEY}`,
    apiSecret: `${process.env.API_SECRET}`,
  },
  { debug: true }
);

//App initialization
const app = express();

//Template engine setup

// Template engine setup
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + "/public"));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index Route
app.get("/", (req, res) => {
  res.render("index");
});

//Catch from submit
app.post("/", (req, res) => {
  const { number, msg } = req.body;

  // nexmo.message.sendSms(sender, recipient, message, options, callback)
  nexmo.message.sendSms(
    "Sender Number",
    number,
    msg,
    { type: "unicode" },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        //Get data from response
        const data = {
          id: responseData.messages[0]["message-id"],
          number: responseData.messages[0]["to"],
        };
      }
      //Emit to the client
      //Data send to client
      io.emit("smsStatus", data);
    }
  );
  // res.send(req.body);
  // console.log(req.body);
});

//Define port
const port = 3000;

//Start Server
const server = app.listen(port, () => {
  console.log("Server Start", port);
});

//Connect To Socket io
const io = socketio(server);
io.on("connection", (socket) => {
  console.log("connected");
  io.on("disconnect", () => {
    console.log("Disconnected");
  });
});

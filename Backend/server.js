const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const routes = require("./routes/index");
const { errorhandler,asynchandler} = require("./middleware/errorhandler");

const app = express();


app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); // allow cross-origin API requests
// dynamically allow the request origin
app.use(cors({ origin: true, credentials: true, allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Role'] }));
app.use(express.json()); // parse the body
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Root endpoint to prevent 404 on Render URL
app.get("/", (req, res) => {
  res.send("HRM Portal API is running...");
});

app.use("/api", routes);


app.use(errorhandler);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n HRM Portal API running on port ${PORT}`);
});

// Initialize Socket.IO with the Express server
const io = require("socket.io")(server, {
  cors: {
    origin: true,
    credentials: true
  }
});

app.set("io", io);

io.on("connection",(socket)=>{
   console.log("User connected")

    socket.on("message",(msg)=>{
       console.log(msg)
     //   socket.emit("reply","Message received")
    })
})

module.exports = app;
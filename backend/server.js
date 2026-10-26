const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Home test route
app.get("/", (req,res)=>{
    res.send("Online Skill Assessment Server Running");
});


// Import quiz route
const quizRoute = require("./routes/quiz");


// Connect route
app.use("/questions", quizRoute);


// Start server
app.listen(5000, ()=>{

    console.log("Server running on port 5000");

});
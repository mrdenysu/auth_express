// Config
const PORT = process.env.PORT || 5000;
const { secret } = require("./config");

// Import
const express = require("express");
const mongoose = require("mongoose");

const static = require("serve-static");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

// App
const app = express();

app.use(static("public"));

app.use(express.json()); // row for all body
app.use(bodyParser.urlencoded({ extended: false })); // post body

app.use(
  cookieSession({
    name: "session",
    keys: [secret, "SuperUser_Key123@3!_03-d"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use("/auth", require("./routes/authRouter"));

// Start app
async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://suser:suser@cluster0.7maj3.mongodb.net/Project 0?retryWrites=true&w=majority`
    );
    app.listen(PORT, () => {
      console.log(`Server listen: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

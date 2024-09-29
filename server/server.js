const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { connectToDb } = require("./database/db.js");
const authRouter = require("./routers/auth.js");
const userRouter = require("./routers/user.js");
const productRouter = require("./routers/product.js");
const clientRouter = require("./routers/client.js");
const visitRouter = require("./routers/visits.js");
const salesRouter = require("./routers/sales.js");
const statsRouter = require("./routers/stats.js");
const { generate_user } = require("./controllers/user-repository.js");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:1989",
  // "https://prendicafee.onrender.com",
  "https://www.salesprendi.com",
];

const path = require("path");
__dirname = path.resolve();

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/client", clientRouter);
app.use("/visit", visitRouter);
app.use("/sales", salesRouter);
app.use("/stats", statsRouter);

// Use the client app
app.use(express.static(path.join(__dirname, "/client/build")));

// Render client for any path
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
);

// const PORT = process.env.PORT || 1989;
const PORT = process.env.PORT || 1989;

connectToDb(async (err) => {
  if (err) {
    console.log("Failed to connect to db: " + err.message);
  } else {
    // generate_user(
    //   "Prendi",
    //   "il Caffee",
    //   "prendicrm@gmail.com",
    //   "Admin@1234",
    //   "+355698765433",
    //   "admin"
    // );
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
});

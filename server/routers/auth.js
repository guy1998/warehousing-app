const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRepo = require("../controllers/user-repository");
const cookieManager = require("../utils/cookie-manager");
const tokenManager = require("../utils/token-generator");
const userModel = require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
  const response = await userRepo.user_authentication(
    req.body.email,
    req.body.password
  );
  if (response.status === 200) {
    cookieManager.setCookie(res, response.tokenObj);
    res.status(200).json(response.role);
  } else {
    res.status(response.status).json();
  }
});

app.post("/logout", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    cookieManager.deleteCookie(res);
    res.status(200).json("Logging out..");
  });
});

app.get("/authorize", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    res.status(200).json(tokenManager.identify_role(req));
  });
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  userModel.findOne({ email: email }).then(async (user) => {
    if (!user) {
      return res.send({ status: "User does not exist!" });
    }
    const token = await tokenManager.tokenIssuing({
      user_id: user._id,
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "prendicrm@gmail.com",
        pass: "cdpz nsjc qqbb rtsb",
      },
    });

    var mailOptions = {
      from: "prendicrm@gmail.com",
      to: email,
      subject: "Reset your password",
      text: `${process.env.REACT_APP_BACKEND_URL}/auth/new-password/${user._id}/${token.accessToken}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ status: "Success" });
      }
    });
  });
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const check = await tokenManager.tokenChecker(token);
  if (!check.result) {
    return res.json({ status: "Error with token" });
  } else {
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        userModel
          .findByIdAndUpdate({ _id: id }, { password: hash })
          .then((u) => res.send({ status: "Success" }))
          .catch((err) => res.send({ status: err }));
      })
      .catch((err) => res.send({ status: err }));
  }
});

module.exports = app;

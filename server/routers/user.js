const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRepo = require("../controllers/user-repository");
const tokenManager = require("../utils/token-generator");

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/create", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const { name, surname, email, password, phone, role } = req.body;
      const result = await userRepo.generate_user(
        name,
        surname,
        email,
        password,
        phone,
        role
      );
      if (result.result) {
        res.status(201).json({ message: "User created successfully" });
      } else {
        res.status(400).json({ message: "Failed to create user" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/getAll', async (req, res)=>{
  try{
    await tokenManager.authorize(req, res, async ()=>{
      const response = await userRepo.retrieveUsers(tokenManager.retrieve_id(req));
      if(response.result)
        res.status(200).json(response.users);
      else
        res.status(400).json(response.message);
    });
  } catch(err) {
    res.status(500).json("Internal server error!");
  }
})

app.get("/get/:id", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const userId = req.params.id;
      const user = await userRepo.serve_full_info_by_id(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/account", async (req, res) => {
    try {
      await tokenManager.authorize(req, res, async () => {
        const userId = tokenManager.retrieve_id(req);
        const user = await userRepo.serve_full_info_by_id(userId);
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

app.put("/put/:id", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const userId = req.params.id;
      const new_info = req.body;
      const result = await userRepo.edit_user(userId, new_info);
      if (result.result) {
        res.status(200).json({ message: "User updated successfully" });
      } else {
        res.status(400).json({ message: result.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/edit/my-data', async (req, res) => {
    try {
      await tokenManager.authorize(req, res, async () => {
        const userId = tokenManager.retrieve_id(req);
        const new_info = req.body;
        const result = await userRepo.edit_user(userId, new_info);
        if (result.result) {
          res.status(200).json({ message: "User updated successfully" });
        } else {
          res.status(400).json({ message: result.message });
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

app.put('/changePassword', async (req, res)=>{
  try{
    await tokenManager.authorize(req, res, async ()=>{
      const userId = tokenManager.retrieve_id(req);
      const { newPassword, oldPassword } = req.body;
      const result = await userRepo.update_password(userId, oldPassword, newPassword);
        if (result.result === 1) {
          res.status(200).json({ message: result.message });
        } else {
          res.status(400).json({ message: result.message });
        }
    });
  } catch(error) {
    res.status(500).json({message: "Internal server error!"});
  }
})

app.delete("/delete/:id", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const userId = req.params.id;
      await userRepo.delete_user(userId);
      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;

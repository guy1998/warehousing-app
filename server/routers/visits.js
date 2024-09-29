const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const visitRepo = require("../controllers/visit-repository");
const tokenManager = require("../utils/token-generator");
const multer = require("multer");
const { deleteFile } = require("../utils/google-drive-api");

const app = express();
var upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "image/bmp" ||
      file.mimetype == "image/webp" ||
      file.mimetype == "image/svg+xml" ||
      file.mimetype == "image/tiff" ||
      file.mimetype == "image/x-icon" ||
      file.mimetype == "image/vnd.microsoft.icon"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only image format allowed!"));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

app.use(upload.any());
app.use((err, req, res, next) => {
  if (err.message === "Only image format allowed!") {
    res.status(403).json("Should be an image");
  } else {
    console.log("Uncaught");
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.get("/retrieve", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await visitRepo.getVisits();
    if (actionResponse.result) {
      res.status(200).json(actionResponse.visits);
    } else {
      res.status(503).json(actionResponse.message);
    }
  });
});

app.post("/filter", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await visitRepo.getVisitsFiltered(req.body.filter);
    if (actionResponse.result) {
      res.status(200).json(actionResponse.visits);
    } else {
      res.status(503).json("Could not retrieve");
    }
  });
});

app.get("/get-personal", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await visitRepo.getVisitsFiltered({
      agentId: tokenManager.retrieve_id(req),
    });
    if (actionResponse.result) {
      res.status(200).json(actionResponse.visits);
    } else {
      res.status(503).json(actionResponse.message);
    }
  });
});

app.post("/create", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const visit = req.body.visit;
    visit["agentId"] = tokenManager.retrieve_id(req);
    const actionResponse = await visitRepo.createNewVisit(visit);
    if (actionResponse.result) {
      res.status(200).json(actionResponse.newVisit);
    } else {
      res.status(503).json("The visit could not be created!");
    }
  });
});

app.delete("/delete", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await visitRepo.deleteVisit(req.body.visitId);
    if (actionResponse.result) {
      res.status(200).json(actionResponse.message);
    } else {
      res.status(503).json(actionResponse.message);
    }
  });
});

app.post("/unsuccessful", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      // const firstImage = req.files.find((file) => file.fieldname === "image1");
      // const secondImage = req.files.find((file) => file.fieldname === "image2");
      const bodyInformation = JSON.parse(req.body.info);
      const actionResponse = await visitRepo.markVisitUnsuccessful(
        bodyInformation.visitId,
        bodyInformation.notes,
        []
      );
      if (actionResponse.result) {
        res.status(200).json(actionResponse.message);
      } else {
        res.status(503).json(actionResponse.message);
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.post("/delete-image", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const { visit, image } = req.body;
      await deleteFile(image);
      const response = await visitRepo.editVisit(visit, {
        imagePaths: visit.imagePaths.filter((path) => path !== image),
      });
      if (response.result) {
        res.status(200).json({ message: response.message });
      } else {
        res.status(400).json({ message: response.message });
      }
    });
  } catch (error) {
    res.status(503).json({ message: "Internal server error" });
  }
});

module.exports = app;

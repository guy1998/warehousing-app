const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const salesRepo = require("../controllers/sales-repository");
const tokenManager = require("../utils/token-generator");
const multer = require("multer");

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
  limits: { fileSize: 50 * 1024 * 1024 }, // Adjust the limit as needed
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
    const actionResponse = await salesRepo.getAllSales();
    if (actionResponse.result) {
      res.status(200).json(actionResponse.sales);
    } else {
      res.status(503).json(actionResponse.message);
    }
  });
});

app.post("/filter", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await salesRepo.filterSales(req.body.filter);
    if (actionResponse.result) {
      res.status(200).json(actionResponse.sales);
    } else {
      res.status(503).json(actionResponse.message);
    }
  });
});

app.post("/add", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    // const firstImage = req.files.find((file) => file.fieldname === "image1");
    // const secondImage = req.files.find((file) => file.fieldname === "image2");
    const bodyInformation = JSON.parse(req.body.info);
    const actionResponse = await salesRepo.createSale(
      bodyInformation.visitId,
      bodyInformation.notes,
      [],
      { ...bodyInformation.sale, agent: tokenManager.retrieve_id(req) }
    );
    if (actionResponse.result) {
      res.status(200).json(actionResponse.message);
    } else {
      res.status(503).json(actionResponse.message);
    }
  });
});

app.put("/confirm", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await salesRepo.confirmSale(req.body.saleId);
    if (actionResponse.result) {
      res.status(200).json({ message: actionResponse.message });
    } else {
      res.status(503).json({ message: actionResponse.message });
    }
  });
});

app.put("/dispatch", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await salesRepo.dispatchSale(req.body.saleId);
    if (actionResponse.result) {
      res.status(200).json({ message: actionResponse.message });
    } else {
      res.status(503).json({ message: actionResponse.message });
    }
  });
});

app.put("/edit-sale", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await salesRepo.editSale(
      req.body.saleId,
      req.body.newSoldProducts
    );
    if (actionResponse.result) {
      res.status(200).json({ message: actionResponse.message });
    } else {
      res.status(503).json({ message: actionResponse.message });
    }
  });
});

app.put("/mark-as-done", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await salesRepo.markSaleAsDone(req.body.saleId);
    if (actionResponse.result) {
      res.status(200).json(actionResponse.message);
    } else {
      res.status(503).json(actionResponse.message);
    }
  });
});

app.post("/sale-return", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await salesRepo.addSaleReturn(
      req.body.saleId,
      req.body.returnInformation
    );
    if (actionResponse.result) {
      res.status(200).json({ message: actionResponse.message });
    } else {
      res.status(503).json({ message: actionResponse.message });
    }
  });
});

app.post("/get-my-sales", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const filter = req.body.filter;
    const actionResponse = await salesRepo.filterSales({
      ...filter,
      agent: tokenManager.retrieve_id(req),
    });
    if (actionResponse.result) {
      res.status(200).json(actionResponse.sales);
    } else {
      res.status(503).json(actionResponse.message);
    }
  });
});

app.get("/sale-returns", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await salesRepo.getSaleReturns();
    if (actionResponse.result) {
      res.status(200).json(actionResponse.saleReturns);
    } else {
      res.status(503).json({ message: actionResponse.message });
    }
  });
});

app.put("/mark-received", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await salesRepo.markReturnAsReceived(
      req.body.returnId
    );
    if (actionResponse.result) {
      res.status(200).json({ message: actionResponse.message });
    } else {
      res.status(503).json({ message: actionResponse.message });
    }
  });
});

app.put("/mark-lost", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    const actionResponse = await salesRepo.markReturnAsLost(req.body.returnId);
    if (actionResponse.result) {
      res.status(200).json({ message: actionResponse.message });
    } else {
      res.status(503).json({ message: actionResponse.message });
    }
  });
});

module.exports = app;

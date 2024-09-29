const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const clientRepo = require("../controllers/client-repository");
const tokenManager = require("../utils/token-generator");

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/createclient", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const newClient = req.body;
      const result = await clientRepo.createClient(newClient);
      res.status(201).send("Client added successfully");
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/updateclient/:id", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const clientId = req.params.id;
      const newInformation = req.body;
      const result = await clientRepo.editClient(clientId, newInformation);
      if (result.result) {
        res.status(201).json(result);
      } else {
        res.status(400).json({ message: result.message });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/deleteclient/:id", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const clientId = req.params.id;
      const result = await clientRepo.deleteClient(clientId);
      if (result.result) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: result.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete-selection/:id", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const result = await clientRepo.deleteManyClients(req.body.clients);
      if (result.result) {
        res.status(200).json(result.message);
      } else {
        res.status(400).json({ message: result.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

app.get("/getclient/:id", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const clientId = req.params.id;
      const client = await clientRepo.serve_full_info_by_id(clientId);
      if (client) {
        res.status(200).json(client);
      } else {
        res.status(404).json({ message: "Client not found" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/zone", async (req, res) => {
  try {
    // await tokenManager.authorize(req, res, async () => {
    const newZone = req.body.newZone;
    const result = await clientRepo.addZone(newZone);
    res.status(200).send("Zone added successfully!");
    // });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/zone/:zone", async (req, res) => {
  try {
    const zone = req.params.zone;
    const result = await clientRepo.deleteZone(zone);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/editZone", async (req, res) => {
  try {
    const { oldZone, newZone } = req.body;
    const result = await clientRepo.editZone(oldZone, newZone);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/clientCount/:zone", async (req, res) => {
  try {
    const response = await clientRepo.zoneClientCount(req.params.zone);
    if (response.result) {
      res.status(200).json({ name: req.params.zone, count: response.count });
    } else {
      res.status(400).json(response.message);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/zones/retrieve", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const response = await clientRepo.getAllZones();
      if (response.result) {
        res.status(200).json(response.zones);
      } else {
        res.status(400).json(response.message);
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/city", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const newCity = req.body.newCity;
      const result = await clientRepo.addCity(newCity);
      res.status(200).send("City added successfully!");
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/city/:name", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const city = req.params.name;
      const result = await clientRepo.deleteCity(city);
      res.status(200).send("Deleted successfully!");
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/allclients", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const clients = await clientRepo.getAllClients();
      res.status(200).json(clients);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/filter", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const filter = req.query;
      const filteredClients = await clientRepo.filterClients(filter);
      res.status(200).json(filteredClients);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/zones", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const collection = await clientRepo.getAllZones();
      res.status(200).json(collection);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/cities", async (req, res) => {
  try {
    await tokenManager.authorize(req, res, async () => {
      const collection = await clientRepo.getAllCities();
      res.status(200).json(collection);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/get-by-type", async (req, res) => {
  await tokenManager.authorize(req, res, async () => {
    try {
      const user_type_to_client_type = {
        retail_agent: "retail",
        horeca_agent: "horeca",
      };
      const user_role = tokenManager.identify_role(req);
      const response = await clientRepo.filterClients({
        type: user_type_to_client_type[user_role],
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

module.exports = app;

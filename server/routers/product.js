const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const productRepo = require("../controllers/product-repository");
const tokenManager = require("../utils/token-generator");

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/", async (req, res) => {
  try {
    const productInfo = req.body;
    const result = await productRepo.addNewProduct(productInfo);
    if (result.result) {
      res.status(201).json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await productRepo.deleteProduct(productId);
    if (result.result) {
      res.status(201).json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/deletemanyproduct/:id", async (req, res) => {
  try {
    const productIds = req.params.id.split(",");
    const result = await productRepo.deleteManyProducts(productIds);
    if (result.result) {
      res.status(201).json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/updateproduct/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const newInformation = req.body;
    const result = await productRepo.editProductInformation(
      productId,
      newInformation
    );
    if (result.result) {
      res.status(201).json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getallproduct", async (req, res) => {
  try {
    const products = await productRepo.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/filter", async (req, res) => {
  try {
    const filter = req.query;
    const filteredProducts = await productRepo.filterProducts(filter);
    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/low-stock", async (req, res) => {
  try {
    const lowStockProducts = await productRepo.getLowStockProducts();
    res.status(200).json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/categories", async (req, res) => {
  try {
    const newCategory = req.body.category;
    const result = await productRepo.addNewCategory(newCategory);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/categories/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const result = await productRepo.deleteCategory(category);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// takes the old category and the new category in the request body. status 200 if successful. make sure to retrieve the message on the frontend in case of
//unsuccessful request
app.put("/editCategory", async (req, res) => {
  try {
    const { oldCategory, newCategory } = req.body;
    const result = await productRepo.editCategory(oldCategory, newCategory);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//returns an array with categories. expects no parameters
app.get("/categories/retrieve", async (req, res) => {
  try {
    const response = await productRepo.getCategories();
    if (response.result) {
      res.status(200).json(response.categories);
    } else {
      res.status(400).json(response.message);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// send category in params
app.get("/productCount/:category", async (req, res) => {
  try {
    const response = await productRepo.categoryProductCount(
      req.params.category
    );
    if (response.result) {
      res
        .status(200)
        .json({ name: req.params.category, count: response.count });
    } else {
      res.status(400).json(response.message);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/brands", async (req, res) => {
  try {
    const newBrand = req.body.newBrand;
    const result = await productRepo.addNewBrand(newBrand);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// same as the edit category endpoint
app.put("/editBrand", async (req, res) => {
  try {
    const { oldBrand, newBrand } = req.body;
    const result = await productRepo.editBrand(oldBrand, newBrand);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/brands/:brand", async (req, res) => {
  try {
    const brand = req.params.brand;
    const result = await productRepo.deleteBrand(brand);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/brands/retrieve", async (req, res) => {
  try {
    const response = await productRepo.getBrands();
    if (response.result) {
      res.status(200).json(response.brands);
    } else {
      res.status(400).json(response.message);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/units", async (req, res) => {
  try {
    const newUnit = req.body.unit;
    const result = await productRepo.addNewUnit(newUnit);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/units/:unit", async (req, res) => {
  try {
    const unit = req.params.unit;
    const result = await productRepo.deleteUnit(unit);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//returns an array with units. expects no parameters
app.get("/units/retrieve", async (req, res) => {
  try {
    const response = await productRepo.getUnits();
    if (response.result) {
      res.status(200).json(response.units);
    } else {
      res.status(400).json(response.message);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/editUnit", async (req, res) => {
  try {
    const { oldUnit, newUnit } = req.body;
    const result = await productRepo.editUnit(oldUnit, newUnit);
    if (result.result) res.status(200).json({ message: result.message });
    else res.status(400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/increaseQuantity/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const quantityAdded = req.body.quantityAdded;
    const result = await productRepo.increaseQuantity(productId, quantityAdded);
    res.status(200).send("Products added successfully!");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/decreaseQuantity/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const quantityDecreased = req.body.quantityDecreased;
    const result = await productRepo.decreaseQuantity(
      productId,
      quantityDecreased
    );
    res.status(200).send("Products removed successfully!");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//req.body.products = [ { id, quantity } ] 
app.put('/adjust/addition', async (req, res)=>{
  try{
    const products = req.body.products;
    const response = await productRepo.adjustProductsAddition(products);
    if(response.result){
      res.status(200).json({ message: response.message });
    } else {
      res.status(400).json({ message: response.message });
    }
  } catch(error) {
    res.status(500).json({ message: "Internal server error!" });
  }
})

//req.body.products = [ { id, quantity } ] 
app.put('/adjust/subtraction', async (req, res)=>{
  try{
    const products = req.body.products;
    const response = await productRepo.adjustProductsSubtraction(products);
    if(response.result){
      res.status(200).json({ message: response.message });
    } else {
      res.status(400).json({ message: response.message });
    }
  } catch(error){
    res.status(500).json({ message: "Internal server error!" });
  }
})

module.exports = app;

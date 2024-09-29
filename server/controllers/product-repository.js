const Product = require("../models/product.js");
const AuxData = require("../models/aux-data.js");
const { default: mongoose } = require("mongoose");

const addNewProduct = async (productInfo) => {
  try {
    const newProduct = new Product({ ...productInfo });
    await newProduct.save();
    return { result: true, message: "Product created!" };
  } catch (error) {
    // TODO: Create a module that takes error messages and translates them into some messages
    // that are understandable to the user
    return { result: false, message: "Product was not created!" };
  }
};

const deleteProduct = async (productId) => {
  try {
    const deletedProduct = await Product.findById(productId);
    if (deletedProduct.quantity > 0) {
      throw Error("This product still has quantity left in stock");
    }
    await deletedProduct.deleteOne();
    return { result: true, message: "Deleted successfully!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const deleteManyProducts = async (productIds) => {
  try {
    const productsToDelete = await Product.find({
      _id: { $in: productIds },
      quantity: { $eq: 0 },
    }).select("_id");
    const productIdsToDelete = productsToDelete.map((product) =>
      product._id.toString()
    );
    const result = await Product.deleteMany({
      _id: { $in: productIdsToDelete },
      quantity: { $eq: 0 },
    });
    const deletedCount = result.deletedCount;
    return {
      result: true,
      message:
        deletedCount === productsToDelete.length
          ? "Deleted successfully"
          : "Some of the products were not deleted because they still have items.",
      deletedProductIds: productIdsToDelete,
    };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const editProductInformation = async (productId, newInformation) => {
  try {
    await Product.findByIdAndUpdate(productId, { ...newInformation });
    return { result: true, message: "Updated successfully" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const getAllProducts = async () => {
  try {
    const products = await Product.find({});
    return products;
  } catch (error) {
    return "An unexpected error occurred!";
  }
};

const filterProducts = async (filter) => {
  try {
    const filteredProducts = await Product.find({ ...filter });
    return filteredProducts;
  } catch (error) {
    return "An unexpected error occurred!";
  }
};

const getLowStockProducts = async () => {
  const products = await Product.find({
    $expr: { $lt: ["$quantity", "$stockAlertQuantity"] },
  });
  return products;
};

const addNewCategory = async (newCategory) => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    if (!auxData) {
      const newAuxData = new AuxData();
      auxData = await newAuxData.save();
    }
    await auxData.addCategory(newCategory);
    return { result: true, message: "Added successfully!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const deleteCategory = async (category) => {
  try {
    const proudctsWithCategory = await Product.find({ category: category });
    if (proudctsWithCategory.length)
      throw new Error("There are still products with this category!");
    const collection = await AuxData.find({});
    let auxData = collection[0];
    await auxData.deleteCategory(category);
    return { result: true, message: "Category deleted" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const editCategory = async (oldCategory, newCategory) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    await auxData.deleteCategory(oldCategory);
    await auxData.addCategory(newCategory);
    await Product.findOneAndUpdate(
      { category: oldCategory },
      { category: newCategory }
    );
    return { result: true, message: "Category updated successfully" };
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return { result: false, message: error.message };
  }
};

const getCategories = async () => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    const categories = await Promise.all(
      auxData.categories.map(async (category) => {
        const products = await Product.find({ category: category });
        return { category: category, count: products.length };
      })
    );
    return { result: true, categories: categories };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const categoryProductCount = async (category) => {
  try {
    const products = await Product.find({ category: category });
    return { result: true, count: products.length };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const addNewBrand = async (newBrand) => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    if (!auxData) {
      const newAuxData = new AuxData();
      auxData = await newAuxData.save();
    }
    await auxData.addBrand(newBrand);
    return { result: true, message: "Brand added successfully!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const deleteBrand = async (brand) => {
  try {
    const proudctsWithBrand = await Product.find({ brand: brand });
    if (proudctsWithBrand.length)
      throw new Error("There are still products with this brand!");
    const collection = await AuxData.find({});
    let auxData = collection[0];
    await auxData.deleteBrand(brand);
    return { result: true, message: "Brand deleted!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const editBrand = async (oldBrand, newBrand) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    await auxData.deleteBrand(oldBrand);
    await auxData.addBrand(newBrand);
    await Product.findOneAndUpdate({ brand: oldBrand }, { brand: newBrand });
    return { result: true, message: "Category updated successfully" };
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return { result: false, message: error.message };
  }
};

const getBrands = async () => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    return { result: true, brands: auxData.brands };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const addNewUnit = async (newUnit) => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    if (!auxData) {
      const newAuxData = new AuxData();
      auxData = await newAuxData.save();
    }
    await auxData.addUnit(newUnit);
    return { result: true, message: "Unit added successfully!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const deleteUnit = async (unit) => {
  try {
    const proudctsWithUnit = await Product.find({ unit: unit });
    if (proudctsWithUnit.length)
      throw new Error("There are still products with this unit!");
    const collection = await AuxData.find({});
    let auxData = collection[0];
    await auxData.deleteUnit(unit);
    return { result: true, message: "Unit deleted!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const getUnits = async () => {
  try {
    const collection = await AuxData.find({});
    if (collection.length === 0) {
      return { result: false, message: "No auxiliary data found" };
    }
    let auxData = collection[0];
    return { result: true, units: auxData.units };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const editUnit = async (oldUnit, newUnit) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    await auxData.deleteUnit(oldUnit);
    await auxData.addUnit(newUnit);
    await Product.findOneAndUpdate({ unit: oldUnit }, { unit: newUnit });
    return { result: true, message: "Unit updated successfully" };
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return { result: false, message: error.message };
  }
};

const increaseQuantity = async (productId, quantityAdded) => {
  const product = await Product.findById(productId);
  await product.increaseQuantity(quantityAdded);
  return product;
};

const decreaseQuantity = async (productId, quantityDecreased) => {
  try {
    const product = await Product.findById(productId);
    await product.decreaseQuantity(quantityDecreased);
    return product;
  } catch (error) {
    throw error;
  }
};

const adjustProductsAddition = async (products) => {
  try {
    for (const product of products) {
      await increaseQuantity(product.id, product.quantity);
    }
    return { result: true, message: "Adjusted successfully!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const adjustProductsSubtraction = async (products) => {
  try {
    for (const product of products) {
      await decreaseQuantity(product.id, product.quantity);
    }
    return { result: true, message: "Adjusted successfully!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const updateQuantityOnReturn = async (bulkOps)=>{
  try {
    const result = await Product.bulkWrite(bulkOps);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  addNewProduct,
  deleteProduct,
  editProductInformation,
  getAllProducts,
  getLowStockProducts,
  filterProducts,
  addNewBrand,
  addNewCategory,
  addNewUnit,
  deleteBrand,
  deleteCategory,
  deleteUnit,
  increaseQuantity,
  decreaseQuantity,
  deleteManyProducts,
  getCategories,
  getBrands,
  getUnits,
  editCategory,
  editBrand,
  categoryProductCount,
  editUnit,
  adjustProductsAddition,
  adjustProductsSubtraction,
  updateQuantityOnReturn
};

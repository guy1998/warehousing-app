const mongoose = require('mongoose');

const saleReturn = new mongoose.Schema({
    products: { type: [{ 
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        priceHoreca: { type: mongoose.Schema.Types.Decimal128, required: true },
        priceRetail: { type: mongoose.Schema.Types.Decimal128, required: true },
        soldPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
        unit: { type: String, required: true },
        realProduct: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "product" }
    }], required: true},
    client: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Client" },
    status: { type: String, enum: ['pending', 'received', 'lost'], default: 'pending' },
    amount: { type: mongoose.Schema.Types.Decimal128, required: true, default: 0 },
    type: { type: String, enum: ["horeca", "retail"] },
})

saleReturn.methods.calculateAmount = function() {
    let total = 0;
    this.products.forEach(product => {
        total += parseFloat(product.soldPrice) * parseFloat(product.quantity);
    });
    return mongoose.Types.Decimal128.fromString(total.toString());
};

saleReturn.pre('save', function(next) {
    this.amount = this.calculateAmount();
    next();
});

const saleReturnModel = mongoose.model('SaleReturn', saleReturn);

module.exports = saleReturnModel;
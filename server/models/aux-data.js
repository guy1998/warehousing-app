const mongoose = require('mongoose');

const auxData = new mongoose.Schema({
    units: { type: [String], default: ["Kg", "Pieces", "Liter"] },
    brands: { type: [String], default: ["Prendillcaffee"] },
    categories: { type: [String], default: [] },
    cities: { type: [String], default: [] },
    zones: { type: [String], default: [] }
})

auxData.methods.addUnit = async function (newUnit){
    if(!this.units.includes(newUnit)){
        this.units.push(newUnit);
        await this.save();
    }
}

auxData.methods.addBrand = async function(newBrand){
    if(!this.brands.includes(newBrand)){
        this.brands.push(newBrand);
        await this.save();
    }
}

auxData.methods.addCategory = async function(newCategory){
    if(!this.categories.includes(newCategory)){
        this.categories.push(newCategory);
        await this.save();
    }
}

auxData.methods.addCities = async function(newCity){
    if(!this.cities.includes(newCity)){
        this.cities.push(newCity);
        await this.save();
    }
}

auxData.methods.addZones = async function(newZone){
    if(!this.zones.includes(newZone)){
        this.zones.push(newZone);
        await this.save();
    }
}

auxData.methods.deleteCategory = async function (category){
    if(this.categories.includes(category)){
        this.categories.splice(this.categories.indexOf(category), 1);
        await this.save()
    }
}

auxData.methods.deleteBrand = async function (brand){
    if(this.brands.includes(brand)){
        this.brands.splice(this.brands.indexOf(brand), 1);
        await this.save()
    }
}

auxData.methods.deleteUnit = async function (unit){
    if(this.units.includes(unit)){
        this.units.splice(this.units.indexOf(unit), 1);
        await this.save()
    }
}

auxData.methods.deleteCity = async function (city){
    if(this.cities.includes(city)){
        this.cities.splice(this.cities.indexOf(city), 1);
        await this.save()
    }
}

auxData.methods.deleteZone = async function (zone){
    if(this.zones.includes(zone)){
        this.zones.splice(this.zones.indexOf(zone), 1);
        await this.save()
    }
}

const auxDataModel = mongoose.model('AuxData', auxData);

module.exports = auxDataModel;
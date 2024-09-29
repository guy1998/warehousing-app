const Client = require("../models/client");
const AuxData = require("../models/aux-data");
const { default: mongoose } = require("mongoose");

const createClient = async (newClient) => {
  try {
    const client = new Client({ ...newClient });
    return await client.save();
  } catch (error) {
    return error.message;
  }
};

const editClient = async (clientId, newInformation) => {
  try {
    await Client.findByIdAndUpdate(clientId, { ...newInformation });
    return { result: true, message: "Updated successfully" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const deleteClient = async (clientId) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(clientId);
    return { result: true, message: "Deleted successfully!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const deleteManyClients = async (clients) => {
  try {
    const deletedClients = await Client.deleteMany({ _id: { $in: clients } });
    return { result: true, message: "Deleted successfully!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const serve_full_info_by_id = async (client_id) => {
  const client = await Client.findById(client_id).exec();
  return client;
};

const filterClients = async (filter) => {
  try {
    // TODO: Create a module that manages filters
    const filteredClients = await Client.find({ ...filter });
    return filteredClients;
  } catch (error) {
    return error.message;
  }
};

const addZone = async (newZone) => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    if (!auxData) {
      const newAuxData = new AuxData();
      auxData = await newAuxData.save();
    }
    await auxData.addZones(newZone);
  } catch (error) {
    console.log(error);
    return "An unexpected error occurred";
  }
};

const deleteZone = async (zone) => {
  try {
    const clientWithZone = await Client.find({ zone: zone });
    if (clientWithZone.length)
      throw new Error("There are still clients with this zone!");
    const collection = await AuxData.find({});
    let auxData = collection[0];
    await auxData.deleteZone(zone);
    return { result: true, message: "Zone deleted" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const editZone = async (oldZone, newZone) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    await auxData.deleteZone(oldZone);
    await auxData.addZones(newZone);
    await Client.findOneAndUpdate({ zone: oldZone }, { zone: newZone });
    return { result: true, message: "Zone updated successfully" };
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return { result: false, message: error.message };
  }
};

const zoneClientCount = async (zone) => {
  try {
    const clients = await Client.find({ zone: zone });
    return { result: true, count: clients.length };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const addCity = async (newCity) => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    if (!auxData) {
      const newAuxData = new AuxData();
      auxData = await newAuxData.save();
    }
    await auxData.addCities(newCity);
  } catch (error) {
    console.log(error);
    return "An unexpected error occurred";
  }
};

const deleteCity = async (city) => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    await auxData.deleteCity(city);
  } catch (error) {
    return "An unexpected error occurred";
  }
};

const getAllClients = async () => {
  try {
    const clients = await Client.find({});
    return clients;
  } catch (error) {
    return error.message;
  }
};

const getAllZones = async () => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    const zones = await Promise.all(
      auxData.zones.map(async (zone) => {
        const clients = await Client.find({ zone : zone });
        return { zone : zone, count: clients.length };
      })
    );
    return { result: true, zones : zones };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const getAllCities = async () => {
  try {
    const collection = await AuxData.find({});
    let auxData = collection[0];
    return auxData.cities;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  createClient,
  editClient,
  deleteClient,
  addZone,
  deleteZone,
  addCity,
  deleteCity,
  getAllCities,
  getAllZones,
  getAllClients,
  filterClients,
  deleteManyClients,
  editZone,
  serve_full_info_by_id,
  zoneClientCount
};

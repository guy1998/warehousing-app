const Visit = require("../models/visits");
const { calculateDuration } = require("../utils/date-utils");

const createNewVisit = async (visit) => {
  try {
    const newVisit = new Visit({ ...visit });
    const added = await newVisit.save();
    return { result: true, newVisit: added };
  } catch (err) {
    console.log(err);
    return { result: false, newVisit: {} };
  }
};

// TODO: Ask if this is really needed
const deleteVisit = async (visitId) => {
  try {
    await Visit.findByIdAndDelete(visitId);
    return { result: true, message: "Deleted successfully!" };
  } catch (err) {
    return { result: false, message: err.message };
  }
};

const markVisitUnsuccessful = async (visitId, notes, images) => {
  try {
    const visit = await Visit.findById(visitId);
    visit.set("status", "unsuccessful");
    visit.set("duration", calculateDuration(visit.timeStart));
    visit.set("notes", notes);
    visit.set("imagePaths", images);
    const newVisit = await visit.save();
    return {
      result: true,
      message: "Updated successfully",
      updatedVisit: newVisit,
    };
  } catch (err) {
    return { result: false, message: err.message };
  }
};

// No error handling because it will be used within a database transaction
const markVisitSuccessful = async (visitId, notes, images) => {
  const visit = await Visit.findById(visitId);
  visit.set("status", "successful");
  visit.set("duration", calculateDuration(visit.timeStart));
  visit.set("notes", notes);
  visit.set("imagePaths", images);
  const newVisit = await visit.save();
  return newVisit;
};

const getVisitsFiltered = async (filter) => {
  try {
    const visits = await Visit.find({ ...filter })
      .populate("client")
      .populate("agentId")
      .exec();
    return { result: true, visits: visits };
  } catch (err) {
    console.log(err);
    return { result: false, visits: [] };
  }
};
const getVisits = async () => {
  try {
    const visits = await Visit.find({})
      .populate("client")
      .populate("agentId")
      .exec();
    return { result: true, visits: visits };
  } catch (err) {
    return { result: false, visitis: [] };
  }
};

const editVisit = async (visitId, newInfo) => {
  try {
    const edited = await Visit.findByIdAndUpdate(visitId, { ...newInfo });
    return { result: true, message: "Successful editing!" };
  } catch (error) {
    return { result: false, message: error.message };
  }
};

module.exports = {
  createNewVisit,
  deleteVisit,
  markVisitSuccessful,
  markVisitUnsuccessful,
  getVisitsFiltered,
  getVisits,
  editVisit,
};

const mongoose = require('mongoose');
const Sale = require('../models/sale');
const Visit = require('../models/visits');

function getTodayRange() {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' GMT+0000';
    const end = new Date(today.setHours(23, 59, 59, 999)).toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' GMT+0000';
    return { start, end };
}

const getVisitStats = async ()=>{
    try {
        const { start, end } = getTodayRange();
        const successfulVisits = await Visit.countDocuments({ status: 'successful', timeStart: { $gte: start, $lte: end } });
        const unsuccessfulVisits = await Visit.countDocuments({ status: 'unsuccessful', timeStart: { $gte: start, $lte: end } });
        const ongoingVisits = await Visit.countDocuments({ status: 'ongoing', timeStart: { $gte: start, $lte: end } });
        return { result: true, stats: { successfulVisits, unsuccessfulVisits, ongoingVisits }}
    } catch(err){
        return { result: false, message: err.message }
    }
}

const getSalesStats = async ()=>{
    try {
        const { start, end } = getTodayRange();
        const salesToday = await Sale.countDocuments({ date: { $gte: start, $lte: end }});
        return { result: true, salesToday }
    } catch(err) {
        return { result: false, message: err.message }
    }
}

module.exports = {
    getVisitStats,
    getSalesStats
}
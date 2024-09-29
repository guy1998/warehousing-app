const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const statsRepo = require('../controllers/stat-repository')
const tokenManager = require("../utils/token-generator");

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/visits', async (req, res)=>{
    try{
        const response = await statsRepo.getVisitStats();
        if(response.result)
            res.status(200).json(response.stats)
        else
            res.status(400).json({ message: response.message });
    } catch(error) {
        res.status(500).json({ message: "Internal server error!" });
    }
})

app.get('/sales', async (req, res)=>{
    try{
        const response = await statsRepo.getSalesStats();
        if(response.result)
            res.status(200).json(response.salesToday)
        else
            res.status(400).json({ message: response.message });
    } catch(error) {
        res.status(500).json({ message: "Internal server error!" });
    }
})

module.exports = app;
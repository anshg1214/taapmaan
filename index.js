require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const { getLocation } = require("./api/location.js");
const { getWeather } = require("./api/weather.js");
const { getIPinfo } = require("./api/getip.js");

const app = express();

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/locationsuggestion", async (req, res) => {
    const userInput = req.body.val;
    const locationdata = await getLocation(userInput);
    const data = locationdata.data;

    const compilesugessions = () => {
        if (data.length == 0 && userInput != "") {
            return "No result found";
        }

        const dname = data.map((d) => d.display_name);
        const dlat = data.map((d) => d.lat);
        const dlon = data.map((d) => d.lon);

        return {
            dname,
            dlat,
            dlon,
        };
    };

    let result = compilesugessions();

    return res.send(result);
});

app.post("/weatherinfo", async (req, res) => {
    const elem = req.body;
    const lat = elem.lattitude;
    const lon = elem.longitude;
    const weatherdata = await getWeather(lat, lon, process.env.API_KEY);
    const data = weatherdata.data;
    return res.send(data);
});

app.get("/iplocation", async (req, res) => {
    var ip = req.headers["x-forwarded-for"];
    var location = await getIPinfo(ip, process.env.IP_API_KEY);
    var locationdata = location.data;
    return res.send(locationdata);
});

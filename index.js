const express = require("express");
const axios = require("axios");

const { getLocation } = require("./api/location.js");
const { getWeather } = require("./api/weather.js");

const app = express();

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
});


app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/locationsuggestion", async (req, res) => {
    // console.log(req.body);
    const userInput  = req.body.val;
    // console.log(userInput);

    const locationdata = await getLocation(userInput);
    const data = locationdata.data;    

    const compilesugessions = () => {
        
        if (data.length == 0 && userInput != ""){
            return "No result found";
        }

        const dname = data.map(d => d.display_name);
        const dlat = data.map(d => d.lat);
        const dlon = data.map(d => d.lon);

        return {
            dname,
            dlat,
            dlon
        };
    };

    let result = compilesugessions();

    return res.send(result);

});

app.post('/weatherinfo', async (req, res) => {
    const elem = req.body;
    const lat = elem.lattitude;
    const lon = elem.longitude;
    const weatherdata = await getWeather(lat, lon);
    const data = weatherdata.data;
    return res.send(data);
});



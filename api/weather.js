const axios = require("axios");


const getWeather = async(lat, lon, API_KEY) => {
    const BASE_URL = `https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&appid=${API_KEY}&units=metric`;
    const config = {
        method: "get",
        url: `${BASE_URL}&lon=${lon}&lat=${lat}`,
    }
    return await axios(config);
}

module.exports = { getWeather };
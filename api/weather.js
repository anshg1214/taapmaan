const axios = require("axios");

const BASE_URL = "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&appid=2d0526c54b2e11a44a6b9339669885ad&units=metric";


const getWeather = async(lat, lon) => {
    const config = {
        method: "get",
        url: `${BASE_URL}&lon=${lon}&lat=${lat}`,
    }
    return await axios(config);
}

module.exports = { getWeather };
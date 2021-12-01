const axios = require("axios");


const getLocation = async (val) => {
    const config = {
        method: "get",
        url: `https://nominatim.openstreetmap.org/search/?city=${val}&format=json&accept-language=en-us`,
    }
    return await axios(config);
}


module.exports = { getLocation };
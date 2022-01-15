const axios = require("axios");


const getIPinfo = async(ip_address, IP_API_KEY) => {
    const config = {
        method: "get",
        url: `https://api.freegeoip.app/json/${ip_address}?apikey=${IP_API_KEY}`,
    }
    return await axios(config);
}

module.exports = { getIPinfo };

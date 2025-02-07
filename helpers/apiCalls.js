
require("dotenv").config({path:'../.env'});

const axios = require('axios');

async function makeAPICallrunERP(url){
    try {
        const response=await axios.get(url);
        return response;
    } catch (error) {
        return "error accured while making API call "
    }
}
async function makeAPICallGOV(offseet){
    try {
        const url=`${process.env.GOVURL}${offseet}`
        const response=await axios.get(url);
        return response;
    } catch (error) {
        return "error accured while making API call "
    }
}

module.exports = {makeAPICallrunERP,makeAPICallGOV};

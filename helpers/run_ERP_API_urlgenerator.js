require("dotenv").config({path:'../.env'});
const type='&ARGUMENTS=';

function bitul_mishloah(){
    let bitol=process.env.URL;
    bitol+=`bitul_mishloah${type}`
    return bitol
}
function ship_create_anonymous(){
    let bitol=process.env.URL;
    bitol+=`ship_create_anonymous${type}`
    return bitol
}

function ship_print_ws(){
    let bitol=process.env.URL;
    bitol+=`ship_print_ws${type}`
    return bitol
}

function ws_spotslist(){
    let bitol=process.env.URL;
    bitol+=`ws_spotslist${type}`
    return bitol
}

function ship_status_xml(){
    let bitol=process.env.URL;
    bitol+=`ship_status_xml${type}`
    return bitol
}

module.exports = {bitul_mishloah,ws_spotslist,ship_print_ws,ship_create_anonymous,ship_status_xml};

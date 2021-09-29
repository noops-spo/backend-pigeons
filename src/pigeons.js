const fs = require('fs');

function init () {
    // console.debug("Read data.json file");
    let pigeons = JSON.parse(fs.readFileSync('/noopspoolData/data.json'));
    // console.debug(pigeons)
    return pigeons["pigeons"]
}

function getPigeonByID (listPigeons, id) {
    for (let i = 0; i < listPigeons.length; i++) {
        if (listPigeons[i]["id"] == id) {
            // console.debug(listPigeons[i])
            return listPigeons[i];
        }
    }
    // console.debug("Full List:");
    // console.debug(listPigeons);
    // console.debug("Demanded pigeon");
    // console.debug(id);
    return null;
}

module.exports.init = init
module.exports.getPigeonByID = getPigeonByID
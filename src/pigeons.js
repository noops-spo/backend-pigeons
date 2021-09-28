const fs = require('fs');

function init () {
    // console.debug("Read data.json file");
    let pigeons = JSON.parse(fs.readFileSync('/noopspoolData/data.json'));
    // console.debug(pigeons)
    return pigeons
}

function getPigeonByName (listPigeons, name) {
    // console.debug("Full List:")
    // console.debug(listPigeons)
    // console.debug("Demanded pigeon")
    // console.debug(listPigeons[name])
    return listPigeons[name]
}

module.exports.init = init
module.exports.getPigeonByName = getPigeonByName
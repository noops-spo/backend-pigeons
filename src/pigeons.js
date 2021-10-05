const fs = require('fs');

const payment = require('./payment')

function init () {
    let pigeons = JSON.parse(fs.readFileSync('/noopspoolData/data.json'));
    return pigeons["pigeons"];
}

function getPigeonByID (listPigeons, id) {
    for (let i = 0; i < listPigeons.length; i++) {
        if (listPigeons[i]["id"] == id) {
            return listPigeons[i];
        }
    }
    return null;
}

function updatePigeonStatusByID (listPigeons, id, newStatus) {
    for (let i = 0; i < listPigeons.length; i++) {
        if (listPigeons[i]["id"] == id) {
            listPigeons[i]["sold"] = newStatus;
            if (newStatus == "reserved") {
                console.debug("Called checkPayment");
                payment.checkPayment(listPigeons, id);
            }
            return listPigeons[i];
        }
    }
    return null;
}

module.exports.init = init
module.exports.getPigeonByID = getPigeonByID
module.exports.updatePigeonStatusByID = updatePigeonStatusByID
const CardanocliJs = require("cardanocli-js");
const fs = require('fs');

const payment = require('./payment')

const initPigeon = () => {
    let pigeons = JSON.parse(fs.readFileSync('/noopspoolData/data.json'));
    return pigeons["pigeons"];
}

const initCardanoCLI = () => {
    const shelleyGenesisPath = "/noopspool/conf/mainnet-shelley-genesis.json";
    const cardanocliJs = new CardanocliJs({ shelleyGenesisPath });

    return cardanocliJs;
}

const getPigeonByID = (listPigeons, id) => {
    for (let i = 0; i < listPigeons.length; i++) {
        if (listPigeons[i]["id"] == id) {
            return listPigeons[i];
        }
    }
    console.log("Pigeon not found");
    return null;
}

const updatePigeonStatusByID = (listPigeons, id, newStatus, cli) => {
    for (let i = 0; i < listPigeons.length; i++) {
        if (listPigeons[i]["id"] == id) {
            listPigeons[i]["sold"] = newStatus;
            if (newStatus == "reserved") {
                // console.debug("Called checkPayment");
                payment.checkPayment(listPigeons, id, cli);
            }
            return listPigeons[i];
        }
    }
    console.log("Pigeon not found");
    return null;
}

module.exports.initCardanoCLI = initCardanoCLI
module.exports.initPigeon = initPigeon
module.exports.getPigeonByID = getPigeonByID
module.exports.updatePigeonStatusByID = updatePigeonStatusByID
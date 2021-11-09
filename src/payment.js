const pigeons = require('./pigeons');
const blockfrost = require('./blockfrost');

const addressKeyPath = process.env.ADDRESS_KEY_PATH ;
const addressMint = process.env.ADDRESS_MINT ;
const reservationValidity = process.env.RESERVATION_VALIDITY ;

const asyncInterval = async (callback, ms, validTimestamp, cli, pigeon) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            if (pigeon["sold"] == "reserved") {
                if (await callback(cli, pigeon)) {
                    resolve();
                    clearInterval(interval);
                } else if (Date.now() >= validTimestamp) {
                    reject();
                    clearInterval(interval);
                }
            } else {
                console.log("Cancel checkPayment");
                reject();
                clearInterval(interval);
            }
        }, ms);
    });
}

const checkPaymentAddress = async (cli, pigeon) => {
    if (pigeon["sold"] == "reserved") {
        console.log('Check Cardano Address -> ', pigeon["address"]);
        console.log('Check Pigeon Sold Status -> ', pigeon["sold"]);

        // https://developers.cardano.org/docs/integrate-cardano/listening-for-payments-cli/
        // https://github.com/Berry-Pool/cardanocli-js
        listUtxo = cli.queryUtxo(pigeon["address"]);
        for (let i = 0; i < listUtxo.length; i++) {
            if (listUtxo[i]["value"]["lovelace"] >= cli.toLovelace(pigeon["price"])) {
                let addressCustomer = await blockfrost.getTransaction(listUtxo[i]["txHash"]);
                console.log(addressCustomer);
                pigeons.sendPigeon(cli, addressMint, addressKeyPath, pigeon["policyId"]+"."+pigeon["id"], addressCustomer);
                return true;
            }
        }
    } else {
        console.debug("Debug/checkPaymentAddress(): pigeon.sold != reserved")
    }

    return false;
}

const checkPayment = async (listPigeons, id, cli) => {
    console.debug("Debug: Function checkPayment()");

    pigeon = pigeons.getPigeonByID(listPigeons, id);
    try {
        await asyncInterval(checkPaymentAddress, 10000, Date.now() + (reservationValidity * 60 *1000), cli, pigeon);
        console.log("Payment OK");
        pigeons.updatePigeonStatusByID(listPigeons, id, 1);
    } catch (e) {
        console.log("Payment No OK");
        pigeons.updatePigeonStatusByID(listPigeons, id, 0);
    }
    console.log("Check Finish!");
}

module.exports.checkPayment = checkPayment
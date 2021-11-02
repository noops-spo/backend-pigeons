const pigeons = require('./pigeons');
const blockfrost = require('./blockfrost');

const addressKeyPath = process.env.ADDRESS_KEY_PATH ;

const asyncInterval = async (callback, ms, triesLeft = 5, cli, pigeon) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            if (await callback(cli, pigeon)) {
            resolve();
            clearInterval(interval);
            } else if (triesLeft <= 1) {
            reject();
            clearInterval(interval);
            }
            triesLeft--;
        }, ms);
    });
}

const checkPaymentAddress = async (cli, pigeon, id) => {
    console.log('Check Addr...');

    // https://developers.cardano.org/docs/integrate-cardano/listening-for-payments-cli/
    // https://github.com/Berry-Pool/cardanocli-js
    listUtxo = cli.queryUtxo(pigeon["address"]);
    for (let i = 0; i < listUtxo.length; i++) {
        if (listUtxo[i]["value"]["lovelace"] >= cli.toLovelace(pigeon["price"])) {
            addressCustomer = blockfrost.getTransaction(listUtxo[i]["txHash"]);
            console.log(addressCustomer);
            pigeons.sendPigeon(cli, pigeon["address"], addressKeyPath, id, addressCustomer);
            return true;
        }
    }

    return false;
}

const checkPayment = async (listPigeons, id, cli) => {
    pigeon = pigeons.getPigeonByID(listPigeons, id);
    try {
        await asyncInterval(checkPaymentAddress, 10000, 5, cli, pigeon, id);
        console.log("Payment OK");
        pigeons.updatePigeonStatusByID(listPigeons, id, 1);
    } catch (e) {
        console.log("Payment No OK");
        pigeons.updatePigeonStatusByID(listPigeons, id, 0);
    }
    console.log("Check Finish!");
}

module.exports.checkPayment = checkPayment
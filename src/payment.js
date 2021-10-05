const pigeons = require('./pigeons')

const asyncInterval = async (callback, ms, triesLeft = 5) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            if (await callback()) {
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

const checkPaymentAddress = async () => {
    console.log('Check Addr...');
    // #TODO -> REAL Check
    return Math.random() > 0.2;
}

const checkPayment = async () => {
    try {
        await asyncInterval(checkPaymentAddress, 10000);
        console.log("Payment OK");
        // #TODO -> Pass status to selled (sold: 1)
    } catch (e) {
        console.log("Payment No OK");
        // #TODO -> Pass status to selled (sold: 0)
    }
    console.log("Check Finish!");
}

module.exports.checkPayment = checkPayment
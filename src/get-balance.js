const cardano = require("./cardano");


////Usage
const sender = cardano.wallet("PigeonsPolicy");
console.log(sender.balance());

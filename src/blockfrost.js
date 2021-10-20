const BlockfrostJs = require("@blockfrost/blockfrost-js");

const BlockfrostAPI = new BlockfrostJs.BlockFrostAPI({
    projectId: process.env.BLOCKFROST_PROJECT_ID,
});

const getTransaction = async (txHash) => {
    try {
        const utxo = await BlockfrostAPI.txsUtxos(txHash);
        console.log('senderAddress:', utxo.inputs[0].address);
    } catch (err) {
        console.log('error', err);
    }
}

module.exports.getTransaction = getTransaction
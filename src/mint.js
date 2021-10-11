const fs = require("fs");
const cardano = require("./cardano");


const buildTransaction = (tx) => {
  const raw = cardano.transactionBuildRaw(tx);
  const fee = cardano.transactionCalculateMinFee({
    ...tx,
    txBody: raw,
  });
  tx.txOut[0].amount.lovelace -= fee;
  return cardano.transactionBuildRaw({ ...tx, fee });
};

const signTransaction = (wallet, tx, script) => {
  return cardano.transactionSign({
    signingKeys: [wallet.payment.skey, wallet.payment.skey],
    scriptFile: script,
    txBody: tx,
  });
};

const wallet = cardano.wallet(//TODO NAMEfromJSON);

const POLICY_ID = cardano.transactionPolicyid(mintScript) ///TODOFROMFILE
const ASSET_NAME = //TODO NAMEfromJSON;
const ASSET_ID = POLICY_ID + "." + ASSET_NAME;

const metadata = {
  721: {
    [POLICY_ID]: {
      [ASSET_NAME]: {
        name: //TODO NAMEfromJSONwithspace,
        image: //TODO thumbfromJSON,
        project: "PigeonsNFT",
        type: "image/png",
        src: //TODO fullimagfromJSON,
        artist: "https://twitter.com/NftPigeons,
        website: "https://pigeonsnft.com",
        rarity: //TODO rarityfromJSON,
        background: //TODO backgroundfromJSON,
        attributes: //TODO attributesfromJSON,
        "hats and hair": //TODO hatsfromJSON,
        clothes: //TODO clothesfromJSON,
      },
    },
  },
};

const tx = {
  txIn: wallet.balance().utxo,
  txOut: [
    {
      address: wallet.paymentAddr,
      amount: { ...wallet.balance().amount, [ASSET_ID]: 1 },
    },
  ],
  mint: [{ action: "mint", amount: 1, token: ASSET_ID }],
  metadata,
  witnessCount: 2,
};

const raw = buildTransaction(tx);
const signed = signTransaction(wallet, raw, mintScript);
const txHash = cardano.transactionSubmit(signed);
console.log(txHash);
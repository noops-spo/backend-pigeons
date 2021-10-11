const cardano = require("./cardano")
const mintScript = require("../priv/policies/mint-policy.json")

module.exports = () => {

    const policyId = cardano.transactionPolicyid(mintScript)

    return {
        policyId,
        mintScript
    }
}
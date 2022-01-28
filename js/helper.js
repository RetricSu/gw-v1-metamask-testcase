const config = require("../config");
const { parseAddress } = require("@ckb-lumos/helpers");
const { Godwoker } = require("@polyjuice-provider/base");
const fetch = require("cross-fetch");
const { utils } = require("@ckb-lumos/base");

const godwoker = new Godwoker(config.web3RpcUrl);

exports.requestRpc = async (method, params) => {
  const response = await fetch(config.web3RpcUrl, {
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: new Date(),
      method: method,
      params: params,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    keepalive: true,
  });
  const data = await response.json();
  return data.result;
};

exports.getAccountScriptHash = async (ethAddress) => {
  await godwoker.init();
  return await godwoker.computeScriptHashByEoaEthAddress(ethAddress);
};

exports.getAccountId = async (accountScriptHash) => {
  return await this.requestRpc("gw_get_account_id_by_script_hash", [accountScriptHash]);
};

exports.getNonce = async (ethAddress) => {
  const scriptHash = await this.getAccountScriptHash(ethAddress);
  const accountId = await this.getAccountId(scriptHash);
  return await godwoker.getNonce(parseInt(accountId, 16));
};

exports.getLayer1OwnerLock = async (ckbAddress) => {
  const lock = parseAddress(ckbAddress);
  return {
    codeHash: lock.code_hash,
    hashType: lock.hash_type,
    args: lock.args
  };
};

exports.getLayer1OwnerLockHash = (ckbAddress) => {
  const lock = parseAddress(ckbAddress);
  const scriptHash =  utils.computeScriptHash(lock);
  return scriptHash;
}

exports.getUdtScriptHash = async (udtId) => {
  const scriptHash = await this.requestRpc("gw_get_script_hash", [
    "0x" + udtId.toString(16),
  ]);
  return scriptHash;
};

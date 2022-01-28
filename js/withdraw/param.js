const {
  requestRpc,
  getNonce,
  getLayer1OwnerLock,
  getUdtScriptHash,
  getAccountScriptHash,
  getLayer1OwnerLockHash,
} = require("../helper");

exports.getWithdrawInfo = async (
  ethAddress,
  ckbAddress,
  udtId,
  UDTAmount,
  feeUdtAmount,
  ckbCapacity
) => {
  const chainInfo = await requestRpc("poly_getChainInfo", []);
  const {
    rollupScriptHash,
    rollupConfigHash,
    ethAccountLockTypeHash,
    polyjuiceContractTypeHash,
    polyjuiceCreatorId,
    chainId,
  } = chainInfo;

  const accountScriptHash = await getAccountScriptHash(ethAddress);
  const nonce = await getNonce(ethAddress);
  const layer1OwnerLock = await getLayer1OwnerLock(ckbAddress);
  const layer1OwnerLockHash = getLayer1OwnerLockHash(ckbAddress);
  const UDTScriptHash = await getUdtScriptHash(udtId);

  const rawWithdrawalRequest = {
    chain_id: chainId,
    nonce: nonce,
    capacity: "0x" + BigInt(ckbCapacity).toString(16),
    amount: "0x" + BigInt(UDTAmount).toString(16),
    sudt_script_hash: UDTScriptHash,
    account_script_hash: accountScriptHash,
    owner_lock_hash: layer1OwnerLockHash,
    fee: {
      sudt_id: udtId,
      amount: feeUdtAmount,
    },
  };

  const msgParams = {
    domain: {
      chainId: chainId,
      name: "Godwoken",
      version: "1",
    },
    message: {
      accountScriptHash,
      nonce,
      layer1OwnerLock,
      withdraw: {
        ckbCapacity,
        UDTAmount,
        UDTScriptHash,
      },
      fee: {
        UDTId: udtId,
        UDTAmount: feeUdtAmount,
      },
    },
    primaryType: "Withdrawal",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
      ],
      Withdrawal: [
        { name: "accountScriptHash", type: "bytes32" },
        { name: "nonce", type: "uint256" },
        { name: "layer1OwnerLock", type: "Script" },
        { name: "withdraw", type: "WithdrawalAsset" },
        { name: "fee", type: "Fee" },
      ],
      Fee: [
        { name: "UDTId", type: "uint256" },
        { name: "UDTAmount", type: "uint256" },
      ],
      Script: [
        { name: "codeHash", type: "bytes32" },
        { name: "hashType", type: "string" },
        { name: "args", type: "bytes" },
      ],
      WithdrawalAsset: [
        { name: "ckbCapacity", type: "uint256" },
        { name: "UDTAmount", type: "uint256" },
        { name: "UDTScriptHash", type: "bytes32" },
      ],
    },
  };
  return {rawWithdrawalRequest, msgParams};
};

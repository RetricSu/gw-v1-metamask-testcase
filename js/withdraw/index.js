const config = require("../../config");
const { getWithdrawInfo } = require("./param");
const fs = require("fs");
const path = require("path");

const run = async () => {
  try {
    const ethAddress = config.metaMaskEthAddress;
    const ckbAddress = config.withdrawToCkbAddress;
    const udtId = 1;
    const UDTAmount = 300;
    const feeUdtAmount = 100;
    const ckbCapacity = 100000000000;
    const withdrawInfo = await getWithdrawInfo(
      ethAddress,
      ckbAddress,
      udtId,
      UDTAmount,
      feeUdtAmount,
      ckbCapacity
    );
    
    const withdrawJsFile = path.resolve(
      __dirname,
      "../../webpage/static/withdraw.js"
    );
    await fs.writeFileSync(
      withdrawJsFile,
      `const withdrawParamMsg = ` +
      JSON.stringify(withdrawInfo.msgParams, null, 2) +
      `;\n\n` + 
      `const rawWithdrawRequest = ` +
      JSON.stringify(withdrawInfo.rawWithdrawalRequest, null, 2) + 
      `;\n\n` + 
      `const erc20ContractAddress = "` + config.erc20ContractAddress + `";`
    );
    console.log("done.");
  } catch (error) {
    console.log(error);
  }
};

run();

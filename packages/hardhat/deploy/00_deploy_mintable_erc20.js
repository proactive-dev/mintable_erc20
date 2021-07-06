// deploy/00_deploy_mintable_erc20.js

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const initialSupply = 100;
  await deploy("MintableERC20", {
    from: deployer,
    args: [initialSupply],
    log: true,
  });

  /*
    // Getting a previously deployed contract
    const MintableERC20 = await ethers.getContract("MintableERC20", deployer);
    await MintableERC20.mint("0x00000000000000000000000", 100);
    
    //const yourContract = await ethers.getContractAt('MintableERC20', "0x00000000000000000000000") // Contract Address
  */
};
module.exports.tags = ["MintableERC20"];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/

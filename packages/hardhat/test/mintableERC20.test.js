const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Mintable ERC20", function () {
  let mintableERC20;
  const initialSupply = 1000;

  describe("MintableERC20", function () {
    it("Should deploy MintableERC20", async function () {
      const mintableERC20Factory = await ethers.getContractFactory("MintableERC20");
      mintableERC20 = await mintableERC20Factory.deploy(initialSupply);
    });

    describe("mint()", function () {
      it("Should mint new tokens to the account", async function () {
        const accounts = await ethers.getSigners();
        const account = accounts[0].address;
        const oldBalance = (await mintableERC20.balanceOf(account)).toNumber();
        await mintableERC20.mint(account, 100);
        expect(await mintableERC20.balanceOf(account)).to.equal(oldBalance + 100);
      });
    });
  });
});

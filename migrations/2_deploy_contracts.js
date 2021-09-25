const Tachyontoken = artifacts.require("Tachyontoken");
const Pitch = artifacts.require("Pitch");
const Fundraising = artifacts.require("Fundraising");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Tachyontoken);

  // tachyontoken.address
  await deployer.deploy(Pitch, accounts[0]);

  // await deployer.deploy(
  //   Fundraising,
  //   pitch.goal,
  //   pitch.deadline,
  //   pitch.minimumAcceptingContribution,
  //   pitch._owner
  // );
};

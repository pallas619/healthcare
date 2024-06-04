const path = require("path");

async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
      console.warn(
        "You are trying to deploy a contract to the Hardhat Network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }
  
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    const Voting = await ethers.getContractFactory("voting");
    const voting = await Voting.deploy();

    //console.log(JSON.stringify(voting));
    //console.log(voting.target);
  
    console.log("Voting smart contract address:", voting.target);
  
    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(voting);
  }

  function saveFrontendFiles(voting) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "src", "contracts");
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, "contract-address.json"),
      JSON.stringify({ Voting: voting.target }, undefined, 2)
    );
  
    const VotingArtifact = artifacts.readArtifactSync("voting");
  
    fs.writeFileSync(
      path.join(contractsDir, "Voting.json"),
      JSON.stringify(VotingArtifact, null, 2)
    );
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
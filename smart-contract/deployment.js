// Hardhat deployment script for PHU81.sol
// Deploy to Polygon: npx hardhat run smart-contract/deployment.js --network polygon

async function main () {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying PHU81 with account:', deployer.address);

  const PHU81 = await ethers.getContractFactory('PHU81');
  const token = await PHU81.deploy(deployer.address);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log('PHU81 deployed to:', address);
  console.log('Set PHU81_CONTRACT_ADDRESS=' + address + ' in backend .env');
}

main().catch(err => { console.error(err); process.exit(1); });

async function main() {
  const Claims = await ethers.getContractFactory("Claims");
  const claims = await Claims.deploy();
  await claims.deployed();
  console.log("Claims contract deployed at:", claims.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
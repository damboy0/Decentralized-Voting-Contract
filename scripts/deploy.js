const { ethers } = require("hardhat")

async function main() {
    const Voting = await ethers.getContractFactory("Voting")

    const _Voting = await Voting.deploy(["Mike", "Jude", "Andre", "Pulisic"], 120)
    console.log("Contract Address:", _Voting.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

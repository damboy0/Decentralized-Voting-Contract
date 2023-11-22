const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Voting", function () {
    let Voting
    let voting
    let owner
    let addr1
    let addr2

    beforeEach(async function () {
        ;[owner, addr1, addr2] = await ethers.getSigners()

        Voting = await ethers.getContractFactory("Voting")
        voting = await Voting.deploy(["Mike", "Jordan"], 10)
    })

    it("should allow owner to add a new cadidate", async function () {
        await voting.connect(owner).addCandidate("Ajoke")

        const candidates = await voting.getAllVotes()
        expect(candidates.length).to.equal(3)

        expect(candidates[2].name).to.equal("Ajoke")
    })

    it("should be able to vote", async function () {
        await voting.connect(addr1).vote(0)
        const candidate = await voting.getAllVotes()

        expect(candidate[0].voteCount).to.equal(1)
    })
})

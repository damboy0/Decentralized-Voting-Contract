const { expect } = require("chai")
const { ethers, network } = require("hardhat")

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

    it("Should not be able to vote twice", async function () {
        await voting.connect(addr1).vote(0)

        expect(voting.connect(addr1).vote(1)).to.be.revertedWith("You Have already voted")
    })

    it("Should not allow voting after voting period ends", async function () {
        await network.provider.send("evm_increaseTime", [600])

        expect(voting.connect(addr1).vote(0)).to.be.revertedWith("Voting Has Ended Already")
    })

    it("should allow voter to delegate their vote", async function () {
        await voting.connect(addr1).delegate(addr2.address)

        const delegateAddress = await voting.delegateTo(addr1.address)
        expect(delegateAddress).to.equal(addr2.address)
    })

    it("should allow delegatee to vote after delegation", async function () {
        await voting.connect(addr1).delegate(addr2.address)

        await voting.connect(addr2).vote(0)

        const candidate = await voting.getAllVotes()
        expect(candidate[0].voteCount).to.equal(1)
    })

    it("should not allow delegator to vote after delegation", async function () {
        await voting.connect(addr1).delegate(addr2.address)

        expect(voting.connect(addr1).vote(0)).to.be.revertedWith(
            "You have already voted or delegated",
        )
    })
})

//"should allow delegatee to vote after delegation"
//"should not allow delegator to vote after delegation"

import assert from "assert";
import { Web3 } from "web3";
import ganache from "ganache";
import Campaign from "../ethereum/build/Campaign.json" assert { type: "json" };
import CampaignFactory from "../ethereum/build/CampaignFactory.json" assert { type: "json" };

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  const { abi, evm } = CampaignFactory;
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: 10000000 });

  await factory.methods
    .createCampaign(100)
    .send({ from: accounts[0], gas: 1000000 });
  [campaignAddress] = await factory.methods.getCampaigns().call();
  const { abi: campaignABI } = Campaign;
  campaign = new web3.eth.Contract(campaignABI, campaignAddress);
});

describe("Campaigns", () => {
  it("can deploy", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("registers caller as manager", async () => {
    const manager = await campaign.methods.campaignCreator().call();
    assert.equal(manager, accounts[0]);
  });

  it("registers contributors", async () => {
    await campaign.methods.contribute().send({ value: 200, from: accounts[1] });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
  it("requires minimum amount to enter", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[2], value: 99 });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("manager can create request", async () => {
    await campaign.methods.createRequest("buy fuel", 100, accounts[3]).send({
      gas: 1000000,
      from: accounts[0],
    });
    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, "buy fuel");
  });
  it("works", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: web3.utils.toWei(5, "ether") });
    await campaign.methods
      .contribute()
      .send({ from: accounts[2], value: web3.utils.toWei(8, "ether") });
    await campaign.methods
      .contribute()
      .send({ from: accounts[3], value: web3.utils.toWei(1.5, "ether") });

    await campaign.methods
      .createRequest(
        "buy raw materials",
        web3.utils.toWei(7, "ether"),
        accounts[4]
      )
      .send({ from: accounts[0], gas: 1000000 });

    await campaign.methods.vote(0).send({
      from: accounts[1],
      gas: 1000000,
    });
    await campaign.methods.vote(0).send({
      from: accounts[3],
      gas: 1000000,
    });
    await campaign.methods
      .finaliseRequest(0)
      .send({ from: accounts[0], gas: 1000000 });

    let balance = await web3.eth.getBalance(accounts[4]);
    balance = web3.utils.fromWei(balance, "ether");
    console.log(typeof balance);
    balance = parseFloat(balance);

    assert(balance > 105);
  });
});

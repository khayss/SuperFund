import "dotenv/config";
import compiledCampaignFactory from "../build/CampaignFactory.json" assert { type: "json" };
import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3 } from "web3";

const provider = new HDWalletProvider(
  process.env.SEED,
  process.env.INFURA_SEPOLIA_LINK
);

const web3 = new Web3(provider);

const deploy = async () => {
  const { abi, evm } = compiledCampaignFactory;
  const accounts = await web3.eth.getAccounts();
  console.log("contracts will be deployed using " + accounts[0]);
  const campaignFactory = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: 10000000 });

  console.log("contract deployed at " + campaignFactory.options.address);
  provider.engine.stop();
};

deploy();

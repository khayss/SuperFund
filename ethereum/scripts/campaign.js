import "dotenv/config";
import web3 from "./web3.js";
import Campaign from "../build/Campaign.json" assert { type: "json" };

export const campaignInstance = (address) =>
  new web3.eth.Contract(Campaign.abi, address);

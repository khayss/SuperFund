import "dotenv/config";
import web3 from "./web3.js";
import CampaignFactory from "../build/CampaignFactory.json" assert { type: "json" };

export const factory = new web3.eth.Contract(
  CampaignFactory.abi,
"0x770CB8f1616D3b6BE95E84F8a003cfB83F5c4631");

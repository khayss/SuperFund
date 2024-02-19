import solc from "solc";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const campaignPath = path.resolve(__dirname, "ethereum/contracts/Campaign.sol");
const buildPath = path.resolve(__dirname, "ethereum/build");

fs.removeSync(buildPath);

const source = fs.readFileSync(campaignPath, "utf8");
const input = {
  language: "Solidity",
  sources: {
    ["Campaign.sol"]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];

console.log(output);
fs.ensureDirSync(buildPath);

for (const contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + ".json"),
    output[contract]
  );
}

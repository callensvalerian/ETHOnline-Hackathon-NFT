The project consists in:

- two smart contracts : Migration.sol and Membership.sol
- a front end: index.html, main.js, membership.abi,
- truffle suite:
  - a folder migrations
  - a folder src with subfolders abis and contracts
  - a folder test
  - a config file

The front end interacts with 4 databases on the backend handled by Moralis. Each of them is filled based on events emitted by the smart contract:

- itemModifications
- membersAdded
- membersRevoked
- organizations

Moralis Cloud function used are:

Moralis.Cloud.define("get_managed_organizations", async function(request) {
const query = new Parse.Query("organizations");
query.equalTo("by",request.user.attributes.ethAddress);
query.ascending("createdAt");
const result = await query.find();
return result;
});

Moralis.Cloud.define("get_organization_modifications_for_id", async function(request) {
const query = new Parse.Query("itemModifications");
query.equalTo("orgaId",request.params.orgaId);
query.ascending("createdAt");
const result = await query.find();
return result;
});

Moralis.Cloud.define("get_added_members_for_id", async function(request) {
const query = new Parse.Query("membersAdded");
query.equalTo("orgaId",request.params.orgaId);
query.ascending("createdAt");
const result = await query.find();
return result;
});

Moralis.Cloud.define("get_revoked_members_for_id", async function(request) {
const query = new Parse.Query("membersRevoked");
query.equalTo("orgaId",request.params.orgaId);
query.ascending("createdAt");
const result = await query.find();
return result;
});

To start the project:

- install truffle using npm install -g truffle
- install openzeppelin contracts using npm install @openzeppelin/contracts
- install chai: npm install chai
- install chai-as-promised: npm install chai-as-promised
- migrate contracts: truffle migrate --reset
- test contracts: truffle test

To test the front end:

- Deploy the contract membership.sol, on ganache for example
- Get the abi and the deployed contract address, add it to frontend/membership_abi.js
- if run locally, you will need a local HTTP server. As described here:
  https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server
  go with console inside the folder "frontend"
  run python -m SimpleHTTPServer
  then, run in your web-browser http://localhost:8000/

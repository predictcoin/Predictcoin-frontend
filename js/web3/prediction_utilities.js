// This file contains code for creating instances 
// of contracts and ineractinf with them

function Util(signer, provider){
  this.signer = signer;
  this.provider = provider;
  this.token = "BTC"
  this.prediction = null;
  this.currentRound = null;
  this.intervalSeconds = null;
  this.bufferSeconds = null;
  this.betSeconds = null;
  this.betAmount = null;
  this.balance = null;
  this.tokenMaxBet = null;
}

Util.prototype.initialize = async function() {
  this.prediction = new Prediction();
  await this.prediction.initialize(config.addresses.Prediction, config.abis.Prediction, this.signer);
  const currentRound = await this.prediction.getCurrentRound();
  this.currentRound = await this.prediction.getRound(currentRound);
  this.lockedTimestamp = this.currentRound.lockedTimestamp;
  this.closeTimestamp = this.currentRound.closeTimestamp;
  this.intervalSeconds = await this.prediction.intervalSeconds();
  this.bufferSeconds = await this.prediction.bufferSeconds();
  this.betSeconds = await this.prediction.betSeconds();
  this.betAmount = await ethers.utils.formatUnits(await this.prediction.betAmount());
  this.tokenMaxBet = await this.prediction.tokenMaxBet()
}

Util.prototype.setToken = function(token) {
  this.token = token;
}

Util.prototype.predictBear = async function() {
  console.log(this)
  await this.prediction.predictBear(config.predictionTokens[this.token], this.currentRound.epoch);
}

Util.prototype.predictBull = async function() {
  await this.prediction.predictBull(config.predictionTokens[this.token], this.currentRound.epoch);
}

async function initContracts(signer, provider){
  util = new Util(signer, provider);
  await util.initialize();
}

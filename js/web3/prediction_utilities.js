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
  this.pred = null;
}

Util.prototype.initialize = async function() {
  this.prediction = new Prediction();
  this.pred = await new ERC20( );
  await this.pred.initialize(config.addresses.PRED, config.abis.ERC20, this.signer);
  await this.prediction.initialize(config.addresses.Prediction, config.abis.Prediction, this.signer);
  const currentRound = await this.prediction.getCurrentRound();
  this.currentRound = await this.prediction.getRound(currentRound);
  this.lockedTimestamp = this.currentRound.lockedTimestamp;
  this.closeTimestamp = this.currentRound.closeTimestamp;
  this.intervalSeconds = await this.prediction.intervalSeconds();
  this.bufferSeconds = await this.prediction.bufferSeconds();
  this.betSeconds = await this.prediction.betSeconds();
  this.betAmount = await ethers.utils.formatUnits(await this.prediction.betAmount());
  this.tokenMaxBet = await this.prediction.tokenMaxBet();
}

Util.prototype.setToken = function(token) {
  this.token = token;
}

Util.prototype.predictBear = async function() {
  return await this.prediction.predictBear(config.predictionTokens[this.token], this.currentRound.epoch);
}

Util.prototype.predictBull = async function() {
  return await this.prediction.predictBull(config.predictionTokens[this.token], this.currentRound.epoch);
}

Util.prototype.getBalance = async function(token){
  return token.balanceOf(await this.signer.getAddress());
}

Util.prototype.allowance = async function(token){
  return token.allowance(await this.signer.getAddress(), config.addresses.Prediction);
}

Util.prototype.approve = async function(token){
  return token.approve(config.addresses.Prediction);
}

Util.prototype.getUserRounds = async function(){
  return this.prediction.getUserRound(await this.signer.getAddress());
}

Util.prototype.getRound = async function(round){
  return this.prediction.getRound(round);
}

Util.prototype.claim = async function(rounds){
  return this.prediction.claim(rounds);
}

Util.prototype.refundable = async function(round){
  return this.prediction.refundable(round, await this.signer.getAddress());
}

Util.prototype.getStats = async function(round){
  return this.prediction.getStats(round);
}

async function initContracts(signer, provider){
  util = new Util(signer, provider);
  await util.initialize();
}

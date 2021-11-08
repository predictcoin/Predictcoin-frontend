function Prediction(){
  this.instance = null;
}

Prediction.prototype.initialize = async function (address, abi, signer) {
  this.instance = await new ethers.Contract(address, abi, signer);
}

Prediction.prototype.getCurrentRound = async function (){
  return await this.instance.currentEpoch();
}

Prediction.prototype.getRound = async function (round) {
  return await this.instance.getRound(round);
}

Prediction.prototype.intervalSeconds = async function () {
  return await this.instance.intervalSeconds();
}

Prediction.prototype.bufferSeconds = async function () {
  return await this.instance.bufferSeconds();
}

Prediction.prototype.betSeconds = async function () {
  return await this.instance.betSeconds();
}

Prediction.prototype.betAmount = async function () {
  return await this.instance.betAmount();
}

Prediction.prototype.predictBull = async function(address, epoch){
  return await this.instance.predictBull( epoch, address);
}

Prediction.prototype.predictBear = async function(address, epoch){
  return await this.instance.predictBear(epoch, address);
}

Prediction.prototype.tokenMaxBet = async function(){
  return await this.instance.tokenMaxBet();
}

Prediction.prototype.claim = async function(rounds){
  return await this.instance.claim(rounds);
}

Prediction.prototype.refundable = async function(round, address){
  return await this.instance.refundable(round, address);
}

Prediction.prototype.getStats = async function(round){
  return await this.instance.getStats(round);
}

Prediction.prototype.getUserRound = async function (address){
  const length = await this.instance.getUserRoundsLength(address);
  return await this.instance.getUserRounds(address, 0, length)
}
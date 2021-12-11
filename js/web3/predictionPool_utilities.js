// This file contains code for creating instances 
// of contracts and ineractinf with them

function PredictionUtil(signer, provider){
  this.signer = signer;
  this.provider = provider;
  this.farm = null;
  this.pools = {};
  this.pred = null;
  this.maxPred = 0;
  this.min = 0.000001;
}

PredictionUtil.prototype.initialize = async function(Contract, name) {
  this.farm = new Contract();

  await this.farm.initialize(config.addresses[name], config.abis[name], this.signer);

  const poolIndex = this.farm.poolLength.toNumber() - 1;
  this.pools[poolIndex] = await this.farm.poolInfo(poolIndex);
  this.pools.live = this.pools[poolIndex];
  this.maxPred = await this.farm.instance.maxPredDeposit();

  this.pred = new ERC20();
  await this.pred.initialize(config.addresses.PRED, config.abis.ERC20, this.signer);
}

PredictionUtil.prototype.withdraw = async function(id, amount) {
  return await this.farm.withdraw(id, amount);
}

PredictionUtil.prototype.deposit = async function(id, amount) {
  return await this.farm.deposit(id, amount);
}

PredictionUtil.prototype.getStakeApr = async function(id, pred_bnbPrice) {
  let totalPredPerYr;
  if(typeof this.farm.predPerBlock !== "undefined"){
    totalPredPerYr = this.farm.predPerBlock.mul(28800).mul(365);
  }else{
    totalBIDPerYr = this.farm.bidPerBlock.mul(28800).mul(365);
    totalPredPerYr = totalBIDPerYr.div(pred_bnbPrice);
  } 
  const poolPredPerYr = this.pools[id].allocPoint.mul(totalPredPerYr);
  const numerator = poolPredPerYr.mul(100);

  const stakedPred = this.pools[id].amount;
  let denominator = stakedPred.mul(this.farm.allocPoint);
  if (denominator.eq(0)) return 0;
  return numerator.div(denominator);
}

// PredictionUtil.prototype.getStakeApr = async function(id) {
//   let totalPredPerYr;
//   if(typeof this.farm.predPerBlock !== "undefined"){
//     totalPredPerYr = this.farm.predPerBlock.mul(28800).mul(365);
//   }else{
//     totalPredPerYr = this.farm.bnbPerBlock.mul(28800).mul(365);
//   }
  
//   const poolPredPerYr = this.pools[id].allocPoint.mul(totalPredPerYr);
//   const numerator = poolPredPerYr.mul(100);

//   const stakedPred = await this.pred.balanceOf(this.farm.instance.address);
//   let denominator = stakedPred.mul(this.farm.allocPoint);
//   if (denominator.eq(0)) return 0;
//   return numerator.div(denominator);
// }

PredictionUtil.prototype.pendingPred = async function(id) {
  const pending = await this.farm.pendingPred(id, await this.signer.getAddress())
  return pending;
}

PredictionUtil.prototype.pendingBID = async function(id) {
  const pending = await this.farm.pendingBID(id, await this.signer.getAddress())
  return pending;
}

PredictionUtil.prototype.pendingBNB = async function(id) {
  const pending = await this.farm.pendingBNB(id, await this.signer.getAddress())
  return pending;
}

PredictionUtil.prototype.userInfo = async function(id) {
  return this.farm.userInfo(id, await this.signer.getAddress());
}

PredictionUtil.prototype.totalStaked = async function(pId) {
  return (await this.farm.poolInfo(pId)).amount;
}

PredictionUtil.prototype.getPoolInfo = async function(pId){
  return await this.farm.poolInfo(pId);
}

PredictionUtil.prototype.userStake = async function(id) {
  const user = await this.userInfo(id);
  return user.amount;
}

PredictionUtil.prototype.getBalance = async function(id) {
  const balance = await this.pred.balanceOf(await this.signer.getAddress());
  return balance;
}

PredictionUtil.prototype.wonRound = async function(id) {
  return await this.farm.wonRound(await this.signer.getAddress(), id);
}

PredictionUtil.prototype.lostRound = async function(id) {
  return await this.farm.lostRound(await this.signer.getAddress(), id);
}

PredictionUtil.prototype.approve = async function(id){
  return await this.pred.approve(this.farm.instance.address);
}

PredictionUtil.prototype.allowance = async function(id){
  return await this.pred.allowance(await this.signer.getAddress(), 
    this.farm.instance.address);
}

// PredictionUtil.prototype.stake = async function(id, amount){
//   if(amount > await util.allowance(id)){
//     $.growl.error({message: "Amount exceeds allowance"});
//     return;
//   }

//   return await this.farm.deposit(id, String(amount));
// }

PredictionUtil.prototype.getAmountsOut = async function (amountIn, PRED, BUSD){
  return await this.PancakeRouter.getAmountsOut(amountIn, [PRED, BUSD])
}

PredictionUtil.prototype.totalSupply = async function(token){
  return await token.totalSupply();
}

PredictionUtil.prototype.getReserves = async function (token){
  return await token.getReserves();
}

// PredictionUtil.prototype.token0 = async function(token){
//   return await token.token0()
// }

// PredictionUtil.prototype.removeLiquidity = async function (
//   tokenA,
//   tokenB,
//   liquidity,
//   amountAMin,
//   amountBMin,
//   to,
//   deadline
// ){
//   return await this.PancakeRouter.removeLiquidity(  tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline);
// }

async function initPredictionPool(signer, provider, Contract, name){
  const util = await new PredictionUtil(signer, provider);
  await util.initialize(Contract, name);
  return util;
}
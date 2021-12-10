// This file contains code for creating instances 
// of contracts and ineractinf with them

function Util(signer, provider){
  this.signer = signer;
  this.provider = provider;
  this.farm = null;
  this.pools;
  this.min = 0.000001;
  this.PancakeRouter = null;
}

Util.prototype.initialize = async function() {
  this.farm = new Farm();
  await this.farm.initialize(config.addresses.Farm, config.abis.Farm, this.signer);
  this.PancakeRouter = new PancakeRouter();
  this.AutoSharkRouter = new PancakeRouter();
  await this.PancakeRouter.initialize(config.addresses.PancakeRouter, config.abis.PancakeRouter, this.signer);
  await this.AutoSharkRouter.initialize(config.addresses.AutoSharkRouter, config.abis.PancakeRouter, this.signer);
  this.pools = [];
  this.pools[0] = await this.farm.poolInfo(0);
}

Util.prototype.withdraw = async function(id, amount) {
  return await this.farm.withdraw(id, amount);
}

Util.prototype.deposit = async function(id, amount) {
  return await this.farm.deposit(id, amount);
}

Util.prototype.compound = async function(id, amount) {
  return await this.farm.compound();
}

Util.prototype.token0 = async function(token) {
  return await token.token0();
}

Util.prototype.getStakeApr = async function(id) {
  const token = await util.getPoolToken(id);
  const totalPredPerYr = this.farm.predPerBlock.mul(28800).mul(365);
  const poolPredPerYr = this.pools[id].allocPoint.mul(totalPredPerYr);
  const numerator = poolPredPerYr.mul(100);
  const stakedPred = await token.balanceOf(config.addresses.Farm);
  let denominator = stakedPred.mul(this.farm.totalAllocPoint);
  if (denominator.eq(0)) return 0;
  return numerator.div(denominator);
}

Util.prototype.pendingPred = async function(id) {
  const pending = await this.farm.pendingPred(id, await this.signer.getAddress())
  return pending;
}

Util.prototype.userInfo = async function(id) {
  return this.farm.userInfo(id, await this.signer.getAddress());
}

Util.prototype.getPoolToken = async function(id) {
  if (!(this.pools && this.pools[id])){
    this.pools[id] = await this.farm.poolInfo(id);
  }
  
  const token = new ERC20();
  await token.initialize(this.pools[id].lpToken, config.abis.ERC20, this.signer);
  return token
}

Util.prototype.totalStaked = async function(token) {
  return await token.balanceOf(config.addresses.Farm)
}

Util.prototype.userStake = async function(id) {
  const user = await this.userInfo(id);
  return user.amount;
}

Util.prototype.getBalance = async function(id) {
  const token = await this.getPoolToken(id);
  const balance = await token.balanceOf(await this.signer.getAddress());
  return balance;
}

Util.prototype.approve = async function(id){
  const token = await this.getPoolToken(id);
  return await token.approve(config.addresses.Farm);
}

Util.prototype.allowance = async function(id){
  const token = await this.getPoolToken(id);
  return await token.allowance(await this.signer.getAddress(), 
    util.farm.instance.address);
}

// Util.prototype.stake = async function(id, amount){
//   if(amount > await util.allowance(id)){
//     $.growl.error({message: "Amount exceeds allowance"});
//     return;
//   }

//   return await this.farm.deposit(id, String(amount));
// }

Util.prototype.getAmountsOut = async function (amountIn, PRED, BUSD){
  return await this.PancakeRouter.getAmountsOut(amountIn, [PRED, BUSD])
}

Util.prototype.getAmountsOutAutoShark = async function (amountIn, ...tokens){
  return await this.AutoSharkRouter.getAmountsOut(amountIn, tokens)
}

Util.prototype.totalSupply = async function(token){
  return await token.totalSupply();
}

Util.prototype.getReserves = async function (token){
  return await token.getReserves();
}

// Util.prototype.token0 = async function(token){
//   return await token.token0()
// }

// Util.prototype.removeLiquidity = async function (
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

async function initContracts(signer, provider){
  util = new Util(signer, provider);
  await util.initialize();
}
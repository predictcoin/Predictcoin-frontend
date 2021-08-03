function PancakeRouter(){
  this.instance = null;
}

PancakeRouter.prototype.initialize = async function (address, abi, signer) {
  this.instance = await new ethers.Contract(address, abi, signer);
}

PancakeRouter.prototype.getAmountsOut = async function (amountOut, addresses){
  return await this.instance.getAmountsOut(amountOut, addresses);
}

PancakeRouter.prototype.getReserves = async function (factor, tokenA, tokenB){
  return await this.instance.getReserves(factor, tokenA, tokenB);
}

// PancakeRouter.prototype.removeLiquidity = async function (
//   tokenA,
//   tokenB,
//   liquidity,
//   amountAMin,
//   amountBMin,
//   to,
//   deadline
// ){
//   return await this.instance.callStatic.removeLiquidity(  tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline);
// }
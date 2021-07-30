function PancakeRouter(){
  this.instance = null;
}

PancakeRouter.prototype.initialize = async function (address, abi, signer) {
  this.instance = await new ethers.Contract(address, abi, signer);
}

PancakeRouter.prototype.getAmountsOut = async function (amountOut, addresses){
  return await this.instance.getAmountsOut(amountOut, addresses);
}
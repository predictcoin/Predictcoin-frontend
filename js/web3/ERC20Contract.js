function ERC20(){
  this.instance = null;
  this.decimals;
}

ERC20.prototype.initialize = async function (address, abi, signer) {  
  this.instance = await new ethers.Contract(address, abi, signer);
  this.decimals = await this.instance.decimals();
}

ERC20.prototype.balanceOf = async function (address) {
  return this.instance.balanceOf(address);
}

ERC20.prototype.approve = async function (spender){
  return this.instance.approve(spender, ethers.constants.MaxUint256)
}

ERC20.prototype.allowance = async function (owner, spender){
  return this.instance.allowance(owner, spender);
}
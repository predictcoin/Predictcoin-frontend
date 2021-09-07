function Farm(){
  this.instance = null;
  this.predPerBlock;
  this.totalAllocPoint;
}

Farm.prototype.initialize = async function (address, abi, signer) {
  this.instance = await new ethers.Contract(address, abi, signer);
  const multiplier = await this.instance.BONUS_MULTIPLIER();
  const predPerBlock = await this.instance.predPerBlock();
  this.predPerBlock = multiplier.mul(predPerBlock);
  this.totalAllocPoint = await this.instance.totalAllocPoint();
}

Farm.prototype.pendingPred = function (pId, address) {
  return this.instance.pendingPred(pId, address);
}

Farm.prototype.withdraw = function (pId, amount) {
  return this.instance.withdraw(pId, amount);
}

Farm.prototype.deposit = function (pId, amount) {
  return this.instance.deposit(pId, amount);
}

Farm.prototype.userInfo = async function (pId, address) {
  return await this.instance.userInfo(pId, address);
}

Farm.prototype.poolInfo = async function (index) {
  return await this.instance.poolInfo(index)
}

Farm.prototype.compound = async function (){
  return await this.instance.compound();
}
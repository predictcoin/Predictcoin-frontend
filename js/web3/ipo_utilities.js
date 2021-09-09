function Util(signer, provider){
  this.signer = signer;
  this.provider = provider;
  this.ipo = null;
}

Util.prototype.initialize = async function (){
  this.ipo = new IPO();
  await this.ipo.initialize(config.addresses.IPO1, config.abis.IPO, this.signer);
}

Util.prototype.cap = function (){
  return this.ipo.cap;
}

Util.prototype.rate = function (){
  return this.ipo.rate;
}

Util.prototype.weiRaised = function (){
  return this.ipo.weiRaised;
}

Util.prototype.balanceOf = async function(){
  return await this.ipo.balanceOf(await this.signer.getAddress());
}

Util.prototype.individualCap = function(){
  return this.ipo.individualCap;
}

Util.prototype.individualFloor = function(){
  return this.ipo.individualFloor;
}

Util.prototype.buy = async function(amt){
  return await this.ipo.buy(await this.signer.getAddress(), amt);
}

Util.prototype.claim = async function(){
  return await this.ipo.withdrawTokens(await this.signer.getAddress());
}

Util.prototype.closingTime = function(){
  return this.ipo.closingTime;
}

Util.prototype.openingTime = function(){
  return this.ipo.openingTime;
}

async function initContracts(signer, provider){
  util = new Util(signer, provider);
  await util.initialize();
}

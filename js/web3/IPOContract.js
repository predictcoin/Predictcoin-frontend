function IPO(){
  this.instance = null;
  this.cap = null;
  this.rate = null;
  this.individualCap = null;
  this.individualFloor = null;
}

IPO.prototype.initialize = async function (address, abi, signer) {
  this.instance = await new ethers.Contract(address, abi, signer); 
  this.rate = await this.instance.rate();
  this.cap = await this.instance.cap();
  this.weiRaised = await this.instance.weiRaised();
  this.individualCap = await this.instance.individualCap();
  this.individualFloor = await this.instance.individualFloor();
  this.closingTime = await this.instance.closingTime();
  this.openingTime = await this.instance.openingTime();
}

IPO.prototype.buy = async function(beneficiary, amt){
  return await this.instance.buyTokens(beneficiary, { value: amt } );
}

IPO.prototype.balanceOf = async function (address) {
  return await this.instance.balanceOf(address);
}

IPO.prototype.withdrawTokens = async function (beneficiary) {
  return await this.instance.withdrawTokens(beneficiary);
}



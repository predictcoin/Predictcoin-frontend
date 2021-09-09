// You'll find Web3 functions here.
async function populateUI() {
  await startCountDown()
  await renderSwapRate();
  await renderCap();
  await renderProgress();
  await renderBalance();
  await renderClaim();
  await checkSoldOut();

  setInterval(startCountDown, 60000);
  document.querySelector("body").classList.remove("loading");
  document.querySelector("body").classList.add("loaded")
}

// populates UI when wallet not connected. Ignore func name.
async function fillTotal_APR() {
  await startCountDown()
  await renderSwapRate();
  await renderCap();
  await renderProgress();

  setInterval(startCountDown, 60000);
  document.querySelector("body").classList.remove("loading");
  document.querySelector("body").classList.add("loaded");
}

async function renderSwapRate() {
  const rate = util.rate();
  const rateEles = document.querySelectorAll(".rate");
  rateEles.forEach( ele => ele.textContent = `${1/rate.toString()} BNB/ 1 PRED` ) ;
}

function renderCap(){
  const cap = ethers.utils.formatUnits(util.cap());
  const capEles = document.querySelectorAll(".cap");
  capEles.forEach(ele => ele.textContent = `${util.rate().toString()*cap} PRED`)
}

function renderProgress(){
  const cap =  ethers.utils.formatUnits(util.cap());
  const predRaised = ethers.utils.formatUnits(util.weiRaised()) * util.rate().toString();
  const percentage = (( predRaised/(util.rate().toString() * cap) ) * 100).toFixed(2);
  document.querySelectorAll(".percentage").forEach(ele => ele.textContent = `${formatNumber(percentage, "per")}%`);
  document.querySelectorAll(".progress_fill").forEach(ele => ele.style.width = `${percentage}%`);
  document.querySelectorAll(".ratio").forEach(ele => ele.textContent = `${formatNumber(predRaised)}/${util.rate().toString()*cap}`);
}

async function renderBalance(){
  const cap =  ethers.utils.formatUnits(util.individualCap());
  const bal = ethers.utils.formatUnits(await util.balanceOf());
  const availEle = document.querySelector(".available_bal");
  availEle.textContent = `Available Balance: ${formatNumber(bal)} of ${util.rate().toString()*cap} PRED`;
}

async function renderClaim(){
  const claimBtn = document.querySelector(".claim_button");
  const bal = ethers.utils.formatUnits(await util.balanceOf());
  claimBtn.textContent = `CLAIM ${formatNumber(bal)} PRED`;
}

async function checkSoldOut(){
  const weiRaised = util.weiRaised();
  const cap = util.cap()
  if(weiRaised.eq(cap)){
    document.querySelector(".live .web3-card").classList.add("sold-out");
  }
}

async function checkInput(e){
  const input = e.target.value;
  const eq = e.target.value * util.rate().toString();
  const eqEl = document.querySelector(".eq");
  eqEl.textContent = `~ ${!isNaN(eq.toFixed(4)) ? eq.toFixed(4) : 0} PRED`;

  const check = validate(
    { duration: e.target.value },
    { duration: { numericality: true } }
  );

  if (check) {
    const len = e.target.value.length;
    e.target.value = e.target.value.slice(0, len - 1);
    if (
      validate(
        { duration: e.target.value },
        { duration: { numericality: true } }
      )
    )
      e.target.value = "";
  }

  const err = await checkErr(e.target.value);
  document.querySelector(".input_error").textContent = err;

  if (err !== ""){
    document.querySelector(".buy_button").classList.add("disable");
  }else{
    document.querySelector(".buy_button").classList.remove("disable");
  }
}

async function checkErr(value){
  let bal = ethers.utils.formatUnits(await util.signer.getBalance());
  if (bal-value < 0) return "You don't have enough BNB"
  bal = ethers.utils.formatUnits(await util.balanceOf());
  cap = ethers.utils.formatUnits(util.individualCap());
  if ( value < ethers.utils.formatUnits(await util.individualFloor())) return "BNB value is less than individual min contribution";
  if (cap - bal/util.rate().toString() - value < 0) return "BNB value exceeds individual max contribution";
  return ""
}

function startCountDown(){
  //determines state of the IPO
  let [ duration, status ] = getDuration();

  if (status !== ""){
    document.querySelector(".live .web3-card").classList.add(status);
    document.querySelector(".past .web3-card").classList.add("ended");
  }
  else{
    document.querySelector(".live .web3-card").classList.add("ended");
    return;
  }

  // let active = document.querySelectorAll(".live .web3-card:not(.ended)");
  // if (active.length === 0) document.querySelector(".live").innerHTML
  
  const [dayInSec, hourInSec, minInSec] = [60 * 60 * 24, 60 * 60, 60]
  let days = parseInt(duration/dayInSec);
  let remTime = duration - days * dayInSec;
  let hours = parseInt(remTime/hourInSec);
  remTime = remTime - hours * hourInSec;
  let mins = parseInt(remTime/minInSec);
  let secs = remTime - mins * minInSec;

  days = zeroPad(days);
  hours = zeroPad(hours);
  mins = zeroPad(mins);
  secs = zeroPad(secs);
  document.querySelectorAll(".timer .time").forEach(time => time.textContent = `${days}d - ${hours}hr - ${mins}mins`);
}

function zeroPad(num) {
  var zero = 2 - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function getDuration(){
  const now = parseInt(Date.now()/1000);
  const opening = util.openingTime();
  const closing = 	util.closingTime();
  let status = "";
  
  if( now < opening ){
    duration = opening - now;
    status = "not-started";
  }
  else if( now < closing){
    duration = closing - now;
    status = "started";
  }
  else {
    duration = 0;
  }

  return [duration, status];
}

async function buy(e){
  if (e.target.classList.contains("disable")) return;
  let amt = document.querySelector(".input input").value;
  if (amt === "") return;
  const tx = async () => await util.buy(ethers.utils.parseUnits(amt));
  console.log(amt, util.rate().toString())
  await sendTx(tx, `Successfully bought ${amt*util.rate().toString()} PRED`, `Failed to buy PRED`);
}

async function claim(e){
  const tx = async () => await util.claim();
  await sendTx(tx, "Successfully claimed PRED", "Failed to claim PRED");
}
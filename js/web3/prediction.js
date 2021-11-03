function populateUI(){
  setProgress();
  setupTokens();
  renderTokenInfo();
  renderBetInfo();

  document.querySelector("body").classList.remove("loading");

  // if(util.closeTimestamp.toNumber() <= (Date.now()/1000)){
  //   document.querySelector("#prediction-section .predict").classList.add("ended");
  // }
}

function fillTotal_APR(){
  setProgress();
  setupTokens();
  renderTokenInfo();

  document.querySelector("body").classList.remove("loading");
  
  // if(util.closeTimestamp.toNumber() <= (Date.now()/1000)){
  //   document.querySelector("#prediction-section .predict").classList.add(".ended");
  // }
}

function renderTokenInfo(){
  const price = document.querySelector(".locked-position .price");
  price.textContent = '$'+(util[util.token].lockedPrice.toNumber()/100000000).toFixed(2);
  document.querySelector(".locked-position .date-time").textContent 
    = (new Date(util.lockedTimestamp.toNumber()* 1000)).toUTCString();
}

async function renderBetInfo(){
  const container = document.querySelector(".predict-box .pred-needed");
  const bet = document.querySelector(".predict-box .pred-balance");
  container.textContent = util.betAmount + " PRED";
  const balance = ethers.utils.formatUnits(await util.getBalance(util.pred));
  util.balance = balance;
  bet.textContent = (+balance).toFixed(4) + " PRED Available";
  if((await util.allowance(util.pred)).gt(ethers.utils.parseUnits(util.betAmount))){
    document.querySelector("body").classList.add("enabled");
  };
}

function enablePrediction(){
  enableContract(util.pred);
}

async function enableContract(token){
  const tx = async () => await util.approve(token);
  sendTx(tx, `Successfully approved prediction contract`, "Failed to approve prediction contract");
}

function setupTokens(){
  for([k, v] of Object.entries(config.predictionTokens)){
    const index = util.currentRound._tokens.indexOf(v);
    util[k] = {
      address: v,
      bets: util.currentRound.bets[index],
      lockedPrice: util.currentRound.lockedPrices[index],
      closePrice: util.currentRound.closePrices[index]
    }
  }
}

function setProgress(){
  const currentTime = Date.now()/1000;
  const lockedTimestamp = util.lockedTimestamp.toNumber();
  const interval = util.intervalSeconds.toNumber();
  const pastTime = currentTime - lockedTimestamp;
  const betSeconds = util.betSeconds.toNumber();
  let width;
  const timer = document.querySelector(".prediction-progress .timer")

  if( pastTime < betSeconds){
    width = (pastTime/betSeconds) * 100;
    const [days, hours, mins, secs] = getCountDown((betSeconds-pastTime).toFixed());
    timer.textContent = `Prediction for this round ends in ${days}d : ${hours}hr : ${mins}m : ${secs}s`;
  }
  else{
    document.querySelector("#prediction-section").classList.add("prediction-ended");
    width = (pastTime/interval) * 100;
    const [days, hours, mins, secs] = getCountDown((interval-pastTime).toFixed());
    timer.textContent = `Round ends in ${days}d : ${hours}hr : ${mins}m : ${secs}s`;
  }
  
  document.querySelector(".progress-bar").style.width = width + "%";
}


function getCountDown(duration){
  
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
  return [days, hours, mins, secs];
}

function zeroPad(num) {
  var zero = 2 - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function predict (){
  const errorCont = document.querySelector(".predict .error");
  if(util.balance < util.betAmount){
    errorCont.textContent = "Not enough PRED to predict";
    return;
  }
  if(util[util.token].bets.toNumber() >= util.tokenMaxBet){
    errorCont.textContent = "Max number of predictions reached for this token";
    return;
  }
  
  errorCont.textContent = "";

  if (this.classList.contains("up")){
    const tx = async () => await util.predictBull();
    sendTx(tx, `Predicted ${util.token} price would go up`, "Failed to predict")
  } else {
    const tx = async () => await util.predictBear();
    sendTx(tx, `Predicted ${util.token} price would go down`, "Failed to predict")
  }
}
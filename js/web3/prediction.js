async function populateUI(){
  await setProgress();
  setInterval(setProgress, 2000);
  setupTokens(util.currentRound, util);
  renderTokenInfo();
  renderBetInfo();
  const predictions = await getPredictions();
  setPredictionRows(predictions);
  setPredictionCards(predictions);
  
  if(predictions.length === 0){
    document.querySelector(".predictions").classList.add("no-predictions");
  } else{
    document.querySelector(".predictions").classList.remove("no-predictions");
  }

  document.querySelector("body").classList.remove("loading");

  if(util.closeTimestamp.toNumber() <= (Date.now()/1000)){
    document.querySelector("#prediction-section .predict").classList.add("ended");
  }
  let h = document.querySelector(".predict").offsetHeight;
  document.querySelector(".chart iframe").height = h;
}

function fillTotal_APR(){
  setProgress();
  setupTokens(util.currentRound, util);
  renderTokenInfo();

  document.querySelector("body").classList.remove("loading");
  
  if(util.closeTimestamp.toNumber() <= (Date.now()/1000)){
    document.querySelector("#prediction-section .predict").classList.add("ended");
  }

  let h = document.querySelector(".predict").offsetHeight;
  document.querySelector(".chart iframe").height = h;
}

function renderTokenInfo(){
  const price = document.querySelector(".locked-position .price");
  price.textContent = '$'+(util[util.token].lockedPrice.toNumber()/100000000).toFixed(2);
  document.querySelector(".locked-position .date-time").textContent 
    = ((new Date(util.lockedTimestamp.toNumber()* 1000)).toUTCString()).replace("GMT", "UTC");
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

async function setupTokens(round, ref){
  for([k, v] of Object.entries(config.predictionTokens)){
    const index = round._tokens.indexOf(v);
    //const [bulls, bears] = await getStatus(round, v);
    //console.log(bulls, bears);
    ref[k] = {
      address: v,
      bets: round.bets[index],
      lockedPrice: round.lockedPrices[index],
      closePrice: round.closePrices[index]
    }
  }
}

async function setProgress(){
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

async function predict (){
  const errorCont = document.querySelector(".predict .error");
  if(util.balance < util.betAmount){
    errorCont.textContent = "Not enough PRED to predict";
    return;
  }
  if(util[util.token].bets.toNumber() >= util.tokenMaxBet){
    errorCont.textContent = "Max number of predictions reached for this token";
    return;
  }

  predictions = await util.getUserRounds();
  stop = false;
  predictions[0].forEach(epoch => {
    if(epoch.eq(util.currentRound.epoch) ){
      stop = true;
      return;
    }
  })
  if (stop) {
    errorCont.textContent = "You can only predict once per round";
    return;
  };
  
  errorCont.textContent = "";

  if (this.classList.contains("up")){
    const tx = async () => await util.predictBull();
    sendTx(tx, `Predicted ${util.token} price would go up`, "Failed to predict")
  } else {
    const tx = async () => await util.predictBear();
    sendTx(tx, `Predicted ${util.token} price would go down`, "Failed to predict")
  }
}

async function getPredictions(){
  _predictions = await util.getUserRounds();
  predictions = {epochs: _predictions[0], betInfo: _predictions[1]}
  const bets = [];
  for(i = 0; i< predictions.epochs.length; i++){
    bets[i] = {};
    bets[i].round = predictions.epochs[i].toString();
    bets[i].token = config.predictionTokenAddresses[predictions.betInfo[i].token];
    bets[i].bet = predictions.betInfo[i].position.toString();
    const round = await util.getRound(bets[i].round);
    const tokens = {};
    await setupTokens(round, tokens);
    bets[i].lockedPrice = tokens[bets[i].token].lockedPrice.toNumber()/(10**8);
    bets[i].closePrice = tokens[bets[i].token].closePrice.toNumber()/(10**8);
    bets[i].closeTimestamp = round.closeTimestamp.toNumber();
    const {bulls, bears} = await getTokenStats(bets[i].round, bets[i].token);
    bets[i].bulls = parseInt(bulls/(+bulls+bears)*100);
    bets[i].bears = parseInt(bears/(+bears+bulls)*100);
  }
  return bets;
}

async function getTokenStats(epoch, token){
  const stats = await getStats(epoch);
  return stats[token];
}

async function getStats(epoch){
  const stats = {...config.predictionTokens};
  const _stats = await util.getStats(epoch);
  _stats._tokens.forEach((_token, index) => {
    const token = config.predictionTokenAddresses[_token];
    stats[token] = {};
    stats[token].bulls = _stats.bulls[index].toNumber();
    stats[token].bears = _stats.bears[index].toNumber();
  })
  return stats;
}

function setPredictionRows(predictions){
  ele = document.createElement("div");
  const oldRows = document.querySelectorAll("table.my-prediction-table tr");

  for (let i = 1; i < oldRows.length ; i++){
    oldRows[i].remove();
  }

  const rows = predictions.map(prediction => {
    return `
      <td>
        ${prediction.round}
      </td>
      <td>${prediction.token}</td>
      <td>$${prediction.lockedPrice.toFixed(2)}</td>
      <td>$${prediction.closePrice.toFixed(2)}</td>
      <td>${ prediction.bet === "0" ?
        '<img src="assets/front_n/images/icons/trending-green-up.svg" alt="up">' :
        '<img src="assets/front_n/images/icons/trending-red-down.svg" alt="down">'
        }
      </td>
      <td>
        <img src="assets/front_n/images/icons/trending-red-down.svg" alt="">
        ${prediction.bears}%
        <img src="assets/front_n/images/icons/trending-green-up.svg" alt="up">
        ${prediction.bulls}%
      </td>
      <td>
        ${prediction.closePrice !== 0 ?(
          ( prediction.closePrice > prediction.lockedPrice && prediction.bet === "0")
          || ( prediction.closePrice < prediction.lockedPrice && prediction.bet === "1") ?
          '<span class="status won">Won</span>' :
          '<span class="status lost">Lost</span>'
        ) :
          prediction.closeTimestamp + util.bufferSeconds.toNumber() > (Date.now()/1000) ?
          '<span class="status unsuccessful">Pending</span>' :
          '<span class="status unsuccessful">Unsuccessful</span>'
        }
      </td>
      <td>
      ${prediction.closePrice !== 0 ?(
        (prediction.closePrice > prediction.lockedPrice && prediction.bet === "0")
        || (prediction.closePrice < prediction.lockedPrice && prediction.bet === "1") ?
        '<a href="./staking.html" class="earn won">Earn PRED</a>' :
        '<a href="./staking.html" class="earn lost">Earn BNB</a>' 
      ) :
        '<span>-</span>'
      }
      </td>`
  })

  rows.reverse();
  rows.forEach(row => {
    tr = document.createElement("tr");
    tr.innerHTML = row;
    document.querySelector("table").appendChild(tr);
  });
}



function setPredictionCards(predictions){
  ele = document.createElement("div");
  const oldCards = document.querySelectorAll(".my-prediction-card");

  for (let i = 0; i < oldCards.length ; i++){
    oldCards[i].remove();
  }

  const cards = predictions.map(prediction => {
    return ` 
    <div><span>Round</span> <span>${prediction.round}</span></div>
    <div><span>COIN</span><span>${prediction.token}</span></div>
    <div><span>Locked Price</span><span>$${prediction.lockedPrice.toFixed(2)}</span></div>
    <div><span>Closing Price</span><span>$${prediction.closePrice.toFixed(2)}</span></div>
    <div><span>My prediction</span>${ prediction.bet === "0" ?
      '<img src="assets/front_n/images/icons/trending-green-up.svg" alt="up">' :
      '<img src="assets/front_n/images/icons/trending-red-down.svg" alt="down">'
    }</div>
    <div><span>Stats</span><span>
      <img src="assets/front_n/images/icons/trending-red-down.svg" alt="down"> 
        ${prediction.bears}%
      <img src="assets/front_n/images/icons/trending-green-up.svg" alt="up"> 
        ${prediction.bulls}%
      </span></div>
    <div>
      <span>
        Status
      </span>
      <span>
        ${prediction.closePrice !== 0 ?(
          ( prediction.closePrice > prediction.lockedPrice && prediction.bet === "0")
          || ( prediction.closePrice < prediction.lockedPrice && prediction.bet === "1") ?
          '<span class="status won">Won</span>' :
          '<span class="status lost">Lost</span>'
        ) :
          prediction.closeTimestamp + util.bufferSeconds.toNumber() > Date.now()/1000 ?
          '<span class="status unsuccessful">Pending</span>' :
          '<span class="status unsuccessful">Unsuccessful</span>'
        }
      </span>
    </div>
    <div>
      ${prediction.closePrice !== 0 ?(
        (prediction.closePrice > prediction.lockedPrice && prediction.bet === "0")
        || (prediction.closePrice < prediction.lockedPrice && prediction.bet === "1") ?
        '<a class="earn won" href="./staking.html">Earn PRED</a>' :
        '<a href="./staking.html" class="earn lost">Earn BNB</a>' 
      ) :
        ''
      }  
    </div>`
    })

  cards.reverse();
  cards.forEach(card => {
    div = document.createElement("div");
    div.classList.add("my-prediction-card");
    div.innerHTML = card;
    document.querySelector(".my-prediction-cards").appendChild(div);
  });
}

async function withdrawTokens() {
  rounds = [];
  predictions = await util.getUserRounds();

  for(i=0; i < predictions[0].length; i++){
    const _round = predictions[0][i];
    const refundable = await util.refundable(_round);
    if( refundable ){
      rounds.push(_round);
    }
  }

  if(rounds.length === 0){
    document.querySelector(".predictions .error").textContent = "You don't have any tokens in unsuccessful rounds";
    return;
  }else{
    document.querySelector(".predictions .error").textContent = "";
  }

  const tx = async () => await util.claim(rounds);
  sendTx(tx, `Successfully withdrew tokens`, "Failed to withdraw tokens"); 
}
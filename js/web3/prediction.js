async function populateUI(){
  setProgress();
  setupTokens(util.currentRound, util);
  renderTokenInfo();
  renderBetInfo();
  const predictions = await getPredictions();
  setPredictionRows(predictions);
  setPredictionCards(predictions);

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
    document.querySelector("#prediction-section .predict").classList.add(".ended");
  }

  let h = document.querySelector(".predict").offsetHeight;
  document.querySelector(".chart iframe").height = h;
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

function setupTokens(round, ref){
  for([k, v] of Object.entries(config.predictionTokens)){
    const index = round._tokens.indexOf(v);
    ref[k] = {
      address: v,
      bets: round.bets[index],
      lockedPrice: round.lockedPrices[index],
      closePrice: round.closePrices[index]
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

async function getPredictions(){
  _predictions = await util.getUserRounds();
  predictions = {epochs: _predictions[0], betInfo: _predictions[1]}
  const bets = [];
  for(i = 0; i< predictions.epochs.length; i++){
    bets[i] = {};
    bets[i].round = predictions.epochs[i].toString();
    bets[i].token = config.predictionTokens[predictions.betInfo[i].token];
    bets[i].bet = predictions.betInfo[i].position.toString();
    const round = await util.getRound(bets[i].round);
    const tokens = {};
    await setupTokens(round, tokens);
    bets[i].lockedPrice = tokens[bets[i].token].lockedPrice.div(10**8).toString();
    bets[i].closePrice = tokens[bets[i].token].closePrice.div(10**8).toString();
    bets[i].closeTimestamp = round.closeTimestamp.toString();
    const bulls = 
      await (
        util.provider.getLogs(
          await util.prediction.instance.filters.BetBull(null, predictions.epochs[i], predictions.betInfo[i].token, null)
        )
      )
    const bears = 
    await (
      util.provider.getLogs(
        await util.prediction.instance.filters.BetBear(null, predictions.epochs[i], predictions.betInfo[i].token, null)
      )
    )
    console.log(bears, bulls, predictions.epochs[i], predictions.betInfo[i].token,);
    bets[i].bulls = (bulls.length*100)/(bulls.length + bears.length);
    bets[i].bears = (bears.length*100)/(bulls.length + bears.length);
    // bets[i].lockedPrice = round.lockedPrice.toString()
  }
  return bets;
}

function setPredictionRows(predictions){
  ele = document.createElement("div");
  const rows = predictions.map(prediction => {
    return ` 
      <td>
        ${prediction.round}
      </td>
      <td>${prediction.token}</td>
      <td>$${prediction.lockedPrice}</td>
      <td>$${prediction.closePrice}</td>
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
        ${prediction.closePrice !== "0" ?(
          ( prediction.closePrice > prediction.lockedPrice && prediction.bet === "0")
          || ( prediction.closePrice < prediction.lockedPrice && prediction.bet === "1") ?
          '<span class="status won">Won</span>' :
          '<span class="status lost">Lost</span>'
        ) :
          prediction.closeTimestamp < Date.now() ?
          '<span class="status unsuccessfull">Pending</span>' :
          '<span class="status unsuccessfull">Unsuccessful</span>'
        }
      </td>
      <td>
      ${prediction.closePrice !== "0" ?(
        (prediction.closePrice > prediction.lockedPrice && prediction.bet === "0")
        || (prediction.closePrice < prediction.lockedPrice && prediction.bet === "1") ?
        '<a href="" class="earn won">Earn PRED</a>' :
        '<a href="" class="earn lost">Earn BNB</a>' 
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
  const cards = predictions.map(prediction => {
    return ` 
    <div><span>Round</span> <span>${prediction.round}</span></div>
    <div><span>COIN</span><span>${prediction.token}</span></div>
    <div><span>Locked Price</span><span>$${prediction.lockedPrice}</span></div>
    <div><span>Closing Price</span><span>$${prediction.closePrice}</span></div>
    <div><span>My prediction</span>${ prediction.bet === "0" ?
      '<img src="assets/front_n/images/icons/trending-green-up.svg" alt="up">' :
      '<img src="assets/front_n/images/icons/trending-red-down.svg" alt="down">'
    }</div>
    <div><span>Stats</span><span>
      <img src="assets/front_n/images/icons/trending-red-down.svg" alt="down"> 
        90%
      <img src="<img src="assets/front_n/images/icons/trending-green-up.svg" alt=""> 
        10% 
      </span></div>
    <div>
      ${prediction.closePrice !== "0" ?(
        (prediction.closePrice > prediction.lockedPrice && prediction.bet === "0")
        || (prediction.closePrice < prediction.lockedPrice && prediction.bet === "1") ?
        '<a class="earn won" href="">Earn PRED</a>' :
        '<a href="" class="earn lost">Earn BNB</a>' 
      ) :
        '<span>-</span>'
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
  predictions[0].forEach(async (_round, index) => {
    const round = await util.getRound(_round)
    if(!round.oraclesCalled){
      rounds.push(prediction.epochs[index]);
    }
  })
  if(rounds.length === 0){
    document.querySelector(".predictions .error").textContent = "You don't have any tokens in unsuccessfull rounds";
    return;
  }else{
    document.querySelector(".predictions .error").textContent = "";
  }

  const tx = async () => await util.claim(rounds);
  sendTx(tx, `Successfully withdrew tokens`, "Failed to withdraw tokens"); 
}
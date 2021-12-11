async function renderPredictionAPR(card, id, util, pred_bnbPrice) {
  let apr = await util.getStakeApr(id, pred_bnbPrice);

  const aprEle = card.querySelector(".apr");
  aprEle.textContent = `${formatNumber(apr, "per")}%`;
}

async function renderPredictionStaked(card, pId, util) {
  let totalEle = card.querySelector(".total-staked");
  let total = await util.totalStaked(pId);

  total = ethers.utils.formatUnits(total, 18);
  totalEle.textContent = formatNumber(total);
}

async function renderPredictionPendingReward(card, util, pId, bnbPrice, predPrice){
    // enter reward
  let earnedEle = card.querySelector(".earned");
  let earned, totalDollarValue;
  if(typeof util.farm.pendingPred !== "undefined"){
    earned = await util.pendingPred(pId);
    earned = ethers.utils.formatUnits(earned, 18);
    totalDollarValue = predPrice * earned;
  }else {
    earned = await util.pendingBID(pId);
    earned = ethers.utils.formatUnits(earned, 18);
    totalDollarValue = bnbPrice * earned;
  }
  
  card.querySelector(".dollar-value").textContent = `$${Number(
    totalDollarValue
  ).toFixed(2)}`;

  earnedEle.textContent = formatNumber(earned);
  if (earned <= 0) {
    card.querySelector(".harvest").classList.add("disable-btn");
  } else {
    card.querySelector(".harvest").classList.remove("disable-btn");
  }
}

async function renderUserStake(card, util, pId){
  let stakedEle = card.querySelector(".staked");
  let staked = await util.userStake(pId);
  staked = ethers.utils.formatUnits(staked, 18);
  stakedEle.textContent = formatNumber(staked);
}

async function enablePredictionContract(event, util) {
  if (event.target.closest("body").classList.contains("loading")) return;
  const parent = event.target.closest(".web3-card");
  let tx = async () => await util.approve(parent.dataset.pool);
  await sendTx(tx, "Contract Enabled");
}

async function populatePredictionModal(event, util) {
  const ele = event.target.closest(".web3-card");
  const pId = ele.dataset.pool;
  const modalId = event.target.dataset.target;
  const modal = document.querySelector(`${modalId}`);
  modal.dataset.pool = pId;
  modal.dataset.prediction = typeof util.farm.instance.pendingBID !== "undefined" ? "loser": "winner";
  let canStake;
  if(modal.dataset.prediction === "loser"){
    canStake = await util.lostRound(util.pools[pId].epoch);
  }else{
    canStake = await util.wonRound(util.pools[pId].epoch);
  }
  if(!canStake) {
    $.growl.error(
      { message: `You did not 
        ${modal.dataset.prediction === "loser" ? "lose": "win"} 
        Round #` + util.pools[pId].epoch 
      });
    setTimeout(() => closeModal(modalId), 500);
    return;
  }

  if (modal.querySelector(".name")) {
    modal.querySelectorAll(".name").forEach(
      ele => ele.textContent = "PRED"
    );
  }

  // enter staked
  if (modal.id === "unstake") {
    let stakedEle = modal.querySelector(".staked");
    let staked = await util.userStake(pId);
    staked = ethers.utils.formatUnits(staked, 18);
    stakedEle.textContent = formatNumber(staked);
  } else {
    // enter balance
    let balEle = modal.querySelector(".balance");
    let bal = await util.getBalance(pId);
    bal = ethers.utils.formatUnits(bal, 18);
    balEle.textContent = formatNumber(bal);
  }
}

async function getPastPools(){
  
  const table = document.querySelector(".past-pools .table");
  if(table.classList.contains("filled")) return;
  table.classList.add("filled");
  const utils = [loserUtil, winnerUtil, BNBUtil];
  for(let  higherIndex = 0; higherIndex < utils.length; higherIndex++){
    
    const util = utils[higherIndex];
    const length = util.farm.poolLength.toNumber() - 2;

    for(i=0; i<=length; i++){
      const data = {pool: i};
      const userInfo = await util.userInfo(i, await signer.getAddress());
      const poolInfo = await util.getPoolInfo(i);
      switch(higherIndex){
        case(1):
          pending = await util.pendingPred(i);
          data.icon = '<img src="assets/front_n/images/coins/pred.svg" alt="pred-icon">';
          break;
        case(2):
          pending = await util.pendingBNB(i);
          data.icon = '<img src="assets/front_n/images/coins/bnb.png" alt="pred-icon">';
          break;
        default:
          data.icon = '<img src="assets/front_n/images/coins/BID.png" alt="pred-icon">';
          pending = await util.pendingBID(i);
      }
      data.epoch = poolInfo.epoch.toString();
      data.amount = formatNumber(ethers.utils.formatUnits(userInfo.amount, 18));

      if(userInfo.amount.lte(0)) continue;

      document.querySelector(".past-pools").classList.remove("empty");
      data.earned = formatNumber(ethers.utils.formatUnits(pending, 18));


      const row = `
        <td>${data.epoch}</td>
        <td>${data.icon}</td>
        <td>${data.amount}</td>
        <td>${data.earned}</td>
        <td><button class="withdraw">Withdraw</button></td>`
      const tr = document.createElement("tr");
      tr.classList.add("table-row")
      tr.innerHTML = row;
      tr.querySelector(".withdraw")
        .addEventListener("click", () => withdrawPastPool(`${data.pool}`, userInfo.amount, util));
      table.appendChild(tr);
    }
  }
  
}

async function withdrawPastPool(pool, amount, util){
  let tx = async () => await util.withdraw(pool, amount);
  await sendTx(
    tx,
    `Successfully withdrew ${ethers.utils.formatUnits(amount, 18)} PRED`,
    `Failed to withdraw ${ethers.utils.formatUnits(amount, 18)} PRED`
  );
}
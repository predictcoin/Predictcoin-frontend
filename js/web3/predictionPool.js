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
    earned = await util.pendingBNB(pId);
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
  modal.dataset.prediction = typeof util.farm.instance.pendingBNB !== "undefined" ? "loser": "winner";
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
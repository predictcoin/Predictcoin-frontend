async function populateCard(card){
  const pId = card.dataset.pool;
  let token = await util.getPoolToken(pId);
  //show buttons
  // enter APR
  if(pId === 0) renderAPR(card);

  // enter reward
  let earnedEle = card.querySelector(".earned");
  let earned = await util.pendingPred(pId);
  earnedEle.textContent = ethers.utils.formatUnits(earned, token.decimals);
  if (earned.lte(pId)){
    card.querySelector(".harvest").classList.add("disable-btn");
  }

  // enter staked
  let stakedEle = card.querySelector(".staked");
  let staked = await util.userStake(pId);
  staked = ethers.utils.formatUnits(staked, token.decimals)
  stakedEle.textContent = staked;
  
  // enter totalStaked
  renderTotalStaked(token, card);

  // check if contracts enabled
  const allowance = ethers.utils.formatUnits(await util.allowance(pId), token.decimals);
  if (Number(allowance) > 10**10){
    card.classList.remove("not-enabled");
    card.classList.add("enabled");
  }

  // dollar equivalent of rewards
  if(pId === 0){
    let dollarValue = (await util.getAmountsOut(ethers.utils.parseUnits( "1", 18 ), 
      config.addresses.Pred, config.addresses.BUSD))[1];
    dollarValue = ethers.utils.formatUnits(dollarValue, token.decimals);
    let totalDollarValue = dollarValue*ethers.utils.formatUnits(earned, token.decimals);
    card.querySelector(".dollar-value").textContent = `$${Number(totalDollarValue).toFixed(2)}`;
  }
}

function populateUI(){
  document.querySelectorAll(".web3-card").forEach(ele => populateCard(ele))
}

async function renderTotalStaked(token, card){
  let totalEle = card.querySelector(".total-staked");
  let total = await util.totalStaked(token);
  totalEle.textContent = ethers.utils.formatUnits(total, token.decimals);
}

async function renderAPR(card){
  const aprEle = card.querySelector(".apr");
  let apr = await util.getStakeApr();
  aprEle.textContent = `${formatNumber(apr, "per")}%`;
}

async function populateModal(event){
  const ele = event.target.closest(".web3-card");
  const pId = ele.dataset.pool;
  const modalId = event.target.dataset.target;
  const modal = document.querySelector(`${modalId}`)
  modal.dataset.pool = pId;

  let token = await util.getPoolToken(pId);
  // enter staked
  if (modal.id === "unstake"){
    let stakedEle = modal.querySelector(".staked");
    let staked = await util.userStake(pId);
    staked = ethers.utils.formatUnits(staked, token.decimals)
    stakedEle.textContent = staked;
  }else {
    // enter balance
    let balEle = modal.querySelector(".balance");
    let bal = await util.getBalance(pId);
    balEle.textContent = ethers.utils.formatUnits(bal, token.decimals);
  }
}

function validateNumber(event){
  //validate is a library to allow only nos
  const check = validate({duration: event.target.value}, {duration: {numericality: true}})
  const modal = event.target.closest(".modal");
  if (check){
    const len = event.target.value.length;
    event.target.value = event.target.value.slice(0, len-1);
    if(validate({duration: event.target.value}, {duration: {numericality: true}})) event.target.value = "";
  }

  if (event.target.value !== "0" && event.target.value !== ""){
    modal.querySelector(".btn__confirm").classList.remove("disable-btn")
  }else{
    modal.querySelector(".btn__confirm").classList.add("disable-btn")
  }
  return modal;
}

async function checkBalance(modal, event){
  const poolId = modal.dataset.pool;
  let balance 
  let token = await util.getPoolToken(poolId);
  if (modal.id === "stake"){
    balance = await util.getBalance(poolId);
  }else if(modal.id === "unstake"){
    balance = await util.userStake(poolId);
  }
  let value = event.target.value;
  if (value === "") value = "0";
  value = ethers.utils.parseUnits(value, token.decimals);
  if(balance.lt(value)){
    modal.classList.add("disable-modal");
  }else{modal.classList.remove("disable-modal");}
}

async function sendTx(tx, message){
  try {
    tx = await tx();
  } catch (err) {
    switch (err.code) {
      case 4001:
        $.growl.error({ message: "User rejected transaction" });
        break;
      case -32602:
        $.growl.error({ message: "Invalid parameters" });
        break;
      case -32603:
        $.growl.error({ message: "Internal error" });
        break;
      default:
        $.growl.error({ message: "Something went wrong" });
    }
    console.log(err);
    return;
  }

  updateNotificaion(1);
  provider.waitForTransaction(tx.hash).then((receipt) => {
    if (receipt.status) {
      $.growl.notice({ message: `✓  ${message}`, title: "" });
    } else {
      $.growl.error({ message: `Transaction failed to ${message}` });
    }
    updateNotificaion(-1);
  });
}

function updateNotificaion(dir) {
  const countEle = document.querySelector(".notifications__status");
  let count = Number(countEle.textContent);
  count += dir;
  countEle.textContent = count;

  const notificationEle = document.querySelector(".notifications");
  if (count > 0) {
    notificationEle.classList.add("notifications--show");
  } else {
    notificationEle.classList.remove("notifications--show");
  }
}

async function putMax(event) {
  const parent = event.target.closest(".modal");
  const pId = parent.dataset.pool;
  const input = parent.querySelector("input");
  const token = await util.getPoolToken(pId);
  let bal;
  if(parent.id === "unstake"){
    bal = await util.userStake(pId);
  }else{
    bal = await util.getBalance(pId);
  }
  input.value = ethers.utils.formatUnits(bal, token.decimals);
  if (bal.gt(0)) {
    parent.querySelector(".btn__confirm").classList.remove("disable-btn");
    parent.classList.remove("disable-modal");
  }
}

async function enableContract(event) {
  if (event.target.closest("body").contains("loading")) return;
  const parent = event.target.closest(".web3-card");
  let tx = async () => await util.approve(parent.dataset.pool);
  await sendTx(tx, "Contract Enabled");
}

async function withdraw(event){
  const parent = event.target.closest(".modal");
  if(event.target.classList.contains("disable-btn") ||
    parent.classList.contains("disable-modal")) return; 
  const token = await util.getPoolToken(parent.dataset.pool);
  const input = parent.querySelector("input");
  const amount = ethers.utils.parseUnits(input.value, token.decimals);
  let tx = async () => await util.withdraw(parent.dataset.pool, amount);
  await sendTx(tx, "Withdrawal successful");
  closeModal("#unstake");
  input.value= "";
}

async function harvest(event){
  const parent = event.target.closest(".web3-card");
  if (event.target.classList.contains("disable-btn")) return;
  let tx = async () => await util.withdraw(parent.dataset.pool, 0);
  await sendTx(tx, "Harvest successful");
}

async function deposit(event){
  const parent = event.target.closest(".modal");
  if(event.target.classList.contains("disable-btn") ||
    parent.classList.contains("disable-modal")) return; 
  const token = await util.getPoolToken(parent.dataset.pool);
  const input = parent.querySelector("input");  
  const amount = ethers.utils.parseUnits(input.value, token.decimals);
  
  let tx = async () => await util.deposit(parent.dataset.pool, amount);
  await sendTx(tx, "You successfully staked");
  closeModal("#stake");
  input.value= "";
}
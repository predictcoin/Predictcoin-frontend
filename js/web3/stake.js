function addEventListeners(){
  console.log("in")
}

async function populateUI(){
  let token = await util.getPoolToken(0);
  //show buttons
  // enter APR
  const aprEle = document.querySelector("#apr");
  let apr = await util.getStakeApr();
  aprEle.textContent = `${formatNumber(apr, "per")}%`;
  
  
  // enter reward
  let earnedEle = document.querySelector("#earned");
  let earned = await util.pendingPred(0);
  
  earnedEle.textContent = ethers.utils.formatUnits(earned, token.decimals);
  if (earned.lte(0)){
    document.querySelector(".harvest").classList.add("disable-btn");
  }
  // enter staked
  let stakedEles = document.querySelectorAll(".staked");
  let staked = await util.userStake(0);
  staked = ethers.utils.formatUnits(staked, token.decimals)
  stakedEles.forEach(ele => {
    ele.textContent = staked;
  })
  // enter balance
  let balEle = document.querySelector("#balance");
  let bal = await util.getBalance(0);
  balEle.textContent = ethers.utils.formatUnits(bal, token.decimals);
  // enter totalStaked
  let totalEle = document.querySelector("#total-staked");
  let total = await util.totalStaked(token);
  totalEle.textContent = ethers.utils.formatUnits(total, token.decimals);
  // check if contracts enabled
  document.querySelectorAll(".web3-card").forEach(async ele => {
    const pool = ele.dataset.pool;
    const token = util.getPoolToken(pool);
    const allowance = ethers.utils.formatUnits(await util.allowance(pool), token.decimals);
    if (Number(allowance) > 10**10){
      ele.classList.remove("not-enabled");
      ele.classList.add("enabled");
    }
  })
  // dollar equivalent of rewards
  let dollarValue = (await util.getAmountsOut(ethers.utils.parseUnits( "1", 18 ), 
    config.addresses.Pred, config.addresses.BUSD))[1];
  dollarValue = ethers.utils.formatUnits(dollarValue, token.decimals);
  let totalDollarValue = dollarValue*ethers.utils.formatUnits(earned, token.decimals);
  document.querySelector(".dollar-value").textContent = `$${Number(totalDollarValue).toFixed(2)}`;

  // enable contract
  let enableBtns = document.querySelectorAll(".enable-contract");
  enableBtns.forEach((ele) => ele.addEventListener("click", enableContract));
}

function clearInput(event){
  if (event.target.dataset.dismiss !== "modal" &&
    !event.target.closest("[data-dismiss=modal]") && 
    event.target !== event.currentTarget) return;
  event.currentTarget.querySelectorAll("input").forEach(ele => ele.value = "");
}

function giveModal(event){
  const ele = event.target.closest(".web3-card");
  const pool = ele.dataset.pool;
  const modalId = event.target.dataset.target;
  console.log(modalId);
  console.log(pool);
  document.querySelector(`${modalId}`).dataset.pool = pool;
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
  console.log(event.target.value);
  const poolId = modal.dataset.pool;
  let balance 
  let token = await util.getPoolToken(poolId);
  if (modal.id === "stake"){
    balance = ethers.utils.formatUnits(await util.getBalance(poolId), token.decimals);
  }else if(modal.id === "unstake"){
    balance = ethers.utils.formatUnits(await util.userStake(poolId), token.decimals);
  }
  console.log(balance)
  if(Number(balance) < Number(event.target.value)){
    modal.classList.add("disable-modal");
  }else{modal.classList.remove("disable-modal");}
}

window.addEventListener("load", () => {
  // add events to max btns
  document.querySelector(".max-balance").addEventListener("click", 
    (event) => putBalance(event, 0));
  document.querySelector(".max-stake").addEventListener("click", 
    (event) => putStaked(event, 0));
  document.querySelectorAll(".mutate-btn").forEach(ele => 
    ele.addEventListener("click", (event) => giveModal(event))
  )
  // add events to validateNumber and check balance in modal
  document.querySelectorAll(".modal input").forEach(input => {
    input.addEventListener("input", async (event) => {
      const modal = validateNumber(event);
      await checkBalance(modal, event);
    })
  })
  //deposit and withdraw
  document.querySelector("#unstake .btn__confirm").addEventListener("click", withdraw);
  document.querySelector("#stake .btn__confirm").addEventListener("click", deposit);
  // add events to harvest
  document.querySelectorAll(".harvest").forEach(ele => ele.addEventListener("click", harvest));
  // add events to clear input when modal is closed
  document.querySelectorAll(".modal").forEach(ele => ele.addEventListener("click", clearInput));
})




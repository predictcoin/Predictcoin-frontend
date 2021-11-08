// You'll find functions not related to web3 here
window.addEventListener("load", () => {
  // add disconnect wallet event listener
  document.querySelector(".btn--logout").addEventListener("click", disconnectWallet);
  document.querySelectorAll(".tokens .token").forEach(token => token.addEventListener("click", setToken))
  setNextRoundCountdown();
  document.querySelectorAll(".predict-btns button").forEach(button => button.addEventListener("click", predict));
  document.querySelector(".enable-contract").addEventListener("click", enablePrediction);
  document.querySelector(".withdraw").addEventListener("click", withdrawTokens);
})

async function setToken(){
  const active = this.closest(".tokens").querySelector(".active");
  active.classList.remove("active");
  this.classList.add("active");
  util.setToken(this.textContent.trim());
  renderTokenInfo();
  // document.querySelector(`iframe div[role=tablist]`).click();
}

function closeModal(modal){
  document.querySelectorAll(`${modal} input`).forEach(ele => {
    ele.value = "";
  })
  document.querySelector(`${modal} .close`).click();
}


function setNextRoundCountdown(){
  const repeat = () => {
    const originStamp = 1635771600;
    const currentStamp = parseInt(Date.now()/1000);
    const interval = 604800;
    const elapsed = currentStamp - originStamp;
    const past = Math.floor(elapsed/interval);

    const remainder = elapsed%interval;
    let futureStamp
    if(remainder === 0){
      futureStamp = originStamp + (past*interval);
    }else{
      futureStamp = originStamp + ((past+1)*interval)
    }

    const duration = futureStamp - parseInt(Date.now()/1000);

    const [days, hours, mins, secs] = getCountDown(duration);
    const cont = document.querySelector(".round-ended .timer");
    cont.textContent = `${days}d : ${hours}hr : ${mins}m : ${secs}s`
  }

  setInterval(repeat, 2000);
}
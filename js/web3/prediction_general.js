// You'll find functions not related to web3 here
window.addEventListener("load", () => {
  // add disconnect wallet event listener
  document.querySelector(".btn--logout").addEventListener("click", disconnectWallet);
  document.querySelectorAll(".tokens .token").forEach(token => token.addEventListener("click", setToken))
  setNextRoundCountdown();
  document.querySelectorAll(".predict-btns button").forEach(button => button.addEventListener("click", predict));
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
    const d = new Date();
    const addDays = d.getHours() < 13 ? 0 : 7;
    d.setDate(d.getDate() + (((1 + 7 - d.getDay()) % 7) || addDays));
    d.setUTCHours(13, 0, 0)
    const duration = (d.getTime() - Date.now())/1000;
    const [days, hours, mins, secs] = getCountDown(duration.toFixed());
    const cont = document.querySelector(".round-ended .timer");
    cont.textContent = `${days}d : ${hours}hr : ${mins}m : ${secs}s`
  }

  setInterval(repeat, 2000);
}
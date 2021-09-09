// You'll find functions not related to web3 here
window.addEventListener("load", () => {
  document.querySelectorAll(".ipo_heading span").forEach(ele => ele.addEventListener("click", changeTab));
  // add disconnect wallet event listener
  document.querySelector(".btn--logout").addEventListener("click", disconnectWallet);
  // add event listene to input 
  document.querySelector(".input input").addEventListener("input", checkInput);
  // buy PRED
  document.querySelector(".buy_button").addEventListener("click", buy);
  // clzim PRED
  document.querySelector(".claim_button").addEventListener("click", claim);
})

function changeTab(e) {
  document.querySelector("body").classList.toggle("live");
}

function closeModal(modal){
  document.querySelectorAll(`${modal} input`).forEach(ele => {
    ele.value = "";
  })
  document.querySelector(`${modal} .close`).click();
}

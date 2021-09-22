async function fillTotal_APR(){
  document.querySelectorAll(".web3-card").forEach(async ele => {
    const id = ele.dataset.pool;
    const res = await( (
      await fetch('https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              pair(id: "${id === "1" ? config.addresses["BUSD-PRED LP"]: config.addresses["BNB-PRED LP"]}"){
                reserveUSD,
                totalSupply,
                pairHourData(first: 25, orderDirection: desc, orderBy: hourStartUnix){
                  hourlyVolumeUSD
                }
              }
            }
          `,
          }),
        })
      ).json())
    const token = await util.getPoolToken(id);

    let dollarValue = (
      await util.getAmountsOut(
        ethers.utils.parseUnits("1", 18),
        config.addresses.PRED,
        config.addresses.BUSD
      )
    )[1];
    
    await renderAPR(ele, ele.dataset.pool, res, dollarValue);
    await renderTotalStaked(token, ele, dollarValue);
    document.querySelector("body").classList.remove("loading");
    document.querySelector("body").classList.add("loaded");
  })
}

function closeModal(modal){
  document.querySelectorAll(`${modal} input`).forEach(ele => {
    ele.value = "";
  })
  document.querySelector(`${modal} .close`).click();
}

function closeModal2(event){
  if(event.keyCode === 27){
    let openModal = document.querySelector(".modal.show");
    if(openModal){
      openModal.click();
    }
  }
}


function clearInput(event){
  if (event.target.dataset.dismiss !== "modal" &&
    !event.target.closest("[data-dismiss=modal]") && 
    event.target !== event.currentTarget) return;
  event.currentTarget.querySelectorAll("input").forEach(ele => ele.value = "");
  event.currentTarget.classList.remove("disable-modal");
}

// add event listeners
window.addEventListener("load", () => {
  // add events to max btns
  document.querySelectorAll(".max").forEach(
    ele => ele.addEventListener("click", (event) => putMax(event))
  );
  document.querySelectorAll(".mutate-btn").forEach(ele => 
    ele.addEventListener("click", (event) => populateModal(event))
  );
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
  //close modals
  document.querySelector("body").addEventListener("keydown", closeModal2);
  // enable contract
  document.querySelectorAll(".enable-contract").forEach(ele => ele.addEventListener("click", enableContract));
  // add event to logout button
  document.querySelector(".btn--logout").addEventListener("click", disconnectWallet);
  // add compounding event
  let compBtn = document.querySelector(".compound");
  if(compBtn) {
    compBtn.addEventListener("click", compound)
  }

  // fill contract link
  let contractLinkEles = document.querySelectorAll(".contract-link");
  contractLinkEles.forEach(
    (ele) =>
      (ele.href = `http://BscScan.com/address/${config.addresses.Farm}`)
  );

})

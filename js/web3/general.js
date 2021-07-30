// This file Connects wallets and registers events
let provider, signer;

window.addEventListener("load", async () => {
  // render APR and total staked/liquidity

  try {
    await checkConnection();
    await start();
  } catch (err) {
    console.log(err);
    let provider = ethers.getDefaultProvider(config.providerEndpoint);
    await initContracts(provider, provider);
    fillTotal_APR();
  }
});

async function start() {
  const proceed = await initUI(await signer.getAddress());
  if (proceed === false) return;
  await initContracts(signer, provider);
  await populateUI();
  await establishEvents();
  document.querySelector("body").classList.remove("loading");
  document.querySelector("body").classList.add("loaded");
}

async function select_network(wallet) {
  if (wallet == "metamask") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (err) {
      if (err.code == 4001) {
        $.growl.error({ message: "Wallet connection was rejected" });
        return;
      }
    }
  }

  signer = provider.getSigner();
  try {
    await start();
  } catch (err) {
    console.log(err);
  }
}

async function checkConnection() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  }
}

async function fillTotal_APR(){
  document.querySelectorAll(".web3-card").forEach(async ele => {
    const pool = ele.dataset.pool;
    const token = await util.getPoolToken(pool);
    await renderAPR();
    await renderTotalStaked(token);
    document.querySelector("body").classList.remove("loading");
    document.querySelector("body").classList.add("loaded");
  })
}

async function initUI(address) {
  const { chainId } = await provider.getNetwork();
  if (chainId !== config.chainId) {
    $.growl.error({
      title: "Wrong Network",
      message: "Connect your wallet to Binance Smart Chain",
    });
    return false;
  }

  addressArr = address.split("");
  addressArr.splice(4, 36, "...");
  if (addressArr.length > 0) {
    document.querySelector("body").classList.remove("not-connected");
    document.querySelector("body").classList.add("connected");
    document.querySelector(".wallet-connected .btn-wtext").innerHTML =
      addressArr.join("");
    document
      .querySelectorAll(".address-text")
      .forEach((ele) => (ele.innerHTML = address));
    closeModal("#walConnect");

    document.querySelector(
      ".btn--view"
    ).href = `https://bscscan.com/address/${address}`;

    // fill contract link
    let contractLinkEles = document.querySelectorAll(".contract-link");
    contractLinkEles.forEach(
      (ele) =>
        (ele.href = `http://BscScan.com/contract/${config.addresses.Farm}`)
    );
  }
}

async function establishEvents() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async () => {
      try {
        await signer.getAddress();
      } catch (err) {
        document.querySelector("body").classList.add("not-connected");
        document.querySelector("body").classList.remove("connected");
        document.querySelectorAll(".web3-card").forEach(ele => {
          ele.classList.add("not-enabled")
          ele.classList.remove("enabled")
          }
        );
        window.ethereum.removeAllListeners("accountsChanged", "chainChanged");
        console.log(err);
        return;
      }

      start();
      //window.location.reload();
    });
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  }

  provider.off("block");
  provider.on("block", async () => {
    await populateUI();
  });
}

function closeModal(modal){
  document.querySelectorAll(`${modal} input`).forEach(ele => {
    ele.value = "";
  })
  document.querySelector(`${modal} .close`).click();
}


function clearInput(event){
  if (event.target.dataset.dismiss !== "modal" &&
    !event.target.closest("[data-dismiss=modal]") && 
    event.target !== event.currentTarget) return;
  event.currentTarget.querySelectorAll("input").forEach(ele => ele.value = "");
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
  // enable contract
  document.querySelectorAll(".enable-contract").forEach(ele => ele.addEventListener("click", enableContract));
})

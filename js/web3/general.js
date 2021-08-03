// This file Connects wallets and registers events
let provider, signer;

window.addEventListener("load", async () => {
  let wallet = localStorage.getItem("wallet");
  if (wallet === null) {
    useDefaultProvider()
    return;
  }
  let walletProvider = getWalletProvider(wallet);
  // render APR and total staked/liquidity
  try {
    await checkConnection(walletProvider);
    await start(walletProvider);
  } catch (err) {
    console.log(err);
    useDefaultProvider();
  }
});

async function useDefaultProvider(){
  let provider = ethers.getDefaultProvider(config.providerEndpoint);
  await initContracts(provider, provider);
  fillTotal_APR();
}

async function start(walletProvider) {
  provider.off("block");
  document.querySelector("body").classList.add("loading");
  document.querySelector("body").classList.remove("loaded");

  const proceed = await initUI(await signer.getAddress());
  if (proceed === false) return;
  await initContracts(signer, provider);
  await populateUI();
  await establishEvents(walletProvider);
}

function getWalletProvider(wallet){
  let walletProvider;
  switch (wallet){
    case "mathwallet":
    case "trustwallet":
    case "tokenpocket":
    case "metamask":
      walletProvider = window.ethereum;
      break;
    case "binance":
      walletProvider = window.BinanceChain;
  }

  return walletProvider;
}

async function select_network(wallet) {
  let walletProvider = getWalletProvider(wallet);
   
  provider = new ethers.providers.Web3Provider(walletProvider);
  try {
    await walletProvider.request({ method: "eth_requestAccounts" });
    localStorage.setItem("wallet", wallet);
  } catch (err) {
    if (err.code == 4001) {
      $.growl.error({ message: "Wallet connection was rejected" });
      return;
    }
  }

  signer = provider.getSigner();
  try {
    await start(walletProvider);
  } catch (err) {
    console.log(err);
  }
}

function disconnectWallet(){
  closeModal("#walInfo");
  provider.off("block");
  provider.removeAllListeners("accountsChanged", "chainChanged");

  document.querySelector("body").classList.add("not-connected");
  document.querySelector("body").classList.remove("connected");
  document.querySelectorAll(".web3-card").forEach(ele => {
    ele.classList.add("not-enabled")
    ele.classList.remove("enabled")
    }
  );
  localStorage.removeItem("wallet");
}

async function checkConnection(walletProvider) {
  provider = new ethers.providers.Web3Provider(walletProvider);
  signer = provider.getSigner();
}

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
              pair(id: "${id === "1" ? config.addresses["BUSD-PRED"]: config.addresses["BNB-PRED"]}"){
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

async function initUI(address) {
  const { chainId } = await provider.getNetwork();
  if (chainId !== config.chainId) {
    $.growl.error({
      title: "Wrong Network",
      message: "Connect your wallet to Binance Smart Chain",
    });
    closeModal("#walConnect");
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

async function establishEvents(wallet) {
  provider.removeAllListeners("accountsChanged", "chainChanged");
  wallet.on("accountsChanged", async () => {
    console.log("me");
    try {
      await signer.getAddress();
    } catch (err) {
      //off wallet event listeners
      disconnectWallet();
      console.log(err);
      return;
    }

    start(localStorage.getItem("wallet"));
    //window.location.reload();
  });
  wallet.on("chainChanged", () => {
    window.location.reload();
  });

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
  // add event to logout button
  document.querySelector(".btn--logout").addEventListener("click", disconnectWallet);
  // add compounding event
  let compBtn = document.querySelector(".compound");
  if(compBtn) {
    compBtn.addEventListener("click", compound)
  }
})

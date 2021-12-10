// This file Connects wallets and registers events
let provider, signer;

window.addEventListener("load", async () => {
  let wallet = localStorage.getItem("wallet");
  if (wallet === null) {
    await useDefaultProvider();

    return;
  }
  
  let walletProvider = getWalletProvider(wallet);
  // render APR and total staked/liquidity
  try {
    await checkConnection(walletProvider);
    await start(walletProvider);
  } catch (err) {

    await useDefaultProvider();
  }
});

async function useDefaultProvider() {
  let provider = ethers.getDefaultProvider(config.providerEndpoint);
  await initContracts(provider, provider);
<<<<<<< HEAD

  if (typeof initPredictionPool !== "undefined") {
    winnerUtil = await initPredictionPool(
      provider,
      provider,
      WinnerPool,
      "winnerPool"
    );
    loserUtil = await initPredictionPool(
      provider,
      provider,
      LoserPool,
      "loserPool"
    );
=======
  
  if(typeof initPredictionPool !== "undefined"){
    
    winnerUtil = await initPredictionPool(provider, provider, WinnerPool, "winnerPool");
    loserUtil = await initPredictionPool(provider, provider, LoserPool, "loserPool");
    BNBUtil = await initPredictionPool(provider, provider, BNBPool, "BNBPool");
>>>>>>> 609df4840f0f238cb7c9fe28a313a2f23accb3db
  }

  await fillTotal_APR();
}

async function start(walletProvider) {
  provider.off("block");

  const proceed = await initUI(await signer.getAddress());
  if (proceed === false) return;
  await initContracts(signer, provider);

<<<<<<< HEAD
  if (typeof initPredictionPool !== "undefined") {
    winnerUtil = await initPredictionPool(
      signer,
      provider,
      WinnerPool,
      "winnerPool"
    );
    loserUtil = await initPredictionPool(
      signer,
      provider,
      LoserPool,
      "loserPool"
    );
=======
  if(typeof initPredictionPool !== "undefined"){
    winnerUtil = await initPredictionPool(signer, provider, WinnerPool, "winnerPool");
    loserUtil = await initPredictionPool(signer, provider, LoserPool, "loserPool");
    BNBUtil = await initPredictionPool(signer, provider, BNBPool, "BNBPool");
>>>>>>> 609df4840f0f238cb7c9fe28a313a2f23accb3db
  }

  await populateUI();
  await establishEvents(walletProvider);
}

function getWalletProvider(wallet) {
  let walletProvider;
  switch (wallet) {
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

function disconnectWallet() {
  closeModal("#walInfo");
  provider.off("block");
  provider.removeAllListeners("accountsChanged", "chainChanged");

  document.querySelector("body").classList.add("not-connected");
  document.querySelector("body").classList.remove("connected");
  document.querySelectorAll(".web3-card").forEach((ele) => {
    ele.classList.add("not-enabled");
    ele.classList.remove("enabled");
  });
  localStorage.removeItem("wallet");
}

async function checkConnection(walletProvider) {
  provider = new ethers.providers.Web3Provider(walletProvider);
  signer = provider.getSigner();
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
  }
}

async function establishEvents(walletProvider) {
  provider.removeAllListeners("accountsChanged", "chainChanged");
  walletProvider.on("accountsChanged", async () => {
    try {
      await signer.getAddress();
    } catch (err) {
      //off wallet event listeners
      disconnectWallet();
      console.log(err);
      return;
    }

    start(walletProvider);
    //window.location.reload();
  });
  walletProvider.on("chainChanged", () => {
    window.location.reload();
  });

  setInterval(populateUI, 3000);

  // provider.on("block", async () => {
  //   await populateUI();
  // });
}

async function sendTx(tx, passMsg, failMsg) {
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
      $.growl.notice({ message: `✓  ${passMsg}`, title: "" });
    } else {
      $.growl.error({ message: `${failMsg}` });
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

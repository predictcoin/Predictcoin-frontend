window.addEventListener("load", async () => {
  // config math library
  math.config({
    number: 'BigNumber',      // Default type of number:
    precision: 64             // Number of significant digits for BigNumbers
  })
  try {
    await checkConnection();
  } catch (err) {
    console.log(err);
  }
});

let provider, signer;

async function start() {
  const proceed = await initUI(await signer.getAddress());
  if (proceed === false) return;
  await initWeb3(signer, provider);
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
    try {
      await start();
    } catch (err) {
      console.log(err);
    }
  }
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

  // provider.off("block");
  // provider.on("block", async () => {
  //   await initWeb3(signer, provider);
  //   await populateUI();
  // });
}

function closeModal(modal){
  document.querySelectorAll(`${modal} input`).forEach(ele => {
    ele.value = "";
  })
  document.querySelector(`${modal} .close`).click();
}

async function putBalance(event, pId) {
  const parent = event.target.closest(".modal");
  const input = parent.querySelector("input");
  const token = await util.getPoolToken(pId)
  const bal = await util.getBalance(pId);
  input.value = ethers.utils.formatUnits(bal, token.decimals);
  if (bal.gt(0)) {
    parent.querySelector(".btn__confirm").classList.remove("disable-btn");
    parent.classList.remove("disable-modal");
  }
}

async function putStaked(event, pId) {
  const parent = event.target.closest(".modal");
  const input = parent.querySelector("input");
  const token = await util.getPoolToken(pId)
  const stake = await util.userStake(pId);
  input.value = ethers.utils.formatUnits(stake, token.decimals);;
  if (stake.gt(0)) {
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
  console.log(amount.toString(), (await util.userInfo(0)).amount.toString());
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

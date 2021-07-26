let provider, signer;

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

  const {chainId} = await provider.getNetwork();
  if (chainId !== 56){
    $.growl.error({title:"Wrong Network", message: "Connect your wallet to Binance Smart Chain" });
    return;
  }

  signer = provider.getSigner();
  addressArr = (await signer.getAddress()).split("");
  const address = addressArr.join("");
  addressArr.splice(4, 36, "...");
  if (addressArr.length > 0) {
    document.querySelector(".connect").classList.add("hide");
    document.querySelector(".connected").classList.remove("hide");
    document.querySelector(".connected .btn-wtext").innerHTML =
      addressArr.join("");
    document
      .querySelectorAll(".address-text")
      .forEach((ele) => (ele.innerHTML = address));
    document.querySelector("#walConnect .close").click();

    document.querySelector(
      ".btn--view"
    ).href = `https://bscscan.com/address/${address}`;
  }
}

async function checkConnection() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    try{
      await signer.getAddress();
      select_network("metamask");
    }catch(err){}
  }
}

function establishEvents(){
  if (window.ethereum){
    window.ethereum.on("connect", () => {
      if (window.ethereum.isConnected()) return;
      select_network("metamask");
    })
    window.ethereum.on("accountsChanged", () => {
      console.log("accounts");
      //window.location.reload();
    });
    window.ethereum.on("chainChanged", () => {
      console.log("chain")
      window.location.reload();
    })
  }
}

window.addEventListener("load", () => {
  establishEvents();
  checkConnection();
});

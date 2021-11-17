
function changeTab(e) {
  document.querySelector("body").classList.toggle("live");
}

function changePage(event) {
  const pages = document.querySelectorAll(".past-pools.pages .page");
  const activeNo = document.querySelector(".page-nos .active");
  activeNo.classList.remove("active");
  event.target.classList.add("active");
  const page = Number(event.target.textContent);
  const activePage = document.querySelector(".past-pools.pages .page.active")
  activePage.classList.remove("active");
  pages[page-1].classList.add("active");
}

async function fillPrediction_APR(){
  let predPrice = (
    await util.getAmountsOut(
      ethers.utils.parseUnits("1", 18),
      config.addresses.PRED,
      config.addresses.BUSD
    )
  )[1];
  
  let bnbPrice = (
    await util.getAmountsOut(
      ethers.utils.parseUnits("1", 18),
      config.addresses.WBNB,
      config.addresses.BUSD
    )
  )[1];
  
  const pred_bnbPrice = bnbPrice.div(predPrice);
  predPrice = ethers.utils.formatUnits(predPrice, 18);
  bnbPrice = ethers.utils.formatUnits(bnbPrice, 18);

  const loserEle = document.querySelector(".prediction-pool.loser");
  const winnerEle = document.querySelector(".prediction-pool.winner");

  const eles = [loserEle, winnerEle];
  const utils = [loserUtil, winnerUtil];
  eles.forEach( async (ele, index) => {
    const pId = utils[index].farm.poolLength.toNumber()-1;
    ele.dataset.pool = pId;
    await renderPredictionAPR(ele, pId, utils[index], pred_bnbPrice);
    await renderPredictionStaked(ele, pId, utils[index]);
    ele.querySelector(".epoch").textContent = `#${utils[index].pools[pId].epoch}`;
    ele.classList.remove("loading");
    ele.classList.add("loaded");
  })
}

async function populatePredictionUI(){
  let predPrice = (
    await util.getAmountsOut(
      ethers.utils.parseUnits("1", 18),
      config.addresses.PRED,
      config.addresses.BUSD
    )
  )[1];
  
  let bnbPrice = (
    await util.getAmountsOut(
      ethers.utils.parseUnits("1", 18),
      config.addresses.WBNB,
      config.addresses.BUSD
    )
  )[1];
  
  const pred_bnbPrice = bnbPrice.div(predPrice);
  predPrice = ethers.utils.formatUnits(predPrice, 18);
  bnbPrice = ethers.utils.formatUnits(bnbPrice, 18);


  const loserEle = document.querySelector(".prediction-pool.loser");
  const winnerEle = document.querySelector(".prediction-pool.winner");

  const eles = [loserEle, winnerEle];
  const utils = [loserUtil, winnerUtil];
  // check if contracts enabled
  const allowances = []
  for(i = 0;i < utils.length; i++){
    const allowance = await ethers.utils.formatUnits(
      await utils[i].allowance(),
      18
    );

    allowances.push(allowance);
  }

    
  eles.forEach( async (ele, index) => {

    const pId = utils[index].farm.poolLength.toNumber() - 1;
    ele.dataset.pool = pId;
    await renderPredictionAPR(ele, pId, utils[index], pred_bnbPrice);
    await renderPredictionStaked(ele, pId, utils[index]);
    ele.querySelector(".epoch").textContent = `#${utils[index].pools[pId].epoch}`;

    await renderPredictionPendingReward(ele, utils[index], pId, bnbPrice, predPrice);
    await renderUserStake(ele, utils[index], pId);

    //config. enable button
    if (Number(allowances[index]) > 10 ** 10) {
      ele.classList.remove("not-enabled");
      ele.classList.add("enabled");
    } else {
      ele.classList.add("not-enabled");
      ele.classList.remove("enabled");
    }

    ele.classList.remove("loading");
    ele.classList.add("loaded");
  })
}
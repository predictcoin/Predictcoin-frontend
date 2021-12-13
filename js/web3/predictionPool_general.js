
function changeTab(e) {
  document.querySelector("body").classList.toggle("live");
}

async function fillPrediction_APR(){
  let predPrice = (
    await util.getAmountsOut(
      ethers.utils.parseUnits("1", 18),
      config.addresses.PRED,
      config.addresses.BUSD
    )
  )[1];
      
  // let bidPrice = ethers.BigNumber.from("57414222109677671");
  let bidPrice = (
    await util.getAmountsOutAutoShark(
      ethers.utils.parseUnits("1", 18),
      config.addresses.BID,
      config.addresses.WBNB,
      config.addresses.BUSD
    )
  )[2];


  const pred_bidPrice = predPrice.div(bidPrice);

  predPrice = ethers.utils.formatUnits(predPrice, 18);
  bidPrice = ethers.utils.formatUnits(bidPrice, 18);

  const loserEle = document.querySelector(".prediction-pool.loser");
  const winnerEle = document.querySelector(".prediction-pool.winner");

  const eles = [loserEle, winnerEle];
  const utils = [loserUtil, winnerUtil];
  eles.forEach( async (ele, index) => {
    const pId = utils[index].farm.poolLength.toNumber()-1;
    ele.dataset.pool = pId;
    await renderPredictionAPR(ele, pId, utils[index], pred_bidPrice);
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
  
  // let bidPrice = ethers.BigNumber.from("57414222109677671");
  let bidPrice = (
    await util.getAmountsOutAutoShark(
      ethers.utils.parseUnits("1", 18),
      config.addresses.BID,
      config.addresses.WBNB,
      config.addresses.BUSD
    )
  )[2];

  const pred_bidPrice = predPrice.div(bidPrice);
  predPrice = ethers.utils.formatUnits(predPrice, 18);
  bidPrice = ethers.utils.formatUnits(bidPrice, 18);


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
    await renderPredictionAPR(ele, pId, utils[index], pred_bidPrice);
    await renderPredictionStaked(ele, pId, utils[index]);
    ele.querySelector(".epoch").textContent = `#${utils[index].pools[pId].epoch}`;

    await renderPredictionPendingReward(ele, utils[index], pId, bidPrice, predPrice);
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

  await getPastPools();
}
async function populateCard(card) {
  const pId = card.dataset.pool;
  let token = await util.getPoolToken(pId);

  // dollar equivalent of rewards
  let dollarValue = (
    await util.getAmountsOut(
      ethers.utils.parseUnits("1", 18),
      config.addresses.PRED,
      config.addresses.BUSD
    )
  )[1];

  // request for pair data
  const res = await (
    await fetch(
      "https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query {
            pair(id: "${
              pId === "1"
                ? config.addresses["BUSD-PRED LP"]
                : config.addresses["BNB-PRED LP"]
            }"){
              reserveUSD,
              totalSupply,
              pairHourData(first: 25, orderDirection: desc, orderBy: hourStartUnix){
                hourlyVolumeUSD
              }
            }
          }
              `,
        }),
      }
    )
  ).json();

  // enter APR
  await renderAPR(card, pId, res, dollarValue);

  // enter reward
  let earnedEle = card.querySelector(".earned");
  let earned = await util.pendingPred(pId);
  earned = ethers.utils.formatUnits(earned, 18);
  earnedEle.textContent = formatNumber(earned);
  if (earned <= 0) {
    card.querySelector(".harvest").classList.add("disable-btn");
  } else {
    card.querySelector(".harvest").classList.remove("disable-btn");
  }
  // enter staked
  let stakedEle = card.querySelector(".staked");
  let staked = await util.userStake(pId);
  staked = ethers.utils.formatUnits(staked, token.decimals);
  stakedEle.textContent = formatNumber(staked);

  // enter totalStaked
  await renderTotalStaked(token, card, dollarValue);

  // check if contracts enabled
  const allowance = ethers.utils.formatUnits(
    await util.allowance(pId),
    token.decimals
  );
  if (Number(allowance) > 10 ** 10) {
    card.classList.remove("not-enabled");
    card.classList.add("enabled");
  } else {
    card.classList.add("not-enabled");
    card.classList.remove("enabled");
  }

  dollarValue = ethers.utils.formatUnits(dollarValue, token.decimals);
  let totalDollarValue = dollarValue * earned;
  card.querySelector(".dollar-value").textContent = `$${Number(
    totalDollarValue
  ).toFixed(2)}`;
}

async function populateUI() {
  await document.querySelectorAll(".web3-card").forEach(async (ele, index) => {
    await populateCard(ele);
    if (document.querySelectorAll(".web3-card").length - 1 !== index) return;
    document.querySelector("body").classList.remove("loading");
    document.querySelector("body").classList.add("loaded");
  });
}

async function renderTotalStaked(token, card, dollarValue) {
  let totalEle = card.querySelector(".total-staked");
  let total = await util.totalStaked(token);
  if (card.dataset.pool !== "0") {
    total = await getStakeValue(total, token, dollarValue);
    totalEle.textContent = `$${formatNumber(total, "per")}`;
    return;
  }

  total = ethers.utils.formatUnits(total, token.decimals);
  totalEle.textContent = formatNumber(total);
}

async function getStakeValue(total, token, dollarValue) {
  const totalSupply = await util.totalSupply(token);
  const token0 = await util.token0(token);
  const predPosition = token0 === config.addresses.PRED ? 0 : 1;
  const predLiquidity = (await util.getReserves(token))[predPosition];
  const total$ = predLiquidity
    .mul(2)
    .mul(total)
    .div(totalSupply)
    .mul(dollarValue);
    console.log(ethers.utils.formatUnits(total), 
      ethers.utils.formatUnits(totalSupply), 
      ethers.utils.formatUnits(dollarValue), 
      ethers.utils.formatUnits(predLiquidity), token0, predPosition);
  return ethers.utils.formatUnits(total$, 18 * 2);
}

async function renderAPR(card, id, res, dollarValue) {
  let token = await util.getPoolToken(id);
  let apr;
  if (id === "0") {
    (apr = await util.getStakeApr(id)), token.decimals;
  } else {
    const stake = await util.totalStaked(token);
    const total$ = await getStakeValue(stake, token, dollarValue);
    if (Number(total$) <= 0) {
      apr = 0;
    } else {
      const totalPredPerYr = util.farm.predPerBlock.mul(28800).mul(365);
      const poolPredPerYr = util.pools[id].allocPoint.mul(totalPredPerYr);
      const earnedPred = poolPredPerYr.div(util.farm.totalAllocPoint);
      let dollarValue = (
        await util.getAmountsOut(
          ethers.utils.parseUnits("1"),
          config.addresses.PRED,
          config.addresses.BUSD
        )
      )[1];

      const busd = new ERC20();
      await busd.initialize(
        config.addresses.BUSD,
        config.abis.ERC20,
        util.signer
      );
      dollarValue = ethers.utils.formatUnits(
        dollarValue.mul(earnedPred),
        token.decimals + token.decimals
      );

      apr = (dollarValue / total$) * 100;
    }
    apr = Number(apr) + Number(await getLiqFeeApr(id, res));
  }

  const aprEle = card.querySelector(".apr");
  aprEle.textContent = `${formatNumber(apr, "per")}%`;
}

async function getLiqFeeApr(id, res) {
  const volume24 = res.data.pair
    ? res.data.pair.pairHourData
        .slice(1)
        .reduce((total, value) => (total += Number(value.hourlyVolumeUSD)), 0)
    : 0;
  if (volume24 === 0) return 0;
  const apr = ((volume24 * 365 * 0.17) / 100 / res.data.pair.reserveUSD) * 100;
  return apr;
}

async function populateModal(event) {
  const ele = event.target.closest(".web3-card");
  const pId = ele.dataset.pool;
  const modalId = event.target.dataset.target;
  const modal = document.querySelector(`${modalId}`);
  modal.dataset.pool = pId;
  if (modal.querySelector(".name")) {
    modal.querySelectorAll(".name").forEach(
      ele => ele.textContent = config.pools[pId]
    );
  }
  let token = await util.getPoolToken(pId);
  // enter staked
  if (modal.id === "unstake") {
    let stakedEle = modal.querySelector(".staked");
    let staked = await util.userStake(pId);
    staked = ethers.utils.formatUnits(staked, token.decimals);
    stakedEle.textContent = formatNumber(staked);
  } else {
    // enter balance
    let balEle = modal.querySelector(".balance");
    let bal = await util.getBalance(pId);
    bal = ethers.utils.formatUnits(bal, token.decimals);
    balEle.textContent = formatNumber(bal);
  }
}

function validateNumber(event) {
  //validate is a library to allow only nos
  const check = validate(
    { duration: event.target.value },
    { duration: { numericality: true } }
  );
  const modal = event.target.closest(".modal");
  if (check) {
    const len = event.target.value.length;
    event.target.value = event.target.value.slice(0, len - 1);
    if (
      validate(
        { duration: event.target.value },
        { duration: { numericality: true } }
      )
    )
      event.target.value = "";
  }

  if (event.target.value !== "0" && event.target.value !== "") {
    modal.querySelector(".btn__confirm").classList.remove("disable-btn");
  } else {
    modal.querySelector(".btn__confirm").classList.add("disable-btn");
  }
  return modal;
}

async function checkBalance(modal, event) {
  const poolId = modal.dataset.pool;
  let balance;
  let token = await util.getPoolToken(poolId);
  if (modal.id === "stake") {
    balance = await util.getBalance(poolId);
  } else if (modal.id === "unstake") {
    balance = await util.userStake(poolId);
  }
  let value = event.target.value;
  if (value === "") value = "0";
  value = ethers.utils.parseUnits(value, token.decimals);
  if (balance.lt(value)) {
    modal.classList.add("disable-modal");
  } else {
    modal.classList.remove("disable-modal");
  }
}

async function putMax(event) {
  const parent = event.target.closest(".modal");
  const pId = parent.dataset.pool;
  const input = parent.querySelector("input");
  const token = await util.getPoolToken(pId);
  let bal;
  if (parent.id === "unstake") {
    bal = await util.userStake(pId);
  } else {
    bal = await util.getBalance(pId);
  }
  input.value = ethers.utils.formatUnits(bal, token.decimals);
  if (bal.gt(0)) {
    parent.querySelector(".btn__confirm").classList.remove("disable-btn");
    parent.classList.remove("disable-modal");
  }
}

async function enableContract(event) {
  if (event.target.closest("body").classList.contains("loading")) return;
  const parent = event.target.closest(".web3-card");
  let tx = async () => await util.approve(parent.dataset.pool);
  await sendTx(tx, "Contract Enabled");
}

async function withdraw(event) {
  const parent = event.target.closest(".modal");
  if (
    event.target.classList.contains("disable-btn") ||
    parent.classList.contains("disable-modal")
  )
    return;
  const token = await util.getPoolToken(parent.dataset.pool);
  const input = parent.querySelector("input");
  const amount = ethers.utils.parseUnits(input.value, token.decimals);
  let tx = async () => await util.withdraw(parent.dataset.pool, amount);
  await sendTx(
    tx,
    `Successfully withdrew ${formatNumber(input.value)} ${config.pools[parent.dataset.pool]}`,
    `Failed to withdraw ${formatNumber(input.value)} ${config.pools[parent.dataset.pool]}`
  );
  closeModal("#unstake");
  input.value = "";
}

async function harvest(event) {
  const parent = event.target.closest(".web3-card");
  if (event.target.classList.contains("disable-btn")) return;
  let tx = async () => await util.withdraw(parent.dataset.pool, 0);
  await sendTx(tx, "Harvest successful", "Harvest Transaction failed");
}

async function deposit(event) {
  const parent = event.target.closest(".modal");
  if (
    event.target.classList.contains("disable-btn") ||
    parent.classList.contains("disable-modal")
  )
    return;
  const token = await util.getPoolToken(parent.dataset.pool);
  const input = parent.querySelector("input");
  const amount = ethers.utils.parseUnits(input.value, token.decimals);

  let tx = async () => await util.deposit(parent.dataset.pool, amount);
  await sendTx(
    tx,
    `You successfully staked ${formatNumber(input.value)} ${
      config.pools[parent.dataset.pool]
    }`,
    `Transaction failed to stake ${formatNumber(input.value)} ${
      config.pools[parent.dataset.pool]
    }`
  );
  closeModal("#stake");
  input.value = "";
}

async function compound() {
  let tx = async () => await util.compound();
  await sendTx(
    tx,
    "You successfully compounded",
    "Compounding Transaction failed"
  );
}

function init() {
    fillTokens();
  }
  
  const readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      init();
    }
  }, 10);
  
  const tokensByMC =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h%2C7d";
  
  const fillTokens = async () => {
    const res = await (await fetch(tokensByMC)).json();
    const table = document.querySelector("tbody.custom-scroll");
    let rows = [];
    var formatter = new Intl.NumberFormat("en-US");
    let prices = [];
  
    for (i = 0; i < 10; i++) {
      const {
        name,
        symbol,
        current_price,
        market_cap,
        total_volume,
        circulating_supply,
        price_change_percentage_24h_in_currency: _24hChange,
        price_change_percentage_7d_in_currency: _7dChange,
        sparkline_in_7d,
      } = res[i];
  
      prices.push([sparkline_in_7d.price.map((price) => parseInt(price)), _7dChange]);
  
      src = `https://quickchart.io/chart?c={type:'sparkline',data:{datasets:[{backgroundColor: 'rgba(0, 0, 0, 0.2)',borderColor: 'green', fill:false,data:${prices}}]}}" alt="chart-loss-icon`;
  
      const row = `<tr>
        <td>${name.toUpperCase()} ${symbol.toUpperCase()}</td>
          <td><span>$${formatter.format(current_price.toFixed(2))}</span></td>
          <td><span class=${
            _24hChange < 0 ? "text-red" : "text-green"
          }>${formatter.format(_24hChange.toFixed(2))}%</span>
          </td>
          <td>
            <span class=${
              _7dChange < 0 ? "text-red" : "text-green"
            }>${formatter.format(_7dChange.toFixed(2))}%</span>
          </td>
          <td>$${formatter.format(market_cap)}</td>
          <td class="text-right">  
            <div class="volFVal">$${formatter.format(total_volume)}</div>  
            <div class="volCVal text-lightGray">
            ${formatter.format(
              parseInt(total_volume / current_price)
            )} ${symbol.toUpperCase()}
            </div>
          </td>
          <td>  ${formatter.format(
            circulating_supply
          )} ${symbol.toUpperCase()}</td>
          <td class="text-center">  
            <span class="ChartSicon${i}">      
            </span>
          </td>
          </tr>`;
  
      rows.push(row);
    }
  
    rows = rows.join("\n");
    table.innerHTML = rows;
  
    // $(".ChartSicon").each((index, ele) => {
    //   ele.sparkline(prices[index]);
    // });
  
    prices.forEach((value, index) => {
      $(`.ChartSicon${index}`).sparkline(value[0], {lineColor: value[1] < 0 ? "red" : "green", fillColor: false})
    });
  };
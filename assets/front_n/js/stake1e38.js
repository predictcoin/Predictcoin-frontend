    base_url                   =   $('#base_url').val();
//    localStorage.setItem('network_selectd' ,'');
//alert(localStorage.getItem('network_selectd'));
async function select_network(selectd) {
  $("#walConnect").hide();
  //walConnect.hide()
    if (selectd == "metamask" || selectd == "trustwallet" || selectd == "mathwallet" || selectd == "tokenpocket") {
        if (typeof web3 !== "undefined") {

        window.web3         =   new Web3(web3.currentProvider);

        (async function(){
            const accounts = await ethereum.request({ method: 'eth_accounts' })
            .then()
            .catch((accounts) => {
              if (error.code === 4001) {
                // EIP-1193 userRejectedRequest error
                console.log('Please connect to MetaMask.');
              } else {
                console.error(error);
              }
            });
            
            if (accounts.length == 0) {
            
                $.growl.error({ message: ("Your metamask account is locked please unlock") },{
                    position: {
                        from: "bottom",
                        align: "left"
                    }});           
                
                enableAccount();
            
            }
            else
            {
                accounts1           =   accounts;   
                let regUserData   =   {"address" : accounts1[0]};
                console.log(regUserData);
                socket.emit('regUser',base_url,regUserData);
                start_loader(); 
                    socket.on('register_emi', function(response){console.log(base_url+'login/'+accounts1[0]);
                      stop_loader(); 
                        $.growl.notice({ message: ("Congratulation, You are Logged in <br>successfully ") });
                                localStorage.setItem('network_selectd','metamask');
                                localStorage.setItem('wallet_connection',true);
                                location.href   =   base_url+'login/'+accounts1[0];

                    })  
            }
        })();
    }
    else 
    {
        $.growl.error({ message: ("Metamask extension not added on your browser") });   
    }        
    } else if(selectd == "binance"){        
        //await BinanceChain.enable();
        //window.web3 = new window.Web3(window.BinanceChain);
    if (typeof BinanceChain !== "undefined") {
      select_binance();
      async function select_binance()
      {
      var testdapp = await BinanceChain.enable();
      window.web3 = new window.Web3(window.BinanceChain);
      
    setTimeout(function() {
        BinanceChain.isConnected().then(function(testc) {
            if (testc == true) {
                BinanceChain.request({
                    method: "eth_accounts"
                }).then(function(accounts) {
                accounts1           =   accounts;   
                let regUserData   =   {"address" : accounts1[0]};
                console.log(regUserData);
                socket.emit('regUser',base_url,regUserData);
                start_loader(); 
                    socket.on('register_emi', function(response){console.log(base_url+'login/'+accounts1[0]);
                        $.growl.notice({ message: ("Binance wallet successfully connected") });
                                localStorage.setItem('network_selectd','binance');
                                localStorage.setItem('wallet_connection',true);
                                location.href   =   base_url+'login/'+accounts1[0];

        localStorage.setItem('network_selectd', "binance");
        $.growl.notice({
            message: ("Binance wallet successfully connected.")
        });
        setTimeout(function() {
            window.location.href = "";
        }, 2000);
                    })

                });
            }
        });
 }, 1500);


      }
    }else{
       localStorage.setItem('network_selectd' ,'');
      $.growl.error({ message: ("Binance Smart Chain extension not added on your browser") });
    }        

    } else if(selectd == "walletconnect"){

      const WalletConnectProvider = window.WalletConnectProvider.default;
      const ropstenProvider = new WalletConnectProvider({
        infuraId:"2b5fa78a0cee4c4c9d2928a34906db2c" ,      
      rpc: {97: "https://data-seed-prebsc-1-s1.binance.org:8545/", }
      });

      onConnect();
      async function onConnect() {
          try{
            await ropstenProvider.enable();
            $.growl.notice({ message: ("Walletconnect successfully connected.") });
            localStorage.setItem('network_selectd' , '');
            await refreshAccountData();
          }catch(e){
            localStorage.setItem('network_selectd' , '');
            console.log("Could not get a wallet connection", e);
            window.location.reload();
          return;
          }

      }

      async function fetchAccountData() {

         web3 = new Web3(ropstenProvider);  
          const accounts = await web3.eth.getAccounts(); 
            accounts1           =   accounts;   
            let regUserData   =   {"address" : accounts1[0]};
            console.log(regUserData);
            socket.emit('regUser',base_url,regUserData);
                start_loader();
                  
          socket.on('register_emi', function(response){console.log(base_url+'login/'+accounts1[0]);
            stop_loader(); 
              $.growl.notice({ message: ("Congratulation, You are Logged in <br>successfully ") });
                      localStorage.setItem('network_selectd','walletconnect');
                      localStorage.setItem('wallet_connection',true);
                      location.href   =   base_url+'login/'+accounts1[0];

          })
      }

      async function refreshAccountData() {
        await fetchAccountData(ropstenProvider);
      }    

    }
}
    async function enableAccount() {

      const accounts    =   await ethereum.enable();
      start_loader(); 
      accounts1         =   accounts;
//    $("#connect_metamask").hide();
//   $('.headerRight').append(accounts1);
    localStorage.setItem('network_selectd','metamask');
    localStorage.setItem('wallet_connection',true);
    stop_loader(); 
    setTimeout(function(){ 
      document.getElementById("connect_wallet_metamask").click();
    }, 3000);

    }
//alert(localStorage.getItem('network_selectd'));
if (localStorage.getItem('network_selectd') == "binance") {
    
    //await BinanceChain.enable();
    //redeclare
setTimeout(function(){
    
    const m_contract_abi = [{"inputs":[{"internalType":"contract PredictCoin","name":"_reward","type":"address"},{"internalType":"contract PredictCoinBar","name":"_syrup","type":"address"},{"internalType":"address","name":"_devaddr","type":"address"},{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"_startBlock","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"SetDevAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"brewPerBlock","type":"uint256"}],"name":"SetEmissionRate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"SetFeeAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BONUS_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IBEP20","name":"_lpToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_devaddr","type":"address"}],"name":"dev","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devaddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"enterStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"getMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"leaveStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingreward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"poolAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IBEP20","name":"","type":"address"}],"name":"poolExistence","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IBEP20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accrewardPerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reward","outputs":[{"internalType":"contract PredictCoin","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"syrup","outputs":[{"internalType":"contract PredictCoinBar","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"multiplierNumber","type":"uint256"}],"name":"updateMultiplier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const m_contracts_address ='0x50d3E3bEb2EF9A2fdA6f9bE2402E700a81A20984';
    const m_tokencontract_abi =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];                    

    const predict_contract_abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const predict_contracts_address ='0x0B60d31DEe81Ba0d333c513B59ea5C7d080aa4d6';

    window.web3 = new window.Web3(window.BinanceChain);
    var McontractInfo = (m_contract_abi);
    var MTokencontractInfo = (m_tokencontract_abi);
    var PredictcontractInfo = (predict_contract_abi);
    m_contract = new web3.eth.Contract(McontractInfo, m_contracts_address);    
     let searchParams = new URLSearchParams(window.location.search) 
     let param = searchParams.get('token');
        var ff = web3.eth.net.getId();
            ff.then(function(result) {
                if (result == 97) {                                                           
                    $(document).on('click', '.add_liq', function() {
                    var allocPoint = $("#alloc_point").val(); ///alert(allocPoint);
                    var token_address = $("#token_address").val(); //alert(token_address);
                    var bool = $("#update_bool").val(); //alert(bool);
                    let get_token = new web3.eth.Contract(MTokencontractInfo, token_address);
                    if (allocPoint != "" && token_address != "") {
                        start_loader();
                                    BinanceChain.request({
                                    method: "eth_accounts"
                                    }).then(function(accounts) {
                                        m_contract.methods.add(allocPoint, token_address, bool).send({
                                            from: accounts[0]
                                        }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                            stop_loader();
                                            $.growl.notice({
                                                message: ("Liquitidy Pool successfully added.")
                                            });
                                        get_token.methods.symbol().call().then(function(token_name) {                                        
                                        $.ajax({
                                            url: base_url + "addpair",
                                            type: "POST",
                                            data: {
                                                token: token_name,                                                
                                                token_address: token_address,                                                
                                                img:'https://icons.bitbot.tools/api/'+token_name+'/64x64',                                                
                                                from_address: accounts[0],
                                                to_address: m_contracts_address,                
                                                allocPoint: allocPoint
                                            },
                                            dataType: "JSON",
                                            success: function(resp) {

                                            }
                                        })
                                        })
                                        /*setTimeout(function() {
                                            window.location.href = base_url + "staking";
                                        }, 5000);*/
                                        }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                            stop_loader();
                                            $.growl.error({
                                                message: (error.message)
                                            });
                                        });
                                    });
                            } else {
                                stop_loader();
                                $.growl.error({
                                    message: ("Please enter value all fields.")
                                });
                            }
                        });

                    if(current_page == 'farming'){//start_loader();
                        $.ajax({
                            url: base_url + "/getpoollist",
                            type: "POST",
                            data: {
                                value: ""
                            },
                            dataType: "JSON",
                            success: function(resp) {
                                console.log(resp);
                                if (typeof web3 !== "undefined") {
                                    /*web3.eth.getAccounts(function(err, accounts) {*/
                                            var value_pool_list = ''; 
                                            for (let i = 0; i < resp.length; i++) { 
                                                let token = resp[i].token;
                                                let token_address = resp[i].token_address;
                                                let img_pair = resp[i].img;                                                
                                                let allocPoint = resp[i].allocPoint; 
                                                let token_id = +[i]+1;            
                                                var img_url = base_url+'assets/front_n/images/coins/'+img_pair;
                                                var imgs = img_pair.split('.')[0]
                                                $("#token_image_"+[i]).attr("src",img_url);
                                                $("#token_name_"+[i]).html(token+' Token');
                                                $("#token_detail_"+[i]).html('Deposit '+token+' Token');
                                                $("#token_apy_"+[i]).html(allocPoint);                                               
                                                $("#token_stack_"+[i]+" a").attr('href',function(i,str) {return 'farm/?token='+token_address+'&coin='+imgs;});
                                            }
                                        
                                    /*});*/
                                }
                            }
                            
                        });
                        $('.load_stake').fadeIn('slow');
                        stop_loader();
                    if($('#stacks').is(":disabled")){
                        $.growl.error({message: ("Please Connect Metamask")});
                    }

                    }

                    if(current_page == 'farm'){
                        const queryString = window.location.search;
                        const urlParams = new URLSearchParams(queryString);
                        const tokens = urlParams.get('token');
                        const coin = urlParams.get('coin');
                        //var tokenstr = tokens.slice(-1);
                        m_contract.methods.poolAddress(tokens).call().then(function(pool_no) { 
                        BinanceChain.request({
                                method: "eth_accounts"
                            }).then(function(accounts) {  
                            if (accounts.length != 0) {                            //alert(accounts[0]);
                            m_contract.methods.poolInfo(pool_no).call().then(function(stack_token) {
                            

                            pairaddresss = stack_token.lpToken;
                            let get_stakes = new web3.eth.Contract(MTokencontractInfo, pairaddresss);
                            get_stakes.methods.symbol().call().then(function(pair_symbol) {
                            pairsymbol = pair_symbol;
                                
                            get_stakes.methods.balanceOf(accounts[0]).call().then(function(get_stake_balance) {
                                m_contract.methods.userInfo(pool_no,accounts[0]).call().then(function(user_info) {
                                   m_contract.methods.pendingreward(pool_no,accounts[0]).call().then(function(reward) {
                                    let img = base_url+'assets/front_n/images/coins/'+coin+'.png';
                                    //alert(get_stake_balance);
                                $("#stack_token_image").attr("src",img);
                                $("#stack_token_detail").html('Deposit '+pairsymbol);
                                $("#stack_token_apy").html(stack_token.allocPoint);
                                $("#stack_token_balance").html(get_stake_balance / 10**18);
                                $("#stack_token_image1").attr("src",img);
                                $("#stack_token_detail1").html('Deposit '+pairsymbol);
                                $("#stack_token_apy1").html(stack_token.allocPoint);
                                $("#stack_token_balance1").html(get_stake_balance / 10**18);

                                if(user_info.amount!='0'){
                                $("#stacked_amount").html(user_info.amount / 10**18);                                
                                $("#reward_amount").html(reward / 10**18);
                                $("#approve_unstack").attr('enabled','enabled');
                                $("#reward_harvest").attr('enabled','enabled');                                                                                                    
                                } else {
                                //$("#stacked_amount_div").hide();
                                $("#reward_amount_div").hide();
                                $("#approve_unstack").attr('disabled','disabled');
                                $("#reward_harvest").attr('disabled','disabled');
                                }

                                $('#approve_stake').attr('selectd_contract_add', m_contracts_address);
                                $('#approve_stake').attr('selectd_stack_add', pairaddresss);
                                $('#reward_harvest').attr('selectd_contract_add', m_contracts_address);
                                $('#reward_harvest').attr('selectd_stack_add', pairaddresss);
                                $('#approve_unstack').attr('selectd_contract_add', m_contracts_address);
                                $('#approve_unstack').attr('selectd_stack_add', pairaddresss);

                                if(get_stake_balance == '0' && user_info.amount=='0'){
                                //$('.stHrSubmit').append("<button class='btn btn-primary btn-15845 btn-radius'>Insufficient fund</button>");                                    
                                    $("#insufficient").show();
                                    $("#approve_stake").hide();
                                    $("#approve_unstack").attr('disabled','disabled');
                                    $("#reward_harvest").attr('disabled','disabled');
                                    //$("#reward_harvest").hide();
                                    //$("#st_amt").hide();                                            
                                  } else if(get_stake_balance == '0'){
                                    $("#insufficient").show();
                                    $("#approve_stake").hide();
                                  }else {
                                    $("#insufficient").hide();
                                  }                                   
                                  $('.load_stake').fadeIn('slow');  
                                });stop_loader();                                
                            });
                                });
                            });
                            });
                            
                            }
                         });                         
                                           
                            $(document).on('click', '#approve_stake', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add'); 
                                deposit_amount = $("#stake_amount").val(); alert(deposit_amount);
                                deposit_amount = parseFloat(deposit_amount) * 10 ** 18; //alert(BigInt(deposit_amount));
                                token_contract = new web3.eth.Contract(MTokencontractInfo, selectd_stack_add);
                                if (deposit_amount > 0) { //val = web3.utils.toBN('1000000000000000000000');
                                    BinanceChain.request({
                                            method: "eth_accounts"
                                        }).then(function(accounts1) {  
                                            //deposit_count = parseFloat(count) + 1;
                                            token_contract.methods.approve(selectd_contract_add, BigInt(deposit_amount)).send({
                                                from: accounts1[0]
                                            }).on('receipt', (receipt) => {
                                                $.growl.notice({
                                                    title: "Please Note",
                                                    message: ("Approve Transaction Success !!!")
                                                }, {})
                                                token_contract.methods.balanceOf(accounts1[0]).call().then(function(balance) {
                                                    if (balance >= deposit_amount) {
                                                        token_contract.methods.allowance(accounts1[0], selectd_contract_add).call().then(function(allowance) {
                                                            if (allowance >= deposit_amount) {
                                                                m_contract.methods.deposit(pool_no, BigInt(deposit_amount)).send({
                                                                    from: accounts1[0]
                                                                }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                                                    $.growl.notice({
                                                                        title: "Please Note",
                                                                        message: ("Stake Transaction Success !!!")
                                                                    }, {});
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                    setTimeout(function() {
                                                                        window.location.href = "";
                                                                    }, 5000);
                                                                }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                                    $.growl.error({
                                                                        message: ("Sending Transaction Failed !!!")
                                                                    }, {})
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                });
                                                            } else {
                                                                $.growl.error({
                                                                    message: ("Sending Transaction Failed, Low Allowance !!!")
                                                                }, {})
                                                                $('.show_text').hide();
                                                                stop_loader();
                                                            }
                                                        });
                                                    } else {
                                                        $.growl.error({
                                                            message: ("Sending Transaction Failed, Low balance !!!")
                                                        }, {})
                                                        $('.show_text').hide();
                                                        stop_loader();
                                                    }
                                                });
                                            }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                $.growl.error({
                                                    message: ("Sending Transaction Failed !!!")
                                                }, {})
                                                $('.show_text').hide();
                                                stop_loader();
                                            });
                                        
                                    });
                                } else {
                                    $.growl.error({
                                        message: ("Sending Transaction Failed, please fill stake amount !!!")
                                    }, {})
                                    $('.show_text').hide();
                                    stop_loader();
                                }
                            });                     
                                           
                       
                            $(document).on('click', '#approve_unstack', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add');
                                withdraw_amount = $("#unstake_amount").val();                                  
                                withdraw_amount = parseFloat(withdraw_amount) * 10 ** 18; 
                                if (withdraw_amount > 0) {
                                BinanceChain.request({
                                        method: "eth_accounts"
                                    }).then(function(accounts) {  
                                    m_contract.methods.withdraw(pool_no, BigInt(withdraw_amount)).send({
                                        from: accounts[0]   
                                    }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                        stop_loader();
                                        $.growl.notice({
                                            message: ("Successfully withdrawn.")
                                        });
                                        setTimeout(function() {
                                            window.location.href = "";
                                        }, 3000);
                                    }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                        stop_loader();
                                        $.growl.error({
                                            message: (error.message)
                                        });
                                    });
                                });
                              } else {
                                    $.growl.error({
                                        message: ("Unstack Transaction Failed, please fill unstack amount !!!")
                                    }, {})
                                     stop_loader();
                                  }
                            })


                            $(document).on('click', '#reward_harvest', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add');
                                harvest_amount = 0;                                
                                BinanceChain.request({
                                        method: "eth_accounts"
                                    }).then(function(accounts) {  
                                    m_contract.methods.withdraw(pool_no, BigInt(harvest_amount)).send({
                                        from: accounts[0]   
                                    }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                        stop_loader();
                                        $.growl.notice({
                                            message: ("Successfully harvest.")
                                        });
                                        setTimeout(function() {
                                            window.location.href = "";
                                        }, 3000);
                                    }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                        stop_loader();
                                        $.growl.error({
                                            message: (error.message)
                                        });
                                    });
                                });

                            })

                            });
                           } 

                    if(current_page == 'staking'){start_loader();
                        $.ajax({
                            url: base_url + "/getpoollist",
                            type: "POST",
                            data: {
                                value: ""
                            },
                            dataType: "JSON",
                            success: function(resp) {
                                console.log(resp);                                
                                            var value_pool_list = '';
                                                let token = resp[0].token;
                                                let token_address = resp[0].token_address;
                                                let img_pair = base_url+'assets/front_n/images/coins/pred.svg';
                                                let allocPoint = resp[0].allocPoint;
                                                
                                                $("#token_image").attr("src",img_pair);
                                                $("#token_name").html(token);
                                                $("#token_detail").html('Deposit '+token);
                                                $("#token_apy").html(allocPoint);                                               
                                                $("#token_stack a").attr('href',function(i,str) {return str + '?token='+token_address;});
                                }
                            });                           
                        $('.load_stake').fadeIn('slow');
                        stop_loader();
                    if($('#stacks').is(":disabled")){
                        $.growl.error({message: ("Please Connect Metamask")});
                    }
                     
                }
                    if(current_page == 'stack'){//start_loader();
                        const queryString = window.location.search;
                        const urlParams = new URLSearchParams(queryString);
                        const tokens = urlParams.get('token');
                        //var tokenstr = tokens.slice(-1);
                        m_contract.methods.poolAddress(tokens).call().then(function(pool_no) { 
                          BinanceChain.request({
                                  method: "eth_accounts"
                              }).then(function(accounts) {
                            if (accounts.length != 0) {                            //alert(accounts[0]);
                            m_contract.methods.poolInfo(pool_no).call().then(function(stack_token) {
                            

                            pairaddresss = stack_token.lpToken;
                            let predict_contracts = new web3.eth.Contract(PredictcontractInfo, pairaddresss);   
                            predict_contracts.methods.symbol().call().then(function(pair_symbol) {
                            pairsymbol = pair_symbol;
                                
                            predict_contracts.methods.balanceOf(accounts[0]).call().then(function(get_stake_balance) {
                                m_contract.methods.userInfo(pool_no,accounts[0]).call().then(function(user_info) {
                                   m_contract.methods.pendingreward(pool_no,accounts[0]).call().then(function(reward) {
                                let img = base_url+'assets/front_n/images/coins/pred.svg';
                                $("#stack_token_image").attr("src",img);                                
                                $("#stack_token_detail").html('Deposit '+pairsymbol+' Token');
                                $("#stack_token_apy").html(stack_token.allocPoint);                                    
                                $("#stack_token_balance").html(get_stake_balance / 10**18);
                                $("#stack_token_image1").attr("src",img);                                
                                $("#stack_token_detail1").html('Deposit '+pairsymbol+' Token');
                                $("#stack_token_apy1").html(stack_token.allocPoint);                                    
                                $("#stack_token_balance1").html(get_stake_balance / 10**18);                                
                                if(user_info.amount!='0'){
                                $("#stacked_amount").html(user_info.amount / 10**18);                                
                                $("#reward_amount").html(reward / 10**18);                                                                                                    
                                } else {
                                //$("#stacked_amount_div").hide();
                                $("#reward_amount_div").hide();
                                }
                                $('#approve_contract1').attr('selectd_contract_add', m_contracts_address);
                                $('#approve_contract1').attr('selectd_stack_add', pairaddresss);
                                $('#reward_harvest').attr('selectd_contract_add', m_contracts_address);
                                $('#reward_harvest').attr('selectd_stack_add', pairaddresss);
                                if(get_stake_balance == '0' && user_info.amount =='0'){
                                //$('.stHrSubmit').append("<button class='btn btn-primary btn-15845 btn-radius'>Insufficient fund</button>");
                                    $("#approve_contract1").hide();
                                    $("#reward_harvest").attr('disabled','disabled');                                    
                                    //$("#reward_harvest1").hide();
                                    //$("#st_amt").hide();                                            
                                    } else {
                                    $("#insufficient").hide();
                                  }                                     
                                    
                                });
                                   $('.load_stake').fadeIn('slow');
                                   stop_loader();                                
                            });
                                });
                            });
                            });
                            
                            }
                         });                         
                                           
                            $(document).on('click', '#approve_contract1', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add'); 
                                deposit_amount = $("#stake_amount1").val(); 
                                deposit_amount = parseFloat(deposit_amount) * 10 ** 18;
                                predtoken_contract = new web3.eth.Contract(PredictcontractInfo, selectd_stack_add);
                                if (deposit_amount > 0) {
                                    BinanceChain.request({
                                            method: "eth_accounts"
                                        }).then(function(accounts1) {                                        
                                            //deposit_count = parseFloat(count) + 1;
                                            predtoken_contract.methods.approve(selectd_contract_add, BigInt(deposit_amount)).send({
                                                from: accounts1[0]
                                            }).on('receipt', (receipt) => {
                                                $.growl.notice({
                                                    title: "Please Note",
                                                    message: ("Approve Transaction Success !!!")
                                                }, {})
                                                predtoken_contract.methods.balanceOf(accounts1[0]).call().then(function(balance) {
                                                    if (balance >= deposit_amount) {
                                                        predtoken_contract.methods.allowance(accounts1[0], selectd_contract_add).call().then(function(allowance) {
                                                            if (allowance >= deposit_amount) {
                                                                m_contract.methods.enterStaking(BigInt(deposit_amount)).send({
                                                                    from: accounts1[0]
                                                                }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                                                    $.growl.notice({
                                                                        title: "Please Note",
                                                                        message: ("Stake Transaction Success !!!")
                                                                    }, {});
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                    setTimeout(function() {
                                                                        window.location.href = "";
                                                                    }, 5000);
                                                                }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                                    $.growl.error({
                                                                        message: ("Sending Transaction Failed !!!")
                                                                    }, {})
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                });
                                                            } else {
                                                                $.growl.error({
                                                                    message: ("Sending Transaction Failed, Low Allowance !!!")
                                                                }, {})
                                                                $('.show_text').hide();
                                                                stop_loader();
                                                            }
                                                        });
                                                    } else {
                                                        $.growl.error({
                                                            message: ("Sending Transaction Failed, Low balance !!!")
                                                        }, {})
                                                        $('.show_text').hide();
                                                        stop_loader();
                                                    }
                                                });
                                            }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                $.growl.error({
                                                    message: ("Sending Transaction Failed !!!")
                                                }, {})
                                                $('.show_text').hide();
                                                stop_loader();
                                            });
                                        
                                    });
                                } else {
                                    $.growl.error({
                                        message: ("Sending Transaction Failed, please fill stack amount !!!")
                                    }, {})
                                    $('.show_text').hide();
                                    stop_loader();
                                }
                            });                     
                                           
                       
                            $(document).on('click', '#approve_unstack_pred', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add');
                                withdraw_amount = $("#stake_amount").val();                                  
                                withdraw_amount = parseFloat(withdraw_amount) * 10 ** 18;
                                if (withdraw_amount > 0) {
                                BinanceChain.request({
                                        method: "eth_accounts"
                                    }).then(function(accounts) {
                                    m_contract.methods.leaveStaking(BigInt(withdraw_amount)).send({
                                        from: accounts[0]   
                                    }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                        stop_loader();
                                        $.growl.notice({
                                            message: ("Successfully withdrawn.")
                                        });
                                        setTimeout(function() {
                                            window.location.href = "";
                                        }, 3000);
                                    }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                        stop_loader();
                                        $.growl.error({
                                            message: (error.message)
                                        });
                                    });
                                });
                              } else {
                                    $.growl.error({
                                        message: ("Unstack Transaction Failed, please fill unstack amount !!!")
                                    }, {})
                                     stop_loader();
                                  }                                
                            })
                            });
                           }                     

                }
                });   
                 }, 1000);

    } else if(localStorage.getItem('network_selectd') == "metamask") {
  
setTimeout(function(){    
    const m_contract_abi = [{"inputs":[{"internalType":"contract PredictCoin","name":"_reward","type":"address"},{"internalType":"contract PredictCoinBar","name":"_syrup","type":"address"},{"internalType":"address","name":"_devaddr","type":"address"},{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"_startBlock","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"SetDevAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"brewPerBlock","type":"uint256"}],"name":"SetEmissionRate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"SetFeeAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BONUS_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IBEP20","name":"_lpToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_devaddr","type":"address"}],"name":"dev","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devaddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"enterStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"getMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"leaveStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingreward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"poolAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IBEP20","name":"","type":"address"}],"name":"poolExistence","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IBEP20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accrewardPerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reward","outputs":[{"internalType":"contract PredictCoin","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"syrup","outputs":[{"internalType":"contract PredictCoinBar","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"multiplierNumber","type":"uint256"}],"name":"updateMultiplier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const m_contracts_address ='0x50d3E3bEb2EF9A2fdA6f9bE2402E700a81A20984';
    const m_tokencontract_abi =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];                    

    const predict_contract_abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const predict_contracts_address ='0x0B60d31DEe81Ba0d333c513B59ea5C7d080aa4d6';

  

    window.web3 = new Web3(web3.currentProvider);
    var McontractInfo = (m_contract_abi);
    var MTokencontractInfo = (m_tokencontract_abi);
    var PredictcontractInfo = (predict_contract_abi);    
    m_contract = new web3.eth.Contract(McontractInfo, m_contracts_address);    
     let searchParams = new URLSearchParams(window.location.search) 
     let param = searchParams.get('token');
        var ff = web3.eth.net.getId();
            ff.then(function(result) {
                if (result == 97) {                                                           
                    $(document).on('click', '.add_liq', function() {
                    var allocPoint = $("#alloc_point").val(); //alert(allocPoint);
                    var token_address = $("#token_address").val(); //alert(token_address);
                    var bool = $("#update_bool").val(); //alert(bool);
                    let get_token = new web3.eth.Contract(MTokencontractInfo, token_address);
                    if (allocPoint != "" && token_address != "") {
                        start_loader();
                                    web3.eth.getAccounts(function(err, accounts) {
                                        m_contract.methods.add(allocPoint, token_address, bool).send({
                                            from: accounts[0]
                                        }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                            stop_loader();
                                            $.growl.notice({
                                                message: ("Liquitidy Pool successfully added.")
                                            });
                                        get_token.methods.symbol().call().then(function(token_name) {                                        
                                        $.ajax({
                                            url: base_url + "addpair",
                                            type: "POST",
                                            data: {
                                                token: token_name,                                                
                                                token_address: token_address,                                                
                                                img:'https://icons.bitbot.tools/api/'+token_name+'/64x64',                                                
                                                from_address: accounts[0],
                                                to_address: m_contracts_address,                
                                                allocPoint: allocPoint
                                            },
                                            dataType: "JSON",
                                            success: function(resp) {

                                            }
                                        })
                                        })
                                        /*setTimeout(function() {
                                            window.location.href = base_url + "staking";
                                        }, 5000);*/
                                        }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                            stop_loader();
                                            $.growl.error({
                                                message: (error.message)
                                            });
                                        });
                                    });
                            } else {
                                stop_loader();
                                $.growl.error({
                                    message: ("Please enter value all fields.")
                                });
                            }
                        });
                    if(current_page == 'staking'){start_loader();
                        $.ajax({
                            url: base_url + "/getpoollist",
                            type: "POST",
                            data: {
                                value: ""
                            },
                            dataType: "JSON",
                            success: function(resp) {
                                console.log(resp);                                
                                            var value_pool_list = '';
                                                let token = resp[0].token;
                                                let token_address = resp[0].token_address;
                                                let img_pair = base_url+'assets/front_n/images/coins/pred.svg';
                                                let allocPoint = resp[0].allocPoint;
                                                
                                                $("#token_image").attr("src",img_pair);
                                                $("#token_name").html(token);
                                                $("#token_detail").html('Deposit '+token);
                                                $("#token_apy").html(allocPoint);                                               
                                                $("#token_stack a").attr('href',function(i,str) {return str + '?token='+token_address;});
                                }
                            });                           
                        $('.load_stake').fadeIn('slow');
                        stop_loader();
                    if($('#stacks').is(":disabled")){
                        $.growl.error({message: ("Please Connect Metamask")});
                    }
                     
                }

                    if(current_page == 'farming'){//start_loader();
                        $.ajax({
                            url: base_url + "/getpoollist",
                            type: "POST",
                            data: {
                                value: ""
                            },
                            dataType: "JSON",
                            success: function(resp) {
                                console.log(resp);
                                if (typeof web3 !== "undefined") {
                                    /*web3.eth.getAccounts(function(err, accounts) {*/
                                            var value_pool_list = ''; 
                                            for (let i = 0; i < resp.length; i++) { 
                                                let token = resp[i].token;
                                                let token_address = resp[i].token_address;
                                                let img_pair = resp[i].img;                                                
                                                let allocPoint = resp[i].allocPoint; 
                                                let token_id = +[i]+1;            
                                                var img_url = base_url+'assets/front_n/images/coins/'+img_pair;
                                                var imgs = img_pair.split('.')[0]
                                                $("#token_image_"+[i]).attr("src",img_url);
                                                $("#token_name_"+[i]).html(token+' Farming');
                                                $("#token_detail_"+[i]).html('Deposit '+token+' Token');
                                                $("#token_apy_"+[i]).html(allocPoint);                                               
                                                $("#token_stack_"+[i]+" a").attr('href',function(i,str) {return 'farm/?token='+token_address+'&coin='+imgs;});
                                            }
                                        
                                    /*});*/
                                }
                            }
                            
                        });
                        $('.load_stake').fadeIn('slow');
                        stop_loader();
                    if($('#stacks').is(":disabled")){
                        $.growl.error({message: ("Please Connect Metamask")});
                    }

                    }

                    if(current_page == 'stack'){//start_loader();
                        const queryString = window.location.search;
                        const urlParams = new URLSearchParams(queryString);
                        const tokens = urlParams.get('token');
                        //var tokenstr = tokens.slice(-1);
                        m_contract.methods.poolAddress(tokens).call().then(function(pool_no) { 
                        web3.eth.getAccounts(function(err, accounts) {
                            if (accounts.length != 0) {                            //alert(accounts[0]);
                            m_contract.methods.poolInfo(pool_no).call().then(function(stack_token) {
                            

                            pairaddresss = stack_token.lpToken;
                            let predict_contracts = new web3.eth.Contract(PredictcontractInfo, pairaddresss);   
                            predict_contracts.methods.symbol().call().then(function(pair_symbol) {
                            pairsymbol = pair_symbol;
                                
                            predict_contracts.methods.balanceOf(accounts[0]).call().then(function(get_stake_balance) {
                                m_contract.methods.userInfo(pool_no,accounts[0]).call().then(function(user_info) {
                                   m_contract.methods.pendingreward(pool_no,accounts[0]).call().then(function(reward) {
                                let img = base_url+'assets/front_n/images/coins/pred.svg';
                                $("#stack_token_image").attr("src",img);                                
                                $("#stack_token_detail").html('Deposit '+pairsymbol+' Token');
                                $("#stack_token_apy").html(stack_token.allocPoint);                                    
                                $("#stack_token_balance").html(get_stake_balance / 10**18);
                                $("#stack_token_image1").attr("src",img);                                
                                $("#stack_token_detail1").html('Deposit '+pairsymbol+' Token');
                                $("#stack_token_apy1").html(stack_token.allocPoint);                                    
                                $("#stack_token_balance1").html(get_stake_balance / 10**18);                                
                                if(user_info.amount!='0'){
                                $("#stacked_amount").html(user_info.amount / 10**18);                                
                                $("#reward_amount").html(reward / 10**18);                                                                                                    
                                } else {
                                //$("#stacked_amount_div").hide();
                                $("#reward_amount_div").hide();
                                }
                                $('#approve_contract1').attr('selectd_contract_add', m_contracts_address);
                                $('#approve_contract1').attr('selectd_stack_add', pairaddresss);
                                $('#reward_harvest').attr('selectd_contract_add', m_contracts_address);
                                $('#reward_harvest').attr('selectd_stack_add', pairaddresss);
                                if(get_stake_balance == '0' && user_info.amount =='0'){
                                //$('.stHrSubmit').append("<button class='btn btn-primary btn-15845 btn-radius'>Insufficient fund</button>");
                                    $("#approve_contract1").hide();
                                    $("#reward_harvest").attr('disabled','disabled');                                    
                                    //$("#reward_harvest1").hide();
                                    //$("#st_amt").hide();                                            
                                    } else {
                                    $("#insufficient").hide();
                                  }                                     
                                    
                                });
                                   $('.load_stake').fadeIn('slow');
                                   stop_loader();                                
                            });
                                });
                            });
                            });
                            
                            }
                         });                         
                                           
                            $(document).on('click', '#approve_contract1', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add'); 
                                deposit_amount = $("#stake_amount1").val(); 
                                deposit_amount = parseFloat(deposit_amount) * 10 ** 18;
                                predtoken_contract = new web3.eth.Contract(PredictcontractInfo, selectd_stack_add);
                                if (deposit_amount > 0) {
                                    web3.eth.getAccounts(function(err, accounts1) {                                        
                                            //deposit_count = parseFloat(count) + 1;
                                            predtoken_contract.methods.approve(selectd_contract_add, BigInt(deposit_amount)).send({
                                                from: accounts1[0]
                                            }).on('receipt', (receipt) => {
                                                $.growl.notice({
                                                    title: "Please Note",
                                                    message: ("Approve Transaction Success !!!")
                                                }, {})
                                                predtoken_contract.methods.balanceOf(accounts1[0]).call().then(function(balance) {
                                                    if (balance >= deposit_amount) {
                                                        predtoken_contract.methods.allowance(accounts1[0], selectd_contract_add).call().then(function(allowance) {
                                                            if (allowance >= deposit_amount) {
                                                                m_contract.methods.enterStaking(BigInt(deposit_amount)).send({
                                                                    from: accounts1[0]
                                                                }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                                                    $.growl.notice({
                                                                        title: "Please Note",
                                                                        message: ("Stake Transaction Success !!!")
                                                                    }, {});
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                    setTimeout(function() {
                                                                        window.location.href = "";
                                                                    }, 5000);
                                                                }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                                    $.growl.error({
                                                                        message: ("Sending Transaction Failed !!!")
                                                                    }, {})
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                });
                                                            } else {
                                                                $.growl.error({
                                                                    message: ("Sending Transaction Failed, Low Allowance !!!")
                                                                }, {})
                                                                $('.show_text').hide();
                                                                stop_loader();
                                                            }
                                                        });
                                                    } else {
                                                        $.growl.error({
                                                            message: ("Sending Transaction Failed, Low balance !!!")
                                                        }, {})
                                                        $('.show_text').hide();
                                                        stop_loader();
                                                    }
                                                });
                                            }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                $.growl.error({
                                                    message: ("Sending Transaction Failed !!!")
                                                }, {})
                                                $('.show_text').hide();
                                                stop_loader();
                                            });
                                        
                                    });
                                } else {
                                    $.growl.error({
                                        message: ("Sending Transaction Failed, please fill stack amount !!!")
                                    }, {})
                                    $('.show_text').hide();
                                    stop_loader();
                                }
                            });                     
                                           
                       
                            $(document).on('click', '#approve_unstack_pred', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add');
                                withdraw_amount = $("#stake_amount").val();                                  
                                withdraw_amount = parseFloat(withdraw_amount) * 10 ** 18;
                                if (withdraw_amount > 0) {
                                web3.eth.getAccounts(function(err, accounts) {
                                    m_contract.methods.leaveStaking(BigInt(withdraw_amount)).send({
                                        from: accounts[0]   
                                    }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                        stop_loader();
                                        $.growl.notice({
                                            message: ("Successfully withdrawn.")
                                        });
                                        setTimeout(function() {
                                            window.location.href = "";
                                        }, 3000);
                                    }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                        stop_loader();
                                        $.growl.error({
                                            message: (error.message)
                                        });
                                    });
                                });
                              } else {
                                    $.growl.error({
                                        message: ("Unstack Transaction Failed, please fill unstack amount !!!")
                                    }, {})
                                     stop_loader();
                                  }                                
                            })
                            });
                           } 

                    if(current_page == 'farm'){
                        const queryString = window.location.search;
                        const urlParams = new URLSearchParams(queryString);
                        const tokens = urlParams.get('token');
                        const coin = urlParams.get('coin');
                        //var tokenstr = tokens.slice(-1);
                        m_contract.methods.poolAddress(tokens).call().then(function(pool_no) { 
                        web3.eth.getAccounts(function(err, accounts) {
                            if (accounts.length != 0) {                            //alert(accounts[0]);
                            m_contract.methods.poolInfo(pool_no).call().then(function(stack_token) {
                            

                            pairaddresss = stack_token.lpToken;
                            let get_stakes = new web3.eth.Contract(MTokencontractInfo, pairaddresss);
                            get_stakes.methods.symbol().call().then(function(pair_symbol) {
                            pairsymbol = pair_symbol;
                                
                            get_stakes.methods.balanceOf(accounts[0]).call().then(function(get_stake_balance) {
                                m_contract.methods.userInfo(pool_no,accounts[0]).call().then(function(user_info) {
                                   m_contract.methods.pendingreward(pool_no,accounts[0]).call().then(function(reward) {
                                    let img = base_url+'assets/front_n/images/coins/'+coin+'.png';
                                    //alert(get_stake_balance);
                                $("#stack_token_image").attr("src",img);
                                $("#stack_token_detail").html('Deposit '+pairsymbol);
                                $("#stack_token_apy").html(stack_token.allocPoint);
                                $("#stack_token_balance").html(get_stake_balance / 10**18);
                                $("#stack_token_image1").attr("src",img);
                                $("#stack_token_detail1").html('Deposit '+pairsymbol);
                                $("#stack_token_apy1").html(stack_token.allocPoint);
                                $("#stack_token_balance1").html(get_stake_balance / 10**18);

                                if(user_info.amount!='0'){
                                $("#stacked_amount").html(user_info.amount / 10**18);                                
                                $("#reward_amount").html(reward / 10**18);
                                $("#approve_unstack").attr('enabled','enabled');
                                $("#reward_harvest").attr('enabled','enabled');                                                                                                    
                                } else {
                                //$("#stacked_amount_div").hide();
                                $("#reward_amount_div").hide();
                                $("#approve_unstack").attr('disabled','disabled');
                                $("#reward_harvest").attr('disabled','disabled');
                                }

                                $('#approve_stake').attr('selectd_contract_add', m_contracts_address);
                                $('#approve_stake').attr('selectd_stack_add', pairaddresss);
                                $('#reward_harvest').attr('selectd_contract_add', m_contracts_address);
                                $('#reward_harvest').attr('selectd_stack_add', pairaddresss);
                                $('#approve_unstack').attr('selectd_contract_add', m_contracts_address);
                                $('#approve_unstack').attr('selectd_stack_add', pairaddresss);

                                if(get_stake_balance == '0' && user_info.amount=='0'){
                                //$('.stHrSubmit').append("<button class='btn btn-primary btn-15845 btn-radius'>Insufficient fund</button>");                                    
                                    $("#insufficient").show();
                                    $("#approve_stake").hide();
                                    $("#approve_unstack").attr('disabled','disabled');
                                    $("#reward_harvest").attr('disabled','disabled');
                                    //$("#reward_harvest").hide();
                                    //$("#st_amt").hide();                                            
                                  } else if(get_stake_balance == '0'){
                                    $("#insufficient").show();
                                    $("#approve_stake").hide();
                                  }else {
                                    $("#insufficient").hide();
                                  }                                   
                                  $('.load_stake').fadeIn('slow');  
                                });stop_loader();                                
                            });
                                });
                            });
                            });
                            
                            }
                         });                         
                                           
                            $(document).on('click', '#approve_stake', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add'); 
                                deposit_amount = $("#stake_amount").val(); //alert(deposit_amount);
                                deposit_amount = parseFloat(deposit_amount) * 10 ** 18; //alert(BigInt(deposit_amount));
                                token_contract = new web3.eth.Contract(MTokencontractInfo, selectd_stack_add);
                                if (deposit_amount > 0) { //val = web3.utils.toBN('1000000000000000000000');
                                    web3.eth.getAccounts(function(err, accounts1) {                                        
                                            //deposit_count = parseFloat(count) + 1;
                                            token_contract.methods.approve(selectd_contract_add, BigInt(deposit_amount)).send({
                                                from: accounts1[0]
                                            }).on('receipt', (receipt) => {
                                                $.growl.notice({
                                                    title: "Please Note",
                                                    message: ("Approve Transaction Success !!!")
                                                }, {})
                                                token_contract.methods.balanceOf(accounts1[0]).call().then(function(balance) {
                                                    if (balance >= deposit_amount) {
                                                        token_contract.methods.allowance(accounts1[0], selectd_contract_add).call().then(function(allowance) {
                                                            if (allowance >= deposit_amount) {
                                                                m_contract.methods.deposit(pool_no, BigInt(deposit_amount)).send({
                                                                    from: accounts1[0]
                                                                }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                                                    $.growl.notice({
                                                                        title: "Please Note",
                                                                        message: ("Stake Transaction Success !!!")
                                                                    }, {});
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                    setTimeout(function() {
                                                                        window.location.href = "";
                                                                    }, 5000);
                                                                }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                                    $.growl.error({
                                                                        message: ("Sending Transaction Failed !!!")
                                                                    }, {})
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                });
                                                            } else {
                                                                $.growl.error({
                                                                    message: ("Sending Transaction Failed, Low Allowance !!!")
                                                                }, {})
                                                                $('.show_text').hide();
                                                                stop_loader();
                                                            }
                                                        });
                                                    } else {
                                                        $.growl.error({
                                                            message: ("Sending Transaction Failed, Low balance !!!")
                                                        }, {})
                                                        $('.show_text').hide();
                                                        stop_loader();
                                                    }
                                                });
                                            }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                $.growl.error({
                                                    message: ("Sending Transaction Failed !!!")
                                                }, {})
                                                $('.show_text').hide();
                                                stop_loader();
                                            });
                                        
                                    });
                                } else {
                                    $.growl.error({
                                        message: ("Sending Transaction Failed, please fill stake amount !!!")
                                    }, {})
                                    $('.show_text').hide();
                                    stop_loader();
                                }
                            });                     
                                           
                       
                            $(document).on('click', '#approve_unstack', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add');
                                withdraw_amount = $("#unstake_amount").val();                                  
                                withdraw_amount = parseFloat(withdraw_amount) * 10 ** 18; 
                                if (withdraw_amount > 0) {
                                web3.eth.getAccounts(function(err, accounts) {
                                    m_contract.methods.withdraw(pool_no, BigInt(withdraw_amount)).send({
                                        from: accounts[0]   
                                    }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                        stop_loader();
                                        $.growl.notice({
                                            message: ("Successfully withdrawn.")
                                        });
                                        setTimeout(function() {
                                            window.location.href = "";
                                        }, 3000);
                                    }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                        stop_loader();
                                        $.growl.error({
                                            message: (error.message)
                                        });
                                    });
                                });
                              } else {
                                    $.growl.error({
                                        message: ("Unstack Transaction Failed, please fill unstack amount !!!")
                                    }, {})
                                     stop_loader();
                                  }
                            })


                            $(document).on('click', '#reward_harvest', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add');
                                harvest_amount = 0;                                
                                web3.eth.getAccounts(function(err, accounts) {
                                    m_contract.methods.withdraw(pool_no, BigInt(harvest_amount)).send({
                                        from: accounts[0]   
                                    }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                        stop_loader();
                                        $.growl.notice({
                                            message: ("Successfully harvest.")
                                        });
                                        setTimeout(function() {
                                            window.location.href = "";
                                        }, 3000);
                                    }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                        stop_loader();
                                        $.growl.error({
                                            message: (error.message)
                                        });
                                    });
                                });

                            })

                            });
                           } 

                }
                });
     }, 1000);       
    //}  else if(localStorage.getItem('network_selectd') == '' || localStorage.getItem('network_selectd') == 'null') {
    } else if(localStorage.getItem('network_selectd') == "walletconnect"){
  
setTimeout(function(){    
    const m_contract_abi = [{"inputs":[{"internalType":"contract PredictCoin","name":"_reward","type":"address"},{"internalType":"contract PredictCoinBar","name":"_syrup","type":"address"},{"internalType":"address","name":"_devaddr","type":"address"},{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"_startBlock","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"SetDevAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"brewPerBlock","type":"uint256"}],"name":"SetEmissionRate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"SetFeeAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BONUS_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IBEP20","name":"_lpToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_devaddr","type":"address"}],"name":"dev","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devaddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"enterStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"getMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"leaveStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingreward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"poolAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IBEP20","name":"","type":"address"}],"name":"poolExistence","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IBEP20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accrewardPerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reward","outputs":[{"internalType":"contract PredictCoin","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"syrup","outputs":[{"internalType":"contract PredictCoinBar","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"multiplierNumber","type":"uint256"}],"name":"updateMultiplier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const m_contracts_address ='0x50d3E3bEb2EF9A2fdA6f9bE2402E700a81A20984';
    const m_tokencontract_abi =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];                    

    const predict_contract_abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const predict_contracts_address ='0x0B60d31DEe81Ba0d333c513B59ea5C7d080aa4d6';

  
    const WalletConnectProvider = window.WalletConnectProvider.default;
    const ropstenProvider = new WalletConnectProvider({
        infuraId:"2b5fa78a0cee4c4c9d2928a34906db2c" ,            
        rpc: {97: "https://data-seed-prebsc-1-s1.binance.org:8545/", }
      });  

    ropstenProvider.enable();
    web3 = new Web3(ropstenProvider); 
    var McontractInfo = (m_contract_abi);
    var MTokencontractInfo = (m_tokencontract_abi);
    var PredictcontractInfo = (predict_contract_abi);    
    m_contract = new web3.eth.Contract(McontractInfo, m_contracts_address);    
     let searchParams = new URLSearchParams(window.location.search) 
     let param = searchParams.get('token');
        var ff = web3.eth.net.getId();
/*            ff.then(function(result) {
                if (result == 97) {*/                                                           
                    $(document).on('click', '.add_liq', function() {
                    var allocPoint = $("#alloc_point").val(); //alert(allocPoint);
                    var token_address = $("#token_address").val(); //alert(token_address);
                    var bool = $("#update_bool").val(); //alert(bool);
                    let get_token = new web3.eth.Contract(MTokencontractInfo, token_address);
                    if (allocPoint != "" && token_address != "") {
                        start_loader();
                                    web3.eth.getAccounts(function(err, accounts) {
                                        m_contract.methods.add(allocPoint, token_address, bool).send({
                                            from: accounts[0]
                                        }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                            stop_loader();
                                            $.growl.notice({
                                                message: ("Liquitidy Pool successfully added.")
                                            });
                                        get_token.methods.symbol().call().then(function(token_name) {                                        
                                        $.ajax({
                                            url: base_url + "addpair",
                                            type: "POST",
                                            data: {
                                                token: token_name,                                                
                                                token_address: token_address,                                                
                                                img:'https://icons.bitbot.tools/api/'+token_name+'/64x64',                                                
                                                from_address: accounts[0],
                                                to_address: m_contracts_address,                
                                                allocPoint: allocPoint
                                            },
                                            dataType: "JSON",
                                            success: function(resp) {

                                            }
                                        })
                                        })
                                        /*setTimeout(function() {
                                            window.location.href = base_url + "staking";
                                        }, 5000);*/
                                        }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                            stop_loader();
                                            $.growl.error({
                                                message: (error.message)
                                            });
                                        });
                                    });
                            } else {
                                stop_loader();
                                $.growl.error({
                                    message: ("Please enter value all fields.")
                                });
                            }
                        });
                    if(current_page == 'staking'){start_loader(); 
                        $.ajax({
                            url: base_url + "/getpoollist",
                            type: "POST",
                            data: {
                                value: ""
                            },
                            dataType: "JSON",
                            success: function(resp) {
                                console.log(resp);                                
                                            var value_pool_list = '';
                                                let token = resp[0].token;
                                                let token_address = resp[0].token_address;
                                                let img_pair = base_url+'assets/front_n/images/coins/pred.svg';
                                                let allocPoint = resp[0].allocPoint;
                                                
                                                $("#token_image").attr("src",img_pair);
                                                $("#token_name").html(token);
                                                $("#token_detail").html('Deposit '+token);
                                                $("#token_apy").html(allocPoint);                                               
                                                $("#token_stack a").attr('href',function(i,str) {return str + '?token='+token_address;});
                                }
                            });                           
                        $('.load_stake').fadeIn('slow');
                        stop_loader();
                    if($('#stacks').is(":disabled")){
                        $.growl.error({message: ("Please Connect Metamask")});
                    }
                     
                }

                    if(current_page == 'farming'){//start_loader();alert()
                        $.ajax({
                            url: base_url + "/getpoollist",
                            type: "POST",
                            data: {
                                value: ""
                            },
                            dataType: "JSON",
                            success: function(resp) {
                                console.log(resp);
                                if (typeof web3 !== "undefined") {
                                    web3.eth.getAccounts(function(err, accounts) {
                                            var value_pool_list = ''; 
                                            for (let i = 0; i < resp.length; i++) { 
                                                let token = resp[i].token;
                                                let token_address = resp[i].token_address;
                                                let img_pair = resp[i].img;                                                
                                                let allocPoint = resp[i].allocPoint; 
                                                let token_id = +[i]+1;            
                                                var img_url = base_url+'assets/front_n/images/coins/'+img_pair;
                                                var imgs = img_pair.split('.')[0]
                                                $("#token_image_"+[i]).attr("src",img_url);
                                                $("#token_name_"+[i]).html(token+' Token');
                                                $("#token_detail_"+[i]).html('Deposit '+token+' Token');
                                                $("#token_apy_"+[i]).html(allocPoint);                                               
                                                $("#token_stack_"+[i]+" a").attr('href',function(i,str) {return 'farm/?token='+token_address+'&coin='+imgs;});
                                            }
                                        
                                    });
                                }
                            }
                            
                        });
                        $('.load_stake').fadeIn('slow');
                        stop_loader();
                    if($('#stacks').is(":disabled")){
                        $.growl.error({message: ("Please Connect Metamask")});
                    }

                    }

                    if(current_page == 'stack'){//start_loader();
                        const queryString = window.location.search;
                        const urlParams = new URLSearchParams(queryString);
                        const tokens = urlParams.get('token');
                        //var tokenstr = tokens.slice(-1);
                        //accounts = web3.eth.getAccounts(); console.log(accounts);
                        m_contract.methods.poolAddress(tokens).call().then(function(pool_no) { 
                        web3.eth.getAccounts(function(err, accounts) {
                            if (accounts.length != 0) {                            alert(accounts[0]);
                            m_contract.methods.poolInfo(pool_no).call().then(function(stack_token) {
                            

                            pairaddresss = stack_token.lpToken;
                            let predict_contracts = new web3.eth.Contract(PredictcontractInfo, pairaddresss);   
                            predict_contracts.methods.symbol().call().then(function(pair_symbol) {
                            pairsymbol = pair_symbol;
                                
                            predict_contracts.methods.balanceOf(accounts[0]).call().then(function(get_stake_balance) {
                                m_contract.methods.userInfo(pool_no,accounts[0]).call().then(function(user_info) {
                                   m_contract.methods.pendingreward(pool_no,accounts[0]).call().then(function(reward) {
                                let img = base_url+'assets/front_n/images/coins/pred.svg'; 
                                $("#stack_token_image").attr("src",img);                                
                                $("#stack_token_detail").html('Deposit '+pairsymbol+' Token');
                                $("#stack_token_apy").html(stack_token.allocPoint);                                    
                                $("#stack_token_balance").html(get_stake_balance / 10**18);
                                $("#stack_token_image1").attr("src",img);                                
                                $("#stack_token_detail1").html('Deposit '+pairsymbol+' Token');
                                $("#stack_token_apy1").html(stack_token.allocPoint);                                    
                                $("#stack_token_balance1").html(get_stake_balance / 10**18);                                
                                if(user_info.amount!='0'){
                                $("#stacked_amount").html(user_info.amount / 10**18);                                
                                $("#reward_amount").html(reward / 10**18);                                                                                                    
                                } else {
                                //$("#stacked_amount_div").hide();
                                $("#reward_amount_div").hide();
                                }
                                $('#approve_contract1').attr('selectd_contract_add', m_contracts_address);
                                $('#approve_contract1').attr('selectd_stack_add', pairaddresss);
                                $('#reward_harvest').attr('selectd_contract_add', m_contracts_address);
                                $('#reward_harvest').attr('selectd_stack_add', pairaddresss);
                                if(get_stake_balance == '0' && user_info.amount =='0'){
                                //$('.stHrSubmit').append("<button class='btn btn-primary btn-15845 btn-radius'>Insufficient fund</button>");
                                    $("#approve_contract1").hide();
                                    $("#reward_harvest").attr('disabled','disabled');                                    
                                    //$("#reward_harvest1").hide();
                                    //$("#st_amt").hide();                                            
                                    } else {
                                    $("#insufficient").hide();
                                  }                                     
                                    
                                });
                                   $('.load_stake').fadeIn('slow');
                                   stop_loader();                                
                            });
                                });
                            });
                            });
                            
                            }
                         });                         
                                           
                            $(document).on('click', '#approve_contract1', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add'); 
                                deposit_amount = $("#stake_amount1").val(); 
                                deposit_amount = parseFloat(deposit_amount) * 10 ** 18;
                                predtoken_contract = new web3.eth.Contract(PredictcontractInfo, selectd_stack_add);
                                if (deposit_amount > 0) {
                                    web3.eth.getAccounts(function(err, accounts1) {                                        
                                            //deposit_count = parseFloat(count) + 1;
                                            predtoken_contract.methods.approve(selectd_contract_add, BigInt(deposit_amount)).send({
                                                from: accounts1[0]
                                            }).on('receipt', (receipt) => {
                                                $.growl.notice({
                                                    title: "Please Note",
                                                    message: ("Approve Transaction Success !!!")
                                                }, {})
                                                predtoken_contract.methods.balanceOf(accounts1[0]).call().then(function(balance) {
                                                    if (balance >= deposit_amount) {
                                                        predtoken_contract.methods.allowance(accounts1[0], selectd_contract_add).call().then(function(allowance) {
                                                            if (allowance >= deposit_amount) {
                                                                m_contract.methods.enterStaking(BigInt(deposit_amount)).send({
                                                                    from: accounts1[0]
                                                                }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                                                    $.growl.notice({
                                                                        title: "Please Note",
                                                                        message: ("Stake Transaction Success !!!")
                                                                    }, {});
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                    setTimeout(function() {
                                                                        window.location.href = "";
                                                                    }, 5000);
                                                                }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                                    $.growl.error({
                                                                        message: ("Sending Transaction Failed !!!")
                                                                    }, {})
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                });
                                                            } else {
                                                                $.growl.error({
                                                                    message: ("Sending Transaction Failed, Low Allowance !!!")
                                                                }, {})
                                                                $('.show_text').hide();
                                                                stop_loader();
                                                            }
                                                        });
                                                    } else {
                                                        $.growl.error({
                                                            message: ("Sending Transaction Failed, Low balance !!!")
                                                        }, {})
                                                        $('.show_text').hide();
                                                        stop_loader();
                                                    }
                                                });
                                            }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                $.growl.error({
                                                    message: ("Sending Transaction Failed !!!")
                                                }, {})
                                                $('.show_text').hide();
                                                stop_loader();
                                            });
                                        
                                    });
                                } else {
                                    $.growl.error({
                                        message: ("Sending Transaction Failed, please fill stack amount !!!")
                                    }, {})
                                    $('.show_text').hide();
                                    stop_loader();
                                }
                            });                     
                                           
                       
                            $(document).on('click', '#approve_unstack_pred', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add');
                                withdraw_amount = $("#stake_amount").val();                                  
                                withdraw_amount = parseFloat(withdraw_amount) * 10 ** 18;
                                if (withdraw_amount > 0) {
                                web3.eth.getAccounts(function(err, accounts) {
                                    m_contract.methods.leaveStaking(BigInt(withdraw_amount)).send({
                                        from: accounts[0]   
                                    }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                        stop_loader();
                                        $.growl.notice({
                                            message: ("Successfully withdrawn.")
                                        });
                                        setTimeout(function() {
                                            window.location.href = "";
                                        }, 3000);
                                    }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                        stop_loader();
                                        $.growl.error({
                                            message: (error.message)
                                        });
                                    });
                                });
                              } else {
                                    $.growl.error({
                                        message: ("Unstack Transaction Failed, please fill unstack amount !!!")
                                    }, {})
                                     stop_loader();
                                  }                                
                            })
                            });
                           } 

                    if(current_page == 'farm'){
                        const queryString = window.location.search;
                        const urlParams = new URLSearchParams(queryString);
                        const tokens = urlParams.get('token');
                        const coin = urlParams.get('coin');
                        //var tokenstr = tokens.slice(-1);
                        m_contract.methods.poolAddress(tokens).call().then(function(pool_no) { 
                        web3.eth.getAccounts(function(err, accounts) {
                            if (accounts.length != 0) {                            //alert(accounts[0]);
                            m_contract.methods.poolInfo(pool_no).call().then(function(stack_token) {
                            

                            pairaddresss = stack_token.lpToken;
                            let get_stakes = new web3.eth.Contract(MTokencontractInfo, pairaddresss);
                            get_stakes.methods.symbol().call().then(function(pair_symbol) {
                            pairsymbol = pair_symbol;
                                
                            get_stakes.methods.balanceOf(accounts[0]).call().then(function(get_stake_balance) {
                                m_contract.methods.userInfo(pool_no,accounts[0]).call().then(function(user_info) {
                                   m_contract.methods.pendingreward(pool_no,accounts[0]).call().then(function(reward) {
                                    let img = base_url+'assets/front_n/images/coins/'+coin+'.png';
                                    //alert(get_stake_balance);
                                $("#stack_token_image").attr("src",img);
                                $("#stack_token_detail").html('Deposit '+pairsymbol);
                                $("#stack_token_apy").html(stack_token.allocPoint);
                                $("#stack_token_balance").html(get_stake_balance / 10**18);
                                $("#stack_token_image1").attr("src",img);
                                $("#stack_token_detail1").html('Deposit '+pairsymbol);
                                $("#stack_token_apy1").html(stack_token.allocPoint);
                                $("#stack_token_balance1").html(get_stake_balance / 10**18);

                                if(user_info.amount!='0'){
                                $("#stacked_amount").html(user_info.amount / 10**18);                                
                                $("#reward_amount").html(reward / 10**18);
                                $("#approve_unstack").attr('enabled','enabled');
                                $("#reward_harvest").attr('enabled','enabled');                                                                                                    
                                } else {
                                //$("#stacked_amount_div").hide();
                                $("#reward_amount_div").hide();
                                $("#approve_unstack").attr('disabled','disabled');
                                $("#reward_harvest").attr('disabled','disabled');
                                }

                                $('#approve_stake').attr('selectd_contract_add', m_contracts_address);
                                $('#approve_stake').attr('selectd_stack_add', pairaddresss);
                                $('#reward_harvest').attr('selectd_contract_add', m_contracts_address);
                                $('#reward_harvest').attr('selectd_stack_add', pairaddresss);
                                $('#approve_unstack').attr('selectd_contract_add', m_contracts_address);
                                $('#approve_unstack').attr('selectd_stack_add', pairaddresss);

                                if(get_stake_balance == '0' && user_info.amount=='0'){
                                //$('.stHrSubmit').append("<button class='btn btn-primary btn-15845 btn-radius'>Insufficient fund</button>");                                    
                                    $("#insufficient").show();
                                    $("#approve_stake").hide();
                                    $("#approve_unstack").attr('disabled','disabled');
                                    $("#reward_harvest").attr('disabled','disabled');
                                    //$("#reward_harvest").hide();
                                    //$("#st_amt").hide();                                            
                                  } else if(get_stake_balance == '0'){
                                    $("#insufficient").show();
                                    $("#approve_stake").hide();
                                  }else {
                                    $("#insufficient").hide();
                                  }                                   
                                  $('.load_stake').fadeIn('slow');  
                                });stop_loader();                                
                            });
                                });
                            });
                            });
                            
                            }
                         });                         
                                           
                            $(document).on('click', '#approve_stake', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add'); 
                                deposit_amount = $("#stake_amount").val(); //alert(deposit_amount);
                                deposit_amount = parseFloat(deposit_amount) * 10 ** 18; //alert(BigInt(deposit_amount));
                                token_contract = new web3.eth.Contract(MTokencontractInfo, selectd_stack_add);
                                if (deposit_amount > 0) { //val = web3.utils.toBN('1000000000000000000000');
                                    web3.eth.getAccounts(function(err, accounts1) {        
                                            //deposit_count = parseFloat(count) + 1;
                                            token_contract.methods.approve(selectd_contract_add, BigInt(deposit_amount)).send({
                                                from: accounts1[0]
                                            }).on('receipt', (receipt) => {
                                                $.growl.notice({
                                                    title: "Please Note",
                                                    message: ("Approve Transaction Success !!!")
                                                }, {})
                                                token_contract.methods.balanceOf(accounts1[0]).call().then(function(balance) {
                                                    if (balance >= deposit_amount) {
                                                        token_contract.methods.allowance(accounts1[0], selectd_contract_add).call().then(function(allowance) {
                                                            if (allowance >= deposit_amount) {
                                                                m_contract.methods.deposit(pool_no, BigInt(deposit_amount)).send({
                                                                    from: accounts1[0]
                                                                }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                                                    $.growl.notice({
                                                                        title: "Please Note",
                                                                        message: ("Stake Transaction Success !!!")
                                                                    }, {});
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                    setTimeout(function() {
                                                                        window.location.href = "";
                                                                    }, 5000);
                                                                }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                                    $.growl.error({
                                                                        message: ("Sending Transaction Failed !!!")
                                                                    }, {})
                                                                    $('.show_text').hide();
                                                                    stop_loader();
                                                                });
                                                            } else {
                                                                $.growl.error({
                                                                    message: ("Sending Transaction Failed, Low Allowance !!!")
                                                                }, {})
                                                                $('.show_text').hide();
                                                                stop_loader();
                                                            }
                                                        });
                                                    } else {
                                                        $.growl.error({
                                                            message: ("Sending Transaction Failed, Low balance !!!")
                                                        }, {})
                                                        $('.show_text').hide();
                                                        stop_loader();
                                                    }
                                                });
                                            }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                                $.growl.error({
                                                    message: ("Sending Transaction Failed !!!")
                                                }, {})
                                                $('.show_text').hide();
                                                stop_loader();
                                            });
                                        
                                    });
                                } else {
                                    $.growl.error({
                                        message: ("Sending Transaction Failed, please fill stake amount !!!")
                                    }, {})
                                    $('.show_text').hide();
                                    stop_loader();
                                }
                            });                     
                                           
                       
                            $(document).on('click', '#approve_unstack', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add');
                                withdraw_amount = $("#unstake_amount").val();                                  
                                withdraw_amount = parseFloat(withdraw_amount) * 10 ** 18; 
                                if (withdraw_amount > 0) {
                                web3.eth.getAccounts(function(err, accounts) {
                                    m_contract.methods.withdraw(pool_no, BigInt(withdraw_amount)).send({
                                        from: accounts[0]   
                                    }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                        stop_loader();
                                        $.growl.notice({
                                            message: ("Successfully withdrawn.")
                                        });
                                        setTimeout(function() {
                                            window.location.href = "";
                                        }, 3000);
                                    }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                        stop_loader();
                                        $.growl.error({
                                            message: (error.message)
                                        });
                                    });
                                });
                              } else {
                                    $.growl.error({
                                        message: ("Unstack Transaction Failed, please fill unstack amount !!!")
                                    }, {})
                                     stop_loader();
                                  }
                            })


                            $(document).on('click', '#reward_harvest', function() {
                                start_loader();
                                selectd_contract_add = $(this).attr('selectd_contract_add'); 
                                selectd_stack_add = $(this).attr('selectd_stack_add');
                                harvest_amount = 0;                                
                                web3.eth.getAccounts(function(err, accounts) {
                                    m_contract.methods.withdraw(pool_no, BigInt(harvest_amount)).send({
                                        from: accounts[0]   
                                    }).on('transactionHash', (hash) => {}).on('receipt', (receipt) => {
                                        stop_loader();
                                        $.growl.notice({
                                            message: ("Successfully harvest.")
                                        });
                                        setTimeout(function() {
                                            window.location.href = "";
                                        }, 3000);
                                    }).on('confirmation', (confirmationNumber, receipt) => {}).on('error', (error) => {
                                        stop_loader();
                                        $.growl.error({
                                            message: (error.message)
                                        });
                                    });
                                });

                            })

                            });
                           } 

                //}
                //});
     }, 1000);       
    //}  else if(localStorage.getItem('network_selectd') == '' || localStorage.getItem('network_selectd') == 'null') {

} else{
                    if(current_page == 'farming'){//start_loader();
                        $.ajax({
                            url: base_url + "/getpoollist",
                            type: "POST",
                            data: {
                                value: ""
                            },
                            dataType: "JSON",
                            success: function(resp) {
                                console.log(resp);                                
                                            var value_pool_list = '';
                                                let token = resp[0].token;
                                                let token_address = resp[0].token_address;
                                                let img_pair = base_url+'assets/front_n/images/coins/pred.svg';
                                                let allocPoint = resp[0].allocPoint;
                                                
                                                $("#token_image").attr("src",img_pair);
                                                $("#token_name").html(token+' Token');
                                                $("#token_detail").html('Deposit '+token+' Token');
                                                $("#token_apy").html(allocPoint);                                               
                                                $("#token_stack a").attr('href',function(i,str) {return 'farm/?token='+token_address;});
                                                stop_loader();  
                                                $('.load_stake').fadeIn('slow');                        
                                }
                            });                         

                    if($('#stacks').is(":disabled")){
                        $.growl.error({message: ("Please Connect Metamask")});
                    }
                     
                }

                    if(current_page == 'staking'){//start_loader();
                        $.ajax({
                            url: base_url + "/getpoollist",
                            type: "POST",
                            data: {
                                value: ""
                            },
                            dataType: "JSON",
                            success: function(resp) {
                                console.log(resp);
                                /*if (typeof web3 !== "undefined") {*/
                                    /*web3.eth.getAccounts(function(err, accounts) {*/
                                            var value_pool_list = ''; 
                                            for (let i = 0; i < resp.length; i++) { 
                                                let token = resp[i].token;
                                                let token_address = resp[i].token_address;
                                                let img_pair = resp[i].img;                                                
                                                let allocPoint = resp[i].allocPoint; 
                                                let token_id = +[i]+1;          
                                                var img_url = base_url+'assets/front_n/images/coins/'+img_pair;     
                                                $("#token_image_"+[i]).attr("src",img_url);
                                                $("#token_name_"+[i]).html(token+' Token');
                                                $("#token_detail_"+[i]).html('Deposit '+token+' Token');
                                                $("#token_apy_"+[i]).html(allocPoint);                                               
                                                $("#token_stack_"+[i]+" a").attr('href',function(i,str) {return str + '?token='+token_address;}); 
                                                stop_loader();  
                                                $('.load_stake').fadeIn('slow');                                                 
                                            }
                                        
                                    /*});*/
                                }
                           /* }*/
                            
                        });
                    if($('#stacks').is(":disabled")){
                        $.growl.error({message: ("Please Connect Metamask")});
                    }

                    }
    }
    $(document).on('click','.iconHolder',function(){
    stop_loader();
    localStorage.setItem('network_selectd','');
    localStorage.setItem('wallet_connection',false);
    $.growl.notice({ message: ("Logout Sucessfully") }); 
    window.location.reload();
    });
console.log('File loaded')
let web3

// connectToWallet = async () => {
//     event.preventDefault();
//     if (window.ethereum) {
//         web3 = new Web3(window.ethereum);
//         await ethereum.enable();
//     } else if (window.web3) {
//         web3 = new Web3(window.web3.currentProvider);
//     }
//     const accounts = await web3.eth.getAccounts();
//     document.getElementById("connect-web3").value = "Connected to Wallet";
// };

let handleSendTransaction = async (amount) => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum)
    await ethereum.enable()
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider)
  }

  if (!amount) {
    window.alert('Please choose amount to invest')
  } else if (!web3) {
    window.alert('Not connected to a Web3 Wallet')
  } else {
    const addresses = await web3.eth.getAccounts()
    const senderAddress = addresses[0]
    const blessingCircle = new web3.eth.Contract(
      [
        {
          "constant": true,
          "inputs": [],
          "name": "balanceOf",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_makePayment",
              "type": "bool"
            },
            {
              "name": "_reciepent",
              "type": "address"
            }
          ],
          "name": "invest",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        }
      ],
      'THAzzbMJT1UGLxbpg9RNo86Zaek3miScjM',
    );
    try {
      fetch('/checkCircleAlmostFull?id='+senderAddress+'&amount='+amount, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
      }
      }).then((response)=>{
        return response.json();
      }).then((data)=>{
        console.log(data);
        blessingCircle.methods
            .invest(data.paymentStatus, data.address)
            .send({
              from: senderAddress,
              value: amount * 1000000000000000000,
            })
            .on('transactionHash', function (hash) {
              fetch('/invest', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: '*/*',
                },
                body: JSON.stringify({
                  senderAddress: senderAddress,
                  investmentAmount: amount.toString(),
                }),
              });
              document.getElementById('btn-send').value = 'View Transaction'
              document.getElementById('btn-send').onclick = function () {
                window.open('https://ropsten.etherscan.io/tx/' + hash)
                window.location.reload()
              }
            })
            .on('error', function (error) {
              window.alert(JSON.stringify(error.stack))
            })
      })
      // fetch('/invest', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Accept: '*/*',
      //   },
      //   body: JSON.stringify({
      //     senderAddress: senderAddress,
      //     investmentAmount: amount.toString(),
      //   }),
      // })
      //   .then((res) => {
      //     return res.json()
      //     //Payment handling goes here
      //   })
      //   .then((data) => {
      //     console.log(data);
      //     blessingCircle.methods
      //       .invest(data.paymentStatus, data.address)
      //       .send({
      //         from: senderAddress,
      //         value: amount * 1000000000000000000,
      //       })
      //       .on('transactionHash', function (hash) {
      //         document.getElementById('btn-send').value = 'View Transaction'
      //         document.getElementById('btn-send').onclick = function () {
      //           window.open('https://ropsten.etherscan.io/tx/' + hash)
      //           window.location.reload()
      //         }
      //       })
      //       .on('error', function (error) {
      //         window.alert(JSON.stringify(error.stack))
      //       })
      //   })
    } catch (error) {
      window.alert(JSON.stringify(error))
    }
  }
}
var inputAmount
var radio1 = document.getElementById('pointOne')
var radio2 = document.getElementById('pointFive')
var radio3 = document.getElementById('one')

document.getElementById('btn-send').onclick = function () {
  if (radio1.checked) {
    inputAmount = 0.1
  }
  if (radio2.checked) {
    inputAmount = 0.5
  }
  if (radio3.checked) {
    inputAmount = 1
  }
  handleSendTransaction(inputAmount)
}

const {ChainId,Fetcher, WETH, Route, Trade, TokenAmount,TradeType, Percent} = require('@uniswap/sdk');
const { ethers } = require('ethers');

const zeroes = (n) => {str=""; for (let i=0;i<n;i++) str+="0"; return str}

const chainId = ChainId.MAINNET
const tokenAddress = "0x6b175474e89094c44da98b954eedeac495271d0f" //DAI token

async function init(){
    const dai = await Fetcher.fetchTokenData(chainId,tokenAddress)
    const weth=WETH[chainId]
    const pair = await Fetcher.fetchPairData(dai,weth)
    const route = new Route([pair],weth)
    trade = new Trade(route,new TokenAmount(weth,"100"+zeroes(15)),TradeType.EXACT_INPUT)
    console.log(`1ETH = ${route.midPrice.toSignificant(6)} DAI`)
    console.log(`1DAI = ${route.midPrice.invert().toSignificant(6)} ETH`)
    console.log(`execution price = ${trade.executionPrice.toSignificant(6)}`)
    console.log(`nextMidPrice = ${trade.nextMidPrice.toSignificant(6)}`)

    const slippageTolerance = new Percent('50',"1000") //50 bips = 0.050 
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw
    const path = [weth.address,dai.address]
    const to=''
    const deadline = Math.floor(Date.now()/1000) + 60*20
    const value = trade.inputAmount.raw

    const provider = ethers.getDefaultProvider('mainnet',{
        infura:"https://mainnet.infura.io/v3/12a9a93572344efbbbacf9ee98447348"
    })
    PRIVATE_KEY="5f408cc1a6354bc6af18eca6eb2d3bbc03a0fd1871ef5a3d740dbe29a1684315"
    const signer = new ethers.Wallet(PRIVATE_KEY)
    const account = signer.connect(provider)
    const router2_addr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    const func_str = "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);"
    const uniswap = new ethers.Contract(
        router2_addr,
        [func_str],
        account
    )
    const tx = await uniswap.sendExactETHForTokens(
        amountOutMin,
        path,
        to,
        {value,gasPrice:20e9}
    )
    console.log(`Transaction hash ${tx.hash}`)
    const receipt = await tx.wait()
    console.log(`Minned in ${receipt.blockNumber}`)
}

init()
const {ChainId,Fetcher, WETH, Route} = require('@uniswap/sdk')

const chainId = ChainId.MAINNET
const tokenAddress = "0x6b175474e89094c44da98b954eedeac495271d0f" //DAI token

async function init(){
    const dai = await Fetcher.fetchTokenData(chainId,tokenAddress)
    const weth=WETH[chainId]
    const pair = await Fetcher.fetchPairData(dai,weth)
    const route = new Route([pair],weth)
    console.log(`1ETH = ${route.midPrice.toSignificant(6)} DAI`)
    console.log(`1DAI = ${route.midPrice.invert().toSignificant(6)} ETH`)

}

init()
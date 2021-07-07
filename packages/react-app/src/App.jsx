import WalletConnectProvider from '@walletconnect/web3-provider'
import { Alert, Menu } from 'antd'
import 'antd/dist/antd.css'
import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import Web3Modal from 'web3modal'
import './App.css'
import { Account, Header } from './components'
import { INFURA_ID, NETWORK, NETWORKS } from './constants'
import { Transactor } from './helpers'
import { useContractLoader, useGasPrice, useOnBlock, useUserSigner } from './hooks'
import { MintUI } from './views'

const {ethers} = require('ethers')

const targetNetwork = NETWORKS.localhost // localhost, rinkeby, xdai, mainnet

const DEBUG = true
const NETWORKCHECK = false

const mainnetProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider('https://mainnet.infura.io/v3/' + INFURA_ID)
  : null

const localProviderUrl = targetNetwork.rpcUrl
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl
if (DEBUG) console.log('Connecting to provider:', localProviderUrlFromEnv)
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv)

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  network: 'mainnet', // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: 'light', // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID
      }
    }
  }
})

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider()
  setTimeout(() => {
    window.location.reload()
  }, 1)
}

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState()
  const [address, setAddress] = useState()

  const gasPrice = useGasPrice(targetNetwork, 'fast')
  const userSigner = useUserSigner(injectedProvider, localProvider)

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress()
        setAddress(newAddress)
      }
    }

    getAddress()
  }, [userSigner])

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice)

  const yourLocalBalance = 0 // TODO: fetch from subquery

  // Load in your local contract and read a value from it:
  const readContracts = useContractLoader(localProvider)

  // If you want to make write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, {chainId: localChainId})

  useOnBlock(mainnetProvider, () => {
    console.log(`A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`)
  })

  let networkDisplay = ''
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId)
    const networkLocal = NETWORK(localChainId)
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <Alert
          message="⚠️ Wrong Network ID"
          description={
            <div>
              You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
              HardHat.
              <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
            </div>
          }
          type="error"
          closable={false}
        />
      )
    } else {
      networkDisplay = (
        <Alert
          message="⚠️ Wrong Network"
          description={
            <div>
              You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{' '}
              <b>{networkLocal && networkLocal.name}</b>.
            </div>
          }
          type="error"
          closable={false}
        />
      )
    }
  } else {
    networkDisplay = (
      <div style={{color: targetNetwork.color}}>
        Network: {targetNetwork.name}
      </div>
    )
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new ethers.providers.Web3Provider(provider))

    provider.on('chainChanged', chainId => {
      setInjectedProvider(new ethers.providers.Web3Provider(provider))
    })

    provider.on('accountsChanged', () => {
      setInjectedProvider(new ethers.providers.Web3Provider(provider))
    })

    provider.on('disconnect', (code, reason) => {
      logoutOfWeb3Modal()
    })
  }, [setInjectedProvider])

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal()
    }
  }, [loadWeb3Modal])

  const [route, setRoute] = useState()
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute])

  return (
    <div className="App">
      <Header/>
      {networkDisplay}
      <BrowserRouter>
        <Menu style={{textAlign: 'center'}} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute('/')
              }}
              to="/"
            >
              Trtansactions
            </Link>
          </Menu.Item>
          <Menu.Item key="/mint">
            <Link
              onClick={() => {
                setRoute('/mint')
              }}
              to="/mint"
            >
              MintUI
            </Link>
          </Menu.Item>
        </Menu>
        <Switch>
          <Route exact path="/">
            <>TODO: transactions</>
          </Route>
          <Route path="/mint">
            <MintUI
              address={address}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              yourLocalBalance={yourLocalBalance}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
            />
          </Route>
        </Switch>
      </BrowserRouter>
      <div style={{position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10}}>
        <Account
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      </div>
    </div>
  )
}

export default App

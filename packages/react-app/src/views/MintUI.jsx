/* eslint-disable jsx-a11y/accessible-emoji */

import { utils } from 'ethers'
import { Button, Card, Divider, Input, InputNumber } from 'antd'
import React, { useState } from 'react'
import { Address } from '../components'

export default function MintUI({
                                 address,
                                 mainnetProvider,
                                 yourLocalBalance,
                                 tx,
                                 readContracts,
                                 writeContracts
                               }) {
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState(0)

  return (
    <Card style={{padding: 16, margin: 24, marginTop: 64}}>
      Contract Address:
      <Address
        address={readContracts && readContracts.MintableERC20 ? readContracts.MintableERC20.address : null}
        ensProvider={mainnetProvider}
        fontSize={16}
      />
      <Divider/>
      Your Address:
      <Address address={address} ensProvider={mainnetProvider} fontSize={16}/>
      <Divider/>
      <h4>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : '...'}</h4>
      <Divider/>
      <div style={{margin: 8}}>
        <Input
          onChange={e => {
            setToAddress(e.target.value)
          }}
        />
        <br/>
        Amount:
        <InputNumber
          style={{marginTop: 8}}
          onChange={v => {
            setAmount(v)
          }}
        />
        <br/>
        <Button
          style={{marginTop: 8}}
          onClick={async () => {
            const result = tx(writeContracts.MintableERC20.mint(toAddress, amount), update => {
              console.log('Transaction Update:', update)
              if (update && (update.status === 'confirmed' || update.status === 1)) {
                console.log('Transaction ' + update.hash + ' finished!')
                console.log(
                  update.gasUsed + '/' + (update.gasLimit || update.gas) + ' @ ' + parseFloat(update.gasPrice) / 1000000000 + ' gwei'
                )
              }
            })
            console.log('awaiting metamask/web3 confirm result...', result)
            console.log(await result)
          }}
        >
          Mint
        </Button>
      </div>
    </Card>
  )
}

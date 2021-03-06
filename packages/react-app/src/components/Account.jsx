import { Button } from 'antd'
import React from 'react'

export default function Account({web3Modal, loadWeb3Modal, logoutOfWeb3Modal}) {
  const modalButtons = []
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{verticalAlign: 'top', marginLeft: 8, marginTop: 4}}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          logout
        </Button>
      )
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{verticalAlign: 'top', marginLeft: 8, marginTop: 4}}
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal}
        >
          connect
        </Button>
      )
    }
  }

  return (
    <div>
      {modalButtons}
    </div>
  )
}

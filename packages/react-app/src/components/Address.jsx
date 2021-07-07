import React from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'

const blockExplorerLink = (address, blockExplorer) =>
  `${blockExplorer || 'https://etherscan.io/'}${'address/'}${address}`

export default function Address(props) {
  const address = props.value || props.address

  const {currentTheme} = useThemeSwitcher()

  const etherscanLink = blockExplorerLink(address, props.blockExplorer)

  return (
      <span style={{verticalAlign: 'middle', paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 14}}>
        <a
          style={{color: currentTheme === 'light' ? '#222222' : '#ddd'}}
          target="_blank"
          href={etherscanLink}
          rel="noopener noreferrer">
          {address}
        </a>
      </span>
  )
}

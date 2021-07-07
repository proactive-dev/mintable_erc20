import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/proactive-dev/mintable-erc20" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Mintable ERC20"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}

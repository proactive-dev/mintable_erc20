import { BigDecimal, BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent } from "../generated/MintableERC20/MintableERC20"
import { Account, AccountBalance, Token, Transfer } from "../generated/schema"

const ZERO = BigInt.fromI32(0)
const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000'

function toDecimal(value: BigInt, decimals: u32): BigDecimal {
  let precision = BigInt.fromI32(10)
      .pow(<u8>decimals)
      .toBigDecimal()

  return value.divDecimal(precision)
}

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.address.toHex())

  if (token != null) {
    let amount = toDecimal(event.params.value, token.decimals)
    let isMint = event.params.from.toHex() == GENESIS_ADDRESS
    let transactionHash = event.transaction.hash.toHex();

    let transfer = new Transfer(transactionHash);
    transfer.token = event.address.toHex()
    transfer.amount = amount
    transfer.sender = event.params.from
    transfer.source = event.params.from
    transfer.destination = event.params.to

    transfer.block = event.block.number
    transfer.timestamp = event.block.timestamp
    transfer.transaction = event.transaction.hash

    transfer.save()

    // From account balance
    if (!isMint) {
      let sourceAccount = getOrCreateAccount(event.params.from)

      let accountBalance = decreaseAccountBalance(sourceAccount, token as Token, amount)
      accountBalance.block = event.block.number
      accountBalance.modified = event.block.timestamp
      accountBalance.transaction = event.transaction.hash

      sourceAccount.save()
      accountBalance.save()
    }

    // To account balance
    let destinationAccount = getOrCreateAccount(event.params.to)

    let accountBalance = increaseAccountBalance(destinationAccount, token as Token, amount)
    accountBalance.block = event.block.number
    accountBalance.modified = event.block.timestamp
    accountBalance.transaction = event.transaction.hash

    destinationAccount.save()
    accountBalance.save()
  }
}

export function getOrCreateAccount(accountAddress: Bytes): Account {
  let accountId = accountAddress.toHex()
  let existingAccount = Account.load(accountId)

  if (existingAccount != null) {
    return existingAccount as Account
  }

  let newAccount = new Account(accountId)
  newAccount.address = accountAddress

  return newAccount
}

function getOrCreateAccountBalance(account: Account, token: Token): AccountBalance {
  let balanceId = account.id + '-' + token.id
  let previousBalance = AccountBalance.load(balanceId)

  if (previousBalance != null) {
    return previousBalance as AccountBalance
  }

  let newBalance = new AccountBalance(balanceId)
  newBalance.account = account.id
  newBalance.token = token.id
  newBalance.amount = ZERO.toBigDecimal()

  return newBalance
}

export function increaseAccountBalance(account: Account, token: Token, amount: BigDecimal): AccountBalance {
  let balance = getOrCreateAccountBalance(account, token)
  balance.amount = balance.amount.plus(amount)

  return balance
}

export function decreaseAccountBalance(account: Account, token: Token, amount: BigDecimal): AccountBalance {
  let balance = getOrCreateAccountBalance(account, token)
  balance.amount = balance.amount.minus(amount)

  return balance
}

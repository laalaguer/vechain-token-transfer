export default {
  app: {
    code: 'code',
    noEnvModalTitle: 'Environement Incorrect',
    noEnvModalText: 'This web page runs in VeChain Sync Browser.',
    noEnvModalOkayButtonText: 'Download Sync'
  },
  topBar: {
    title: 'VeChain Token Transfer',
    mainnet: 'mainnet',
    testnet: 'testnet'
  },
  addressBox: {
    validAddressFeedback: 'Looks good',
    ERR_START_WRONG: 'Should start with 0x',
    ERR_TOO_SHORT: 'Too short',
    ERR_TOO_LONG: 'Too long',
    ERR_INVALID_ADDRESS: 'Invalid Address or checksum failed',
    ERR_NON_ALPHANUMERIC: 'Only A-Z, a-z, 0-9 allowed',
    ERR_CHECKSUM_FAILED: 'Address checksum failed'
  },
  amountBox: {
    validAmountFeedback: 'Looks good',
    ERR_ZERO: 'Cannot be 0',
    ERR_NAN: 'Must be a number',
    ERR_NEGATIVE: 'Must be positive',
    ERR_BREACH_MAX: 'Too large',
    ERR_DECIMAL_FORMAT: 'Max 4 decimal digits allowed'
  },
  inputArea: {
    buttonText: 'Add address',
    modalOkText: 'Okay',
    modalCancelText: 'Cancel',
    modalBoxTitle: 'Enter a new address:',
    hintText1: 'Empty watchlist, Add some symbol address:',
    hintText2: 'Have more symbol tokens? Add them:'
  },
  transferCard: {
    transferText: 'Transfer',
    toAddressTitle: 'To:',
    transferAmountTitle: 'Amount:',
    createTransferButton: 'Next Step',
    confirmTransferButton: 'Confirm',
    cancelTransferButton: 'Cancel',
    modalOkButtonText: 'Okay',
    modalCancelButtonText: 'Cancel',
    deleteAddressModalTitle: 'Delete Address?',
    copyAddressToastText: 'Address Copied',
    mainNetWarning: '* If above info is correct, click Confirm to continue.',
    transactionSent: '交易已经发送!'
  }
}

export default {
  app: {
    code: 'code',
    noEnvModalTitle: 'Environement Incorrect',
    noEnvModalText: 'This web page needs VeChain Sync.',
    noEnvModalOkayButtonText: 'Download Sync',
    donateText: 'Support me'
  },
  topBar: {
    title: 'VeChain Tokens',
    mainnet: 'mainnet',
    testnet: 'testnet'
  },
  addressBox: {
    validAddressFeedback: '',
    ERR_START_WRONG: 'Should start with 0x',
    ERR_TOO_SHORT: 'Too short',
    ERR_TOO_LONG: 'Too long',
    ERR_INVALID_ADDRESS: 'Invalid Address or checksum failed',
    ERR_NON_ALPHANUMERIC: 'Only A-Z, a-z, 0-9 allowed',
    ERR_CHECKSUM_FAILED: 'Address checksum failed'
  },
  amountBox: {
    validAmountFeedback: '',
    ERR_ZERO: 'Cannot be 0',
    ERR_NAN: 'Must be a number',
    ERR_NEGATIVE: 'Must be positive',
    ERR_BREACH_MAX: 'Exceeded maximum amount this account holds',
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
    transferText: 'Transfer Out',
    toAddressTitle: 'To:',
    transferAmountTitle: 'Total:',
    createTransferButton: 'Next Step',
    confirmTransferButton: 'Confirm',
    cancelTransferButton: 'Cancel',
    modalOkButtonText: 'Okay',
    modalCancelButtonText: 'Cancel',
    deleteAddressModalTitle: 'Delete this wallet?',
    copyAddressToastText: 'Address Copied',
    mainNetWarning: '* The transaction would be irreversible on mainnet, click "Confirm" to continue.',
    transactionSent: 'Transaction sent!',
    copyText: 'click to copy:',
    addWalletText: 'Add to Wallet',
    addAnotherReceiver: 'add a receiver',
    addByUploadFile: 'add by .csv file',
    uploadCSVModalTitle: 'Upload a .csv file'
  }
}

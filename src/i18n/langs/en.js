export default {
  app: {
    code: 'code',
    noEnvModalTitle: 'Environment Incorrect',
    noEnvModalText: 'This web page needs VeChain Sync.',
    noEnvModalOkayButtonText: 'Download Sync',
    donateText: 'Donate to author',
    donateChoicesText: 'Ways of donation',
    donateByCopy: 'Donate VET/VTHO to the following wallet',
    donateByBuyMeACoffee: 'Donate through "Buy Me a Coffee" link'
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
    buttonText: '+',
    modalOkText: 'Okay',
    modalCancelText: 'Cancel',
    modalBoxTitle: 'Enter a new address:',
    modalTokensTitle: 'Tokens:',
    hintText1: 'Empty watchlist of symbol? Add an address to start watching/transferring',
    hintText2: 'Have more symbol tokens? Add it.',
    hintText3: 'Add a symbol wallet'
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
    deleteAddressModalTitle: 'Remove this wallet from watchlist?',
    copyAddressToastText: 'Address Copied',
    mainNetWarning: '* The transaction would be irreversible on mainnet, click "Confirm" to continue.',
    transactionSent: 'Transaction sent!',
    copyText: 'click to copy address',
    addWalletText: 'Prove to be mine',
    addAnotherReceiver: 'add another receiver',
    addByUploadFile: 'add mulitple receivers by .csv file',
    uploadCSVModalTitle: 'Upload a .csv file',
    goBackText: 'Go back',
    deleteText: 'Delete'
  },
  toasts: {
    copytitle: 'copied!'
  }
}

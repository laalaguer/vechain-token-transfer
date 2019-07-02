export default {
  app: {
    code: '源代码',
    noEnvModalTitle: '运行环境不完整',
    noEnvModalText: '本网页运行在 VeChain Sync 浏览器中.',
    noEnvModalOkayButtonText: '下载 Sync'
  },
  topBar: {
    title: '唯链代币神器',
    mainnet: '主网',
    testnet: '测试网'
  },
  addressBox: {
    validAddressFeedback: '',
    ERR_START_WRONG: '地址必须以 0x 开头',
    ERR_TOO_SHORT: '太短了',
    ERR_TOO_LONG: '太长了',
    ERR_INVALID_ADDRESS: '地址格式错误，请检查',
    ERR_NON_ALPHANUMERIC: '今允许输入 A-Z, a-z, 0-9',
    ERR_CHECKSUM_FAILED: '地址校验和错误，请检查'
  },
  amountBox: {
    validAmountFeedback: '',
    ERR_ZERO: '不能为 0',
    ERR_NAN: '必须是一个数字',
    ERR_NEGATIVE: '必须是正数',
    ERR_BREACH_MAX: '超过了本账户存有的最大数量',
    ERR_DECIMAL_FORMAT: '最多小数点4位'
  },
  inputArea: {
    buttonText: '添加新观察地址',
    modalOkText: '好',
    modalCancelText: '取消',
    modalBoxTitle: '输入一个新的观察地址 (钱包地址):',
    hintText1: '还没有观察地址, 添加一些 symbol 钱包地址:',
    hintText2: '持有更多 symbol 代币? 添加对应的钱包地址:'
  },
  transferCard: {
    transferText: '转出',
    toAddressTitle: '转账给:',
    transferAmountTitle: '总计:',
    createTransferButton: '下一步',
    confirmTransferButton: '确认',
    cancelTransferButton: '取消',
    modalOkButtonText: '好',
    modalCancelButtonText: '取消',
    deleteAddressModalTitle: '确认删除该账户?',
    copyAddressToastText: '地址已经拷贝',
    mainNetWarning: '* 现在处在主网上，任何交易都不可逆，按“确认”按钮继续.',
    transactionSent: '交易已经发送!',
    copyText: '点击拷贝地址:',
    addWalletText: '添加以转账',
    addAnotherReceiver: '再增加一个收款人'
  }
}

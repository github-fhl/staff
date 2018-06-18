// 通过config 配置用 require('config') 即可加载
import {routerMap} from 'routes/routers.config'

export const test={title:'test defalut title'}

// 全局接口host配置
export const host='/api/'

//提示信息
export const msg={
  saveSuccess:'Save success'
}

// 表格 filter
export const tableFilter={
  year:[
    { text: '2017', value: '2017' },
    { text: '2016', value: '2016' },
  ]
}

// column 默认宽度
export const columnWidth={
  money:135
}

// 系统设置
export const currencyFields={
  usd:'USD',
  rmb:'RMB',
  local:'LOCAL',
  constantRateToUSD:'constantRateToUSD',
  fordRateToUSD:'fordRateToUSD',
  constantRateToRMB:'constantRateToRMB',
  fordRateToRMB:'fordRateToRMB',
};
export const sowTargetCurrencyFields={
  [currencyFields.usd]:currencyFields.fordRateToUSD,
  [currencyFields.rmb]:currencyFields.fordRateToRMB,
}

// argument fields
export const argumentFields={
  location:'location',
  distributeType:'distributeType',
  categorySalary:'salaryCategory',
  status:'status',
  payorType:'payorType',
  levelType:'levelType',
  clientType:'clientType',
  stdPosCategory:'stdPosCategory',
  skillLevel:'skillLevelType'
}

// sow fields
export const sowFields={
  soldSows:'soldSows',
  specialSows:'specialSows',
  sowLevel:'sowLevel',
  currencys:'currencys',
  positions:'positions',
  sowPosition:'sowPosition',
}

// sow Type
export const sowType={
  inHouse:'InHouse',
  letGo:'LetGo',
}

export const flowStatus={
  toSubmit: 'toSubmit', // 财务经理已创建，待提交
  toApproveByFD: 'toApproveByFD', // 已提交，待财务总监审批
  refusedByFD: 'refusedByFD', // 财务总监拒绝，待提交
  toApproveByClient: 'toApproveByClient', // 财务总监批准，待客户审批（批准后可以再次拒绝）
  refusedByClient: 'refusedByClient', // 客户拒绝，结束
  toCollectPO: 'toCollectPO', // 客户已批准，待上传 PO 文件（也可以再次点击客户拒绝）
  POCollected: 'POCollected', // 上传 PO 文件
  disabled: 'disabled', // 已失效（复制后，除了新版本，其它的版本都是已失效）
  special: 'special', // Service/InHouse/LetGo 类别，创建后就是 special
}

export const level={
  field:'skillLevel',
  high:'High',
  middle:'Middle',
  low:'Low'
}

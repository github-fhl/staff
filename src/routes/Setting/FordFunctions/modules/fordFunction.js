import React from 'react'
import {Input} from 'antd'

// 搜索的column
export const searchColumns=[
  {
    dataIndex:'keyWord',
    title:'Key word',
    match:'include',
    target:['id'],
    component: <Input size="default" />
  }
]

// FordFunction表格的column
export const fordFunctionTableColumns=[
  {dataIndex:'id',title:'FordFunction',width:200},
  {dataIndex:'operation',title:'Enabled',width:300},
]

// FordFunction表单的column
export const fordFunctionFormColumns=[
  {dataIndex:'id',required:true}
]

import React from 'react'
import {Input} from 'antd'
import {YearInput,NumberInput} from 'components/column'
import { Link } from 'react-router'
import {routerMap} from 'routes/routers.config'

const setting=routerMap.setting;

// 搜索的column
export const searchColumns=[
  {
    dataIndex:'keyWord',
    title:'Key word',
    match:'include',
    target:['id','name','contact','address'],
    component: <Input size="default" />
  }
]

// Currency表格的column
export const currencyTableColumns=[
  {dataIndex:'id',title:'Currency',width:160,
    render:(text,$record)=><Link to={`/${setting.path}/${setting.currency.path}/${$record.get('id')}`}>{$record.get('id')}</Link>
  },
  {dataIndex:'country'},
  {
    dataIndex:'year',
    render:(text,$record)=>$record.getIn(['currencyDetails',0,'year'])
  },
  {dataIndex:'constantRate',width:125,render:(e,$r)=>$r.getIn(['currencyDetails',0,'constantRateToUSD'])},
  {dataIndex:'fordRate',render:(e,$r)=>$r.getIn(['currencyDetails',0,'fordRateToUSD'])},
]

// Currency表单的column
export const currencyFormColumns=[
  {dataIndex:'id',required:true},
  {dataIndex:'country',}
]

// Currencydetail column
export const detailFormColumns=[
  {dataIndex:'year',Component:YearInput,disabled:$record=>!!$record.id},
  {dataIndex:'constantRate',Component:NumberInput,width:140},
  {dataIndex:'fordRate',Component:NumberInput}
]
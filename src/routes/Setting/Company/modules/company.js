import React from 'react'
import {Input,Icon} from 'antd'
import {YearInput,PercentInput,MoneyInput} from 'components/column'
import { Link } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {format} from 'common/format'
import {tableFilter} from 'common/config'

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

// 公司表格的column
export const companyTableColumns=[
  {dataIndex:'id',title:'Company',width:120,
    render:(text,$record)=><Link to={`/${setting.path}/${setting.company.path}/${$record.get('id')}`}>{$record.get('id')}</Link>
  },
  {dataIndex:'name',title:'Full Name',width:150},
  {
    dataIndex:'year',
    render:(text,$record)=>$record.getIn(['companyDetails',0,'year']),
    filterMultiple: false,
    filterIcon: <Icon type="search" />,
    filters: tableFilter.year
  },
  {
    dataIndex:'rate',
    render:(text,$record)=>format.percent($record.getIn(['companyDetails',0,'rate']))
  },
  {dataIndex:'min',render:(text,$record)=>format.money($record.getIn(['companyDetails',0,'min']))},
  {dataIndex:'max',render:(text,$record)=>format.money($record.getIn(['companyDetails',0,'max']))},
  {dataIndex:'contact'},
  {dataIndex:'telephone'},
  {dataIndex:'address'},
  {dataIndex:'email'}
]

// 公司表单的column
export const companyFormColumns=[
  {dataIndex:'id',required:true},
  {dataIndex:'name',required:true,title:'Full Name'},
  {dataIndex:'contact'},
  {dataIndex:'telephone'},
  {dataIndex:'address'},
  {dataIndex:'email'}
]

// 公司detail column

export const detailFormColumns=[
  {
    dataIndex:'year',
    width:120,
    Component:YearInput
  },
  {
    dataIndex:'rate',
    Component:PercentInput
  },
  {
    width:160,
    dataIndex:'min',
    Component:MoneyInput
  },
  {
    width:160,
    dataIndex:'max',
    Component:MoneyInput
  }
]
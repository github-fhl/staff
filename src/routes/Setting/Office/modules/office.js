import React from 'react'
import {Input,Icon} from 'antd'
import {YearInput,PercentInput,MoneyInput,NumberInput} from 'components/column'
import { Link } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {format} from 'common/format'
import {tableFilter} from 'common/config'
import SettingSelect from 'containers/SettingSelect'

const setting=routerMap.setting;

// 货币选择器
class CurrencySelect extends React.PureComponent{
  render(){
    return <SettingSelect {...this.props} type={setting.currency.path} className="select-underline" />
  }
}

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
export const officeTableColumns=[
  {dataIndex:'id',title:'Office',width:160,
    render:(text,$record)=><Link to={`/${setting.path}/${setting.offices.path}/${$record.get('id')}`}>{$record.get('id')}</Link>
  },
  {dataIndex:'currencyId'},
  {
    dataIndex:'year',
    render:(text,$record)=>$record.getIn(['officeDetails',0,'year']),
    filterMultiple: false,
    filterIcon: <Icon type="search" />,
    filters: tableFilter.year
  },
  {dataIndex:'mulRate',render:(e,$r)=>$r.getIn(['officeDetails',0,'mulRate'])},
  {dataIndex:'dictRate',render:(e,$r)=>$r.getIn(['officeDetails',0,'dictRate'])},
  {dataIndex:'incRate',render:(e,$r)=>format.percent($r.getIn(['officeDetails',0,'incRate']))},
  {dataIndex:'benRate',render:(e,$r)=>format.percent($r.getIn(['officeDetails',0,'benRate']))},
  {dataIndex:'overRate',render:(e,$r)=>format.percent($r.getIn(['officeDetails',0,'overRate']))},
  {dataIndex:'mkpRate',render:(e,$r)=>format.percent($r.getIn(['officeDetails',0,'mkpRate']))},
  {dataIndex:'taxRate',render:(e,$r)=>format.percent($r.getIn(['officeDetails',0,'taxRate']))},
  {dataIndex:'invRate',render:(e,$r)=>format.percent($r.getIn(['officeDetails',0,'invRate']))},
  {dataIndex:'divRate',render:(e,$r)=>$r.getIn(['officeDetails',0,'divRate'])},
  {dataIndex:'contact'},
  {dataIndex:'telephone'},
  {dataIndex:'address',width:160},
  {dataIndex:'email'}
]

// 公司表单的column
export const officeFormColumns=[
  {dataIndex:'id',required:true},
  {dataIndex:'name',required:true,title:'Full Name'},
  {dataIndex:'contact'},
  {dataIndex:'telephone'},
  {dataIndex:'address'},
  {dataIndex:'email'},
  {dataIndex:'currencyId',Component:CurrencySelect}
]

// 公司detail column

export const detailFormColumns=[
  {dataIndex:'year',Component:YearInput},
  {dataIndex:'mulRate',Component:NumberInput},
  {dataIndex:'dictRate',Component:NumberInput,showTitleTip:false,width:120},
  {dataIndex:'incRate',Component:PercentInput,showTitleTip:false},
  {dataIndex:'benRate',Component:PercentInput,showTitleTip:false},
  {dataIndex:'overRate',Component:PercentInput,showTitleTip:false},
  {dataIndex:'mkpRate',Component:PercentInput},
  {dataIndex:'taxRate',Component:PercentInput},
  {dataIndex:'invRate',Component:PercentInput},
  {dataIndex:'divRate',Component:NumberInput,showTitleTip:false},
]
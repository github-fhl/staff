import React from 'react'
import { Link } from 'react-router'
import {Input,Icon} from 'antd'
import {routerMap} from 'routes/routers.config'
import {YearInput,PercentInput,MoneyInput,DefalutInput} from 'components/column'
import {format} from 'common/format'
import ArgumentSelect from 'containers/ArgumentSelect'
import SettingSelect from 'containers/SettingSelect'
import {argumentFields} from 'common/config'

const setting=routerMap.setting;
const createArgumentSelect=type=>{
  return class extends React.PureComponent{
    render(){
      return <ArgumentSelect {...this.props} type={type} className="select-underline" />
    }
  }
}

class underlinePercentInput extends React.PureComponent{
    render(){
      return <PercentInput {...this.props} className="input-underline" />
    }
}
class TeamsSelect extends React.PureComponent{
  render(){
    return <SettingSelect {...this.props} type={setting.teams.path} mode="combobox" />
  }
}

// 搜索的column
export const searchColumns=[
  {
    dataIndex:'keyWord',
    title:'Key word',
    match:'include',
    target:['id','contact','address'],
    component: <Input size="default" />
  }
]

// clients表格的column
export const clientsTableColumns=[
  {dataIndex:'id',title:'Clients',width:120,
    render:(text,$record)=><Link to={`/${setting.path}/${setting.clients.path}/${$record.get('id')}`}>{$record.get('id')}</Link>
  },
  {dataIndex:'brief',title:'Brief'},
  {dataIndex:'type'},
  {dataIndex:'team',className:'full-td',width:150,
    render:(text,$record)=>{
      let $teams=$record.get('teams');
      if($teams){
        const list = $teams.valueSeq().map($team=>{
          return (<div className="table-inner-td" key={$team.get('id')}>{$team.get('name')}</div>)
        });
        return <div className="table-inner-tr">{list}</div>
      }
    }
  },
  {dataIndex:'incentiveRate',showTitleTip:true,render:(text,$record)=>format.percent($record.get('incentiveRate'))},
  {dataIndex:'taxDiscountRate',showTitleTip:true,render:(text,$record)=>format.percent($record.get('taxDiscountRate'))},
  {dataIndex:'contact'},
  {dataIndex:'telephone'},
  {dataIndex:'address',width:150},
  {dataIndex:'email'},
]

// clients表单的column
export const clientsFormColumns=[
  {dataIndex:'id',required:true},
  {dataIndex:'brief',title:'Brief'},
  {dataIndex:'contact'},
  {dataIndex:'telephone'},
  {dataIndex:'address'},
  {dataIndex:'email'},
  {dataIndex:'type',Component:createArgumentSelect(argumentFields.clientType)},
  {dataIndex:'incentiveRate',Component:underlinePercentInput},
  {dataIndex:'taxDiscountRate',Component:underlinePercentInput}
]

// clientsdetail column

export const detailFormColumns=[
  {
    width:200,
    dataIndex:'name',
    title:'Team'
  },
  {
    width:200,
    dataIndex:'brief',
    Component:DefalutInput
  }
]
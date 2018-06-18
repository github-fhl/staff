import React from 'react'
import {Input,Icon,Popover} from 'antd'
import {YearInput} from 'components/column'
import { Link } from 'react-router'
import {routerMap} from 'routes/routers.config'
import SettingSelect from 'containers/SettingSelect'
import ArgumentSelect from 'containers/ArgumentSelect'
import {argumentFields} from 'common/config'
import {tableFilter,level} from 'common/config'
import {format} from 'common/format'
import ShowSettingTargetField from '../../../../containers/ShowSettingTargetField'

const setting=routerMap.setting;

//参数Select 创建器
const createArgumentSelect=(type,props)=>{
  return class extends React.PureComponent{
    render(){
      return <ArgumentSelect {...this.props} type={type} className="select-underline" {...props} />
    }
  }
}

//设置Select 创建器
const createSettingSelect=type=>{
  return class extends React.PureComponent{
    render(){
      return <SettingSelect {...this.props} type={type} className="select-underline" />
    }
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

// StdPos表格的column
const getLevelRender=type=>(e,$r)=>{
  const $item=$r.get('stdPosDetails').find($d=>$d.get(level.field)===level[type]);
  if($item){
    const $details=$item.get('stdPosPrices');
    let totalAmount=0;
    const content = (
      <table className="popover-table">
        <tbody>
        {
          $details.valueSeq().map($d=>{
            totalAmount+=$d.get('amount');
            return (
              <tr key={$d.get('salaryTypeId')}>
                <td className="title">{$d.get('salaryTypeId')}</td>
                <td className="amount">{format.money($d.get('amount'))}</td>
              </tr>
            )

          })
        }
        </tbody>
      </table>
    );
    return <Popover placement="bottomRight" content={content}><span className="has-popover">{format.money(totalAmount)}</span></Popover>
  }
}

export const stdPosTableColumns=[
  {dataIndex:'officeId',width:150,
    render:(text,$record)=>(
      <Link to={`/${setting.path}/${setting.offices.path}/${$record.get('officeId')}`}>
        {$record.get('officeId')}
      </Link>
    )},
  {dataIndex:'name',title:'Standard Position',width:260,
    render:(text,$record)=>(
      <Link to={`/${setting.path}/${setting.stdPoss.path}/${$record.get('name')}`}>
        {$record.get('name')}
      </Link>
    )
  },
  {dataIndex:'teamId',width:160,
    render:(text,$record)=>(
      <ShowSettingTargetField type={setting.teams.path} value={$record.get('teamId')} targetField='name' />
    )
  },
  {dataIndex:'location',title:'Local/Expat'},
  {
    dataIndex:'year',width:70,
    render:(text,$record)=>$record.getIn(['stdPosDetails',0,'year']),
    filterMultiple: false,
    filterIcon: <Icon type="search" />,
    filters: tableFilter.year
  },
  {dataIndex:'currencyId'},
  {dataIndex:'low',type:'money',render:getLevelRender('low')},
  {dataIndex:'middle',type:'money',render:getLevelRender('middle')},
  {dataIndex:'high',type:'money',render:getLevelRender('high')},
]

// StdPos表单的column
export const stdPosFormColumns=[
  {dataIndex:'name',required:true},
  {dataIndex:'teamId',Component:createSettingSelect(setting.teams.path)},
  {dataIndex:'location',Component:createArgumentSelect(argumentFields.location,{
    filterAction:$list=>$list.filter(name=>name!=='Common')
  }),title:'Local/Expat'},
  {dataIndex:'officeId',Component:createSettingSelect(setting.offices.path)},
  {dataIndex:'currencyId',Component:createSettingSelect(setting.currency.path)}
]

// StdPosdetail column

export const detailFormColumns=[
  {dataIndex:'skillLevel',disabled:$record=>!!$record.id,Component:createArgumentSelect(argumentFields.skillLevel)},
  {dataIndex:'year',Component:YearInput,disabled:$record=>!!$record.id},
]
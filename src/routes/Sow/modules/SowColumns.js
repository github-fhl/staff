import React from 'react'
import {Popover,Tooltip} from 'antd'
import { Link } from 'react-router'
import {format} from 'common/format'
import {argumentFields,host} from 'common/config'
import {YearInput,MoneyInputInForm,MoneyInput} from 'components/column'
import SettingSelect from 'containers/SettingSelect'
import ArgumentSelect from 'containers/ArgumentSelect'
import ShowSettingTargetField from 'containers/ShowSettingTargetField'
import {routerMap} from 'routes/routers.config'

const setting=routerMap.setting;
const sow=routerMap.sow;

//设置Select 创建器
const createSettingSelect=type=>{
  return class extends React.PureComponent{
    render(){
      return <SettingSelect {...this.props} type={type} className="select-underline" />
    }
  }
}

//参数Select 创建器
const createArgumentSelect=type=>{
  return class extends React.PureComponent{
    render(){
      return <ArgumentSelect {...this.props} type={type} className="select-underline" />
    }
  }
}

// YearInputInForm
class YearInputInForm extends React.PureComponent{
  render(){
    return <YearInput {...this.props} className="input-underline" />
  }
}

// Production Render
const getProductionRender=(text,$r)=>{
    const content = (
      <table className="popover-table">
        <tbody>
        <tr>
          <td className="title">Traditional</td>
          <td className="amount">{format.money($r.get('traditional'))}</td>
        </tr>
        <tr>
          <td className="title">Digital</td>
          <td className="amount">{format.money($r.get('digital'))}</td>
        </tr>
        <tr>
          <td className="title">CRM</td>
          <td className="amount">{format.money($r.get('CRM'))}</td>
        </tr>
        </tbody>
      </table>
    );
    return <Popover placement="bottomRight" content={content}><span className="has-popover">{format.money($r.get('production'))}</span></Popover>
}

export const sowDetailColumnsWith={
  expectStaffId:100,
  name:150
}

// SOW 表格的默认column
export const summaryTableColumns=[
  {dataIndex:'name',title:'SoW',width:150, fixed: 'left',
    render:(text,$record)=>(
      <Link to={`/${sow.path}/${$record.get('id')}`}>
        {$record.get('name')}
      </Link>)
  },
  {dataIndex:'version',width:75, fixed: 'left'},
  {dataIndex:'clientId'},
  {dataIndex:'flowStatus',width:150},
  {dataIndex:'positionNum',width:60},
  {dataIndex:'FTE',width:60},
  {dataIndex:'openPositionNum',width:60},
  {dataIndex:'currencyId'},
  {dataIndex:'net'},
  {dataIndex:'gross'},
  {dataIndex:'grandTotal'},
]

// SOW 表格的Pass Through column
export const passThroughTableColumns=[
  {dataIndex:'media',className:'bg-error'},
  {dataIndex:'production',render:getProductionRender,className:'bg-error'},
  {dataIndex:'travel',className:'bg-error'},
  {dataIndex:'total',className:'bg-error'},
  {dataIndex:'editPass',title:'PT Edit',width:80,className:'bg-error'}
]

// SOW Pass Through Form column
export const passThroughFormColumns=[
  {dataIndex:'digital',Component:MoneyInputInForm,width:250,color:'#006fd8'},
  {dataIndex:'CRM',Component:MoneyInputInForm,width:250,color:'#006fd8'},
  {dataIndex:'traditional',Component:MoneyInputInForm,width:250,color:'#006fd8'},
  {dataIndex:'production',disabled:true,Component:MoneyInputInForm,width:250,color:'#006fd8'},
  {dataIndex:'media',Component:MoneyInputInForm,width:250},
  {dataIndex:'travel',Component:MoneyInputInForm,width:250},
  {dataIndex:'total',disabled:true,Component:MoneyInputInForm,width:250},
]

// SOW 表格的Level column
export const levelTableColumns=[
  {dataIndex:'level1',className:'bg-info',width:50},
  {dataIndex:'level2',className:'bg-info',width:50},
  {dataIndex:'level3',className:'bg-info',width:50},
  {dataIndex:'level4',className:'bg-info',width:50},
  {dataIndex:'level5',className:'bg-info',width:50},
]

// SOW 表格的默认column
export const specialTableColumns=[
  {dataIndex:'name',title:'SoW',width:150,
  render:(text,$record)=>(
  <Link to={`/${sow.path}/${$record.get('id')}`}>
    {$record.get('name')}
  </Link>)
},
  {dataIndex:'sowType'},
  {dataIndex:'clientId'},
  {dataIndex:'positionNum'},
  {dataIndex:'FTE'},
  {dataIndex:'openPositionNum'},
  {dataIndex:'currencyId'},
  {dataIndex:'net'},
  {dataIndex:'gross'},
  {dataIndex:'grandTotal'},
]


// 创建 SOW column
export const createFormColumns=[
  {dataIndex:'year',Component:YearInputInForm,required:true,type:'number',},
  {dataIndex:'clientId',Component:createSettingSelect(setting.clients.path),required:true},
  {dataIndex:'name',required:true},
  {dataIndex:'sowType',required:true,Component:createArgumentSelect(argumentFields.clientType)},
  {dataIndex:'version',disabled:true},
  {dataIndex:'currencyId',Component:createSettingSelect(setting.currency.path),required:true},
]


// 复制 SOW column
export const copyTableColumns=[
  {dataIndex:'index',title:'Reference',render:(t,r,index)=>{
    if(index===0){
      return 'Target SoW'
    }else if(index===1){
      return 'New SoW'
    }
  }},
  {dataIndex:'name',title:'SoW',width:0,render:(text,$item)=>`${$item.get('name')} - ${$item.get('version')}`},
  {dataIndex:'FTE',width:50},
  {dataIndex:'currencyId'},
  {dataIndex:'net'},
  {dataIndex:'gross'},
  {dataIndex:'grandTotal'},
]


// SOW 表格的默认column
export const sowDetailTableColumns=[
  {dataIndex:'name',title:'Position',width:sowDetailColumnsWith.name},
  {dataIndex:'expectStaffId',width:sowDetailColumnsWith.expectStaffId,render:(t,$record)=>(
  <Tooltip>
    <div className="over-text" style={{width:sowDetailColumnsWith.expectStaffId-17}}>
      {$record.get('expectStaffId')}
    </div>
  </Tooltip>
  )},
  {dataIndex:'companyId',width:140},
  {dataIndex:'titleId'},
  {dataIndex:'stdPosId',width:280,
    render:(text,$record)=>(
      <ShowSettingTargetField type={setting.stdPoss.path} value={$record.get('stdPosId')} />
    )
  },
  {dataIndex:'sowLevel',width:130},
  {dataIndex:'teamId',width:180,
    render:(text,$record)=>(
      <ShowSettingTargetField type={setting.teams.path} value={$record.get('teamId')} />
    )
  },
  {dataIndex:'fordFunctionId',width:280},
  {dataIndex:'currencyId',title:'Local Currency',showTitleTip:true},
  {dataIndex:'FTE',width:90,path:['sowPosition']},
  {dataIndex:'net',path:['sowPosition'],className:'highlight0'},
  {dataIndex:'tax',path:['sowPosition']},
  {dataIndex:'gross',path:['sowPosition'],className:'highlight1'},
  {dataIndex:'incentive',path:['sowPosition']},
  {dataIndex:'grandTotal',path:['sowPosition'],className:'highlight2'},
]

export const sowDetailMoreTableColumns=[
  {dataIndex:'skillLevel'},
  {dataIndex:'officeId',width:180},
  {dataIndex:'HCCategory',width:150},
  {dataIndex:'location',title:'Local/Expat',width:120},
]

export const sowDetailSalaryTableColumns=[
  {dataIndex:'annualSalary'},
  {dataIndex:'annualCola'},
  {dataIndex:'bonus'},
  {dataIndex:'directComp',width:130,className:'highlight3'},
  {dataIndex:'benefits'},
  {dataIndex:'directLabor',width:130,className:'highlight5'},
]

const checkPoDisabled=key=>record=>isNaN(record[key]) || parseFloat(record[key])<=0;
export const viewPoFilesTableColumns=[
  {dataIndex:'po',title:'PO #',hasRender:true,render:(t,r,i)=>`PO ${i+1}`},
  {dataIndex:'gross',Component:MoneyInput,disabled:checkPoDisabled('gross')},
  {dataIndex:'incentive',Component:MoneyInput,disabled:checkPoDisabled('incentive')},
  {dataIndex:'grandTotal',Component:MoneyInput,disabled:checkPoDisabled('grandTotal')},
  {dataIndex:'production',Component:MoneyInput,disabled:checkPoDisabled('production')},
  {dataIndex:'travel',Component:MoneyInput,disabled:checkPoDisabled('travel')},
  {dataIndex:'media',Component:MoneyInput,disabled:checkPoDisabled('media')},
  {dataIndex:'total',Component:MoneyInput,disabled:checkPoDisabled('total')},
  {dataIndex:'filePath',hasRender:true,render:text=><a href={`${host}${text}`} target="blank">View</a>},
]

// 更新 position Sow
export const positionSowTableColumns=[
  {dataIndex:'name',path:['sow'],width:130},
  {dataIndex:'version',path:['sow']},
  {dataIndex:'clientId',path:['sow']},
  {dataIndex:'FTE'},
  {dataIndex:'net',title:'Client Net'},
  {dataIndex:'tax',title:'Client Tax'},
  {dataIndex:'gross',title:'Client Gross'},
  {dataIndex:'incentive',title:'Client Incentive',width:130},
  {dataIndex:'grandTotal'},
]

// BindPosition 的 column
export const bindPositionTableColumns=[
  {dataIndex:'name',title:'Position',width:120,
    render:(text,record)=>(
      <Link to={`${location.pathname.replace(/\/$/,'')}/${record.id}`}>
        {record.name}
      </Link>)
  },
  {dataIndex:'companyId'},
  {dataIndex:'titleId'},
  {dataIndex:'teamId',
    render:(text,record)=><ShowSettingTargetField type={setting.teams.path} value={record.teamId} />
  },
  {dataIndex:'fordFunctionId',width:200},
]
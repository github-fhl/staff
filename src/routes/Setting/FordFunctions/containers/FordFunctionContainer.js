import React from 'react'
import {Icon,Switch} from 'antd'
import {disabledFordFunction,enabledFordFunction} from 'routes/Setting/modules/setting'
import { connect } from 'react-redux'
import FordFunction from '../../components/SettingBody'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {fordFunctionTableColumns,searchColumns} from '../modules/fordFunction'
import Columns from 'common/columns'
import {fetchFordFunctions} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;
const tableColumns=new Columns(fordFunctionTableColumns);

const mapDispatchToProps = dispatch=>{
  return {
    dispatch,
    onCreate:()=>browserHistory.push(`/${setting.path}/${setting.fordFunctions.path}/${setting.fordFunctions.create.path}`),
    onChange:(pagination, filters, sorter)=>{
      if(Object.keys(filters).length>0){
        if(filters.year){
          dispatch(fetchFordFunctions({year:filters.year[0]}))
        }
      }
    }
  }
}

const mapStateToProps = (state) => ({
  dataSource : state[setting.path].get(setting.fordFunctions.path),
  columns:tableColumns.table,
  searchColumns
})

export default connect(mapStateToProps, mapDispatchToProps)(props=><FordFunction {...props} columns={

  // 更新ford function 状态并实时更新到redux中
  tableColumns.updateTable({operation:{
    render:(t,$record)=>{
      return (
        <Switch
          onChange={
            e=>{
              if(e){
                props.dispatch(enabledFordFunction($record.get('id')))
              }else{
                props.dispatch(disabledFordFunction($record.get('id')))
              }
            }
          }
          defaultChecked={!!$record.get('status')}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="cross" />}
        />
      )
    }
  }})
} />)
import React from 'react'
import { connect } from 'react-redux'
import StdPos from '../../components/SettingBody'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {stdPosTableColumns,searchColumns} from '../modules/stdPoss'
import Columns from 'common/columns'
import {fetchStdPoss} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;
const tableColumns=new Columns(stdPosTableColumns);

const mapDispatchToProps = dispatch=>({
  onCreate:()=>browserHistory.push(`/${setting.path}/${setting.stdPoss.path}/${setting.stdPoss.create.path}`),
  onChange:(pagination, filters, sorter)=>{
    if(Object.keys(filters).length>0){
      if(filters.year){
        dispatch(fetchStdPoss({year:filters.year[0]}))
      }
    }
  }
})

const mapStateToProps = (state) => ({
  dataSource : state[setting.path].get(setting.stdPoss.path),
  columns:tableColumns.table,
  searchColumns
})

export default connect(mapStateToProps, mapDispatchToProps)(StdPos)
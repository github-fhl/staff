import React from 'react'
import { connect } from 'react-redux'
import Office from '../../components/SettingBody'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {officeTableColumns,searchColumns} from '../modules/office'
import Columns from 'common/columns'
import {fetchOffices} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;
const tableColumns=new Columns(officeTableColumns);

const mapDispatchToProps = dispatch=>({
  onCreate:()=>browserHistory.push(`/${setting.path}/${setting.offices.path}/${setting.offices.create.path}`),
  onChange:(pagination, filters, sorter)=>{
    if(Object.keys(filters).length>0){
      if(filters.year){
        dispatch(fetchOffices({year:filters.year[0]}))
      }
    }
  }
})

const mapStateToProps = (state) => ({
  dataSource : state[setting.path].get(setting.offices.path),
  columns:tableColumns.table,
  searchColumns
})

export default connect(mapStateToProps, mapDispatchToProps)(Office)
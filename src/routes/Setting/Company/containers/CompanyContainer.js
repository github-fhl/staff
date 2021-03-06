import React from 'react'
import { connect } from 'react-redux'
import Company from '../../components/SettingBody'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {companyTableColumns,searchColumns} from '../modules/company'
import Columns from 'common/columns'
import {fetchCompanys} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;
const tableColumns=new Columns(companyTableColumns);

const mapDispatchToProps = dispatch=>({
  onCreate:()=>browserHistory.push(`/${setting.path}/${setting.company.path}/${setting.company.create.path}`),
  onChange:(pagination, filters, sorter)=>{
    if(Object.keys(filters).length>0){
      if(filters.year){
        dispatch(fetchCompanys({year:filters.year[0]}))
      }
    }
  }
})

const mapStateToProps = (state) => ({
  dataSource : state[setting.path].get(setting.company.path),
  columns:tableColumns.table,
  searchColumns
})

export default connect(mapStateToProps, mapDispatchToProps)(Company)
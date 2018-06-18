import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Clients from '../../components/SettingBody'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {clientsTableColumns,searchColumns} from '../modules/clients'
import Columns from 'common/columns'
import {format} from 'common/format'
import {fetchClients} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;

// clients表格的 column
const tableColumns=new Columns(clientsTableColumns);


const mapDispatchToProps = dispatch=>({
  onCreate:()=>browserHistory.push(`/${setting.path}/${setting.clients.path}/${setting.clients.create.path}`),
  onChange:(pagination, filters, sorter)=>{
    if(Object.keys(filters).length>0){
      if(filters.year){
        dispatch(fetchClients({year:filters.year[0]}))
      }
    }
  }
})

const mapStateToProps = (state) => ({
  dataSource : state[setting.path].get(setting.clients.path),
  columns:tableColumns.table,
  searchColumns
})

export default connect(mapStateToProps, mapDispatchToProps)(Clients)
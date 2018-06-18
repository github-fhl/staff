import React from 'react'
import { connect } from 'react-redux'
import Currency from '../../components/SettingBody'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {currencyTableColumns,searchColumns} from '../modules/currency'
import Columns from 'common/columns'
import {fetchCurrencys} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;
const tableColumns=new Columns(currencyTableColumns);

const mapDispatchToProps = dispatch=>({
  onCreate:()=>browserHistory.push(`/${setting.path}/${setting.currency.path}/${setting.currency.create.path}`),
  onChange:(pagination, filters, sorter)=>{
    if(Object.keys(filters).length>0){
      if(filters.year){
        dispatch(fetchCurrencys({year:filters.year[0]}))
      }
    }
  }
})

const mapStateToProps = (state) => ({
  dataSource : state[setting.path].get(setting.currency.path),
  columns:tableColumns.table,
  searchColumns
})

export default connect(mapStateToProps, mapDispatchToProps)(Currency)
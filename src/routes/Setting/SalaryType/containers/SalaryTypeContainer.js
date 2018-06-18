import React from 'react'
import { connect } from 'react-redux'
import SalaryType from '../components/SalaryBody'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {searchColumns} from '../modules/salaryType'
import {fetchSalaryTypes} from 'routes/Setting/modules/setting'
import './SalaryTypeContainer.scss'

const setting=routerMap.setting;


const mapDispatchToProps = dispatch=>({
  dispatch,
  onCreate:()=>browserHistory.push(`/${setting.path}/${setting.salaryTypes.path}/${setting.salaryTypes.create.path}`),
  onChange:(pagination, filters, sorter)=>{
    if(Object.keys(filters).length>0){
      if(filters.year){
        dispatch(fetchSalaryTypes({year:filters.year[0]}))
      }
    }
  }
})

const mapStateToProps = (state) => {
  const $salary=state[setting.path].get(setting.salaryTypes.path);
  let dataSource;
  let dataSourceSize=0;
  if($salary){
    dataSource=$salary.sortBy($d => $d.get('index'));
    dataSourceSize=$salary.size;
  }
  return {
    dataSource,
    dataSourceSize,
    searchColumns
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SalaryType)
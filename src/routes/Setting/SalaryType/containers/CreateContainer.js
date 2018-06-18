import React from 'react'
import { connect } from 'react-redux'
import SalaryTypeCreate from '../components/SalaryTypeCreate'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {createSalaryTypes} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;

const mapDispatchToProps = dispatch=>({
  onSave:params=>dispatch(createSalaryTypes(params)).then(e=>{
    console.log('onsave ==',e)
    if(!e.error){
      browserHistory.push(`/${setting.path}/${setting.salaryTypes.path}`)
    }
    return e;
  })
})

export default connect(null, mapDispatchToProps)(SalaryTypeCreate)
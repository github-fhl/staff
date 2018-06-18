import React from 'react'
import { connect } from 'react-redux'
import CompanyCreate from '../components/CompanyCreate'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {createCompanys} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;

const mapDispatchToProps = dispatch=>({
  onSave:params=>dispatch(createCompanys(params)).then(e=>{
    console.log('onsave ==',e)
    if(!e.error){
      browserHistory.push(`/${setting.path}/${setting.company.path}/${params.id}`)
    }
    return e;
  })
})

export default connect(null, mapDispatchToProps)(CompanyCreate)
import React from 'react'
import { connect } from 'react-redux'
import OfficeCreate from '../components/OfficeCreate'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {createOffices} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;

const mapDispatchToProps = dispatch=>({
  onSave:params=>dispatch(createOffices(params)).then(e=>{
    console.log('onsave ==',e)
    if(!e.error){
      browserHistory.push(`/${setting.path}/${setting.offices.path}/${params.id}`)
    }
    return e;
  })
})

export default connect(null, mapDispatchToProps)(OfficeCreate)
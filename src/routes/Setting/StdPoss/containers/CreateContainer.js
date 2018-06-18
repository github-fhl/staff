import React from 'react'
import { connect } from 'react-redux'
import StdPosCreate from '../components/StdPossCreate'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {createStdPoss} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;

const mapDispatchToProps = dispatch=>({
  onSave:params=>dispatch(createStdPoss(params)).then(e=>{
    if(!e.error){
      browserHistory.push(`/${setting.path}/${setting.stdPoss.path}/${params.name}`)
    }
    return e;
  })
})

export default connect(null, mapDispatchToProps)(StdPosCreate)
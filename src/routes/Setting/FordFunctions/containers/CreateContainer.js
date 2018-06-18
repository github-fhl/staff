import React from 'react'
import { connect } from 'react-redux'
import FordFunctionCreate from '../components/FordFunctionCreate'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {createFordFunctions} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;

const mapDispatchToProps = dispatch=>({
  onSave:params=>dispatch(createFordFunctions(params)).then(e=>{
    if(!e.error){
      browserHistory.push(`/${setting.path}/${setting.fordFunctions.path}`)
    }
    return e;
  })
})

export default connect(null, mapDispatchToProps)(FordFunctionCreate)
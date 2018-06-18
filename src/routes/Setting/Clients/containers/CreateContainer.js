import React from 'react'
import { connect } from 'react-redux'
import ClientsCreate from '../components/ClientsCreate'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {createClients} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;

const mapDispatchToProps = dispatch=>({
  onSave:params=>dispatch(createClients(params)).then(e=>{
    console.log('onsave ==',e)
    if(!e.error){
      browserHistory.push(`/${setting.path}/${setting.clients.path}/${params.id}`)
    }
    return e;
  })
})

export default connect(null, mapDispatchToProps)(ClientsCreate)
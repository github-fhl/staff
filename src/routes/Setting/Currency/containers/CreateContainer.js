import React from 'react'
import { connect } from 'react-redux'
import CurrencyCreate from '../components/CurrencyCreate'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {createCurrencys} from 'routes/Setting/modules/setting'

const setting=routerMap.setting;

const mapDispatchToProps = dispatch=>({
  onSave:params=>dispatch(createCurrencys(params)).then(e=>{
    console.log('onsave ==',e)
    if(!e.error){
      browserHistory.push(`/${setting.path}/${setting.currency.path}/${params.id}`)
    }
    return e;
  })
})

export default connect(null, mapDispatchToProps)(CurrencyCreate)
import React from 'react'
import { connect } from 'react-redux'
import Update from '../components/CurrencyUpdate'
import {routerMap} from 'routes/routers.config'
const setting=routerMap.setting;


const mapStateToProps = (state,props) => ({
  $initialValue:state[setting.path].getIn([setting.currency.path,props.params.id])
})

export default connect(mapStateToProps)(Update)
import React from 'react'
import { connect } from 'react-redux'
import Update from '../components/StdPossUpdate'
import {routerMap} from 'routes/routers.config'

const setting=routerMap.setting;

const mapStateToProps = (state,props) => ({
  $salary:state[setting.path].get(setting.salaryTypes.path),
  $initialValue: state[setting.path].get(setting.stdPoss.path) &&
                 state[setting.path].get(setting.stdPoss.path).find($sp=>$sp.get('name')===props.params.id)
})

export default connect(mapStateToProps)(Update)
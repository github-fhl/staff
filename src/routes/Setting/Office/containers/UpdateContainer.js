import React from 'react'
import {message} from 'antd'
import { connect } from 'react-redux'
import Update from '../components/OfficeUpdate'
import {updateOffices} from 'routes/Setting/modules/setting'
import {routerMap} from 'routes/routers.config'
import {msg} from 'common/config'

const setting=routerMap.setting;

const mapDispatchToProps = (dispatch,props)=>({
  dispatch,

  onSave:params=>dispatch(updateOffices(params)).then(e=>{
    if(!e.error){
      message.success(msg.saveSuccess,1)
    }
    return e;
  })
})

const mapStateToProps = (state,props) => ({
  $initialValue:state[setting.path].getIn([setting.offices.path,props.params.id])
})

export default connect(mapStateToProps, mapDispatchToProps)(Update)
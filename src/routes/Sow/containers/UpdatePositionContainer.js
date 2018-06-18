import { connect } from 'react-redux'
import UpdatePositionWarp from '../components/UpdatePositionWarp'
import {routerMap} from 'routes/routers.config'
import {fetchAllSow} from '../modules/sow'

const mapDispatchToProps = {fetchAllSow}

const mapStateToProps = (state) => ({
  coreCompany : state.arguments.getIn(['cfg','coreCompany']),
  $setting : state[routerMap.setting.path],
  $sow:state[routerMap.sow.path]
})
export default connect(mapStateToProps,mapDispatchToProps)(UpdatePositionWarp)
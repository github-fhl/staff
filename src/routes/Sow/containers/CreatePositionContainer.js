import { connect } from 'react-redux'
import CreatePosition from '../components/CreatePositionWarp'
import {routerMap} from 'routes/routers.config'

const mapStateToProps = (state) => ({
  $setting : state[routerMap.setting.path]
})
export default connect(mapStateToProps)(CreatePosition)
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PageLayout from '../components/layouts/PageLayout'
import {logout} from 'routes/Login/modules/login'

const mapStateToProps = (state) => ({
  location:state.location,
  $user:state.user
})

const mapDispatchToProps =dispatch=>({
  logout:()=>dispatch(logout()),
  pathJump:(path)=>browserHistory.push(path)
});
export default connect(mapStateToProps,mapDispatchToProps)(PageLayout)
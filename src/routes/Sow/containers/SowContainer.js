import { connect } from 'react-redux'
import Sow from '../components/SowSummary'
import {fetchAllSow,createSow,copyCommitSow,editPassThrough} from '../modules/sow'

const mapDispatchToProps = {fetchAllSow,createSow,copyCommitSow,editPassThrough}

const mapStateToProps = (state) => ({
  $sow : state.sow
})
export default connect(mapStateToProps,mapDispatchToProps)(Sow)
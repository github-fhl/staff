import { connect } from 'react-redux'
import SowDetailEntryPO from '../components/SowDetailEntryPO'

const mapStateToProps = (state) => ({
  adjustMoneyUSD : state.arguments.getIn(['cfg','adjustMoneyUSD'])
})
export default connect(mapStateToProps)(SowDetailEntryPO)
import React from 'react'
import { connect } from 'react-redux'
import SowDetail from '../components/SowDetail'

const mapStateToProps = (state,props) => ({
  $transitions : state.arguments.get('sowTransitions'),
  adjustMoneyUSD : state.arguments.getIn(['cfg','adjustMoneyUSD'])
})

export default connect(mapStateToProps)(SowDetail)
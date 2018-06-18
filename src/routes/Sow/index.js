import SowContainer from './containers/SowContainer'
import SowDetailContainer from './containers/SowDetailContainer'
import EntryPOContainer from './containers/EntryPOContainer'
import CreatePositionContainer from './containers/CreatePositionContainer'
import UpdatePositionContainer from './containers/UpdatePositionContainer'
import reducer from './modules/sow'
import { injectReducer } from '../../store/reducers'

export default (store) => {
  return {
    path        : 'sow',
    onEnter: function () {
      injectReducer(store, { key: 'sow', reducer });
    },
    indexRoute:{
      component:SowContainer,
    },
    childRoutes:[{
      path    :':id/entry-po',
      component:EntryPOContainer
    },{
      path    :':id/create',
      component:CreatePositionContainer
    },{
      path    :':id/:positionId',
      component:UpdatePositionContainer
    },{
      path    :':id',
      component:SowDetailContainer,
      childRoutes:[]
    }]
  }
}

import { injectReducer } from 'store/reducers'
import Login from './containers/LoginContainer'
import reducer  from './modules/login'

export default (store) => {
  injectReducer(store, { key: 'user', reducer });
  return {
    path : 'login',
    component:Login,
    onEnter: function (nextState, replace,callback) {
      if(nextState.user && nextState.user.get('id')){

        //如果用户信息存在则跳转到首页
        replace('/home')
      }
      callback()
    }
  }
}


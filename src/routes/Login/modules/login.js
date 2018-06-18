import { browserHistory } from 'react-router'
import Immutable from 'immutable'
import {easyfetch} from 'utils/fetch'
import api from 'common/api'
// ------------------------------------
// Constants
// ------------------------------------

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
export const GET_USER_INFO = 'GET_USER_INFO'

// ------------------------------------
// Actions
// ------------------------------------

// 用户登录
export const login = (params) => {
  return (dispatch, getState) => {
    return easyfetch({
        url:api.account.login,
        type:'put',
        data:params
      })
      .then(e=>
        dispatch({
          type:USER_LOGGED_IN,
          payload:Immutable.fromJS(e.obj)
        })
      )
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 用户登出
export function logout () {
  console.log('logout');
  return (dispatch, getState) => {
    return easyfetch({
        url:api.account.logout,
        type:'put'
      })
      .then(e=>{
        dispatch({type:USER_LOGGED_OUT});
        return e;
      }).catch(json=>{
        browserHistory.push(`/login?next=${location.pathname}`)
      })
      .catch(error =>({error:error}))
  }
}

//获取用户信息
export const getUserInfo = () => {
  return (dispatch, getState) => {
    return easyfetch({
        url:api.account.userinfo,
      })
      .then(e=>{

        try {
          dispatch({
            type:GET_USER_INFO,
            payload:Immutable.fromJS(e.obj)
          })
        }catch (e){
          console.log(e)
        }
        return e;
      })
      .catch(error =>({error:error}))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USER_LOGGED_OUT]    : () =>null,
  [USER_LOGGED_IN] : (state, action) => {
    return action.payload;
  },
  [GET_USER_INFO] : (state, action) => {
    return action.payload;
  }
}


// ------------------------------------
// Reducer
// ------------------------------------

const initialState = null
export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
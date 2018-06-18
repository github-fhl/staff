import api from '../common/api'
import {easyfetch} from '../utils/fetch'
import Immutable from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_ARGUMENTS = 'FETCH_ARGUMENTS'

// ------------------------------------
// Actions
// ------------------------------------

// 获取参数
export const fetchArguments = () => {
  return dispatch => {
    return easyfetch({
      url:api.arguments.fetch,
    })
      .then(e=>{
        dispatch({
          type:FETCH_ARGUMENTS,
          payload:Immutable.fromJS(e)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [FETCH_ARGUMENTS] : (state, action) => action.payload,
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = Immutable.Map();
export default function argumentsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
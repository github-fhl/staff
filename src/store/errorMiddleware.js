import {message} from 'antd'

export const errorMiddleware = store => next => action => {
  if(action.type==='FETCH_ERROR'){
    message.error(action.error.message)
    console.log('error action',action)
  }
  return next(action);
}
import { combineReducers } from 'redux'
import locationReducer from './location'
import argumentsReducer from './arguments'
import settingReducer from '../routes/Setting/modules/setting'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    setting: settingReducer,
    arguments: argumentsReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer

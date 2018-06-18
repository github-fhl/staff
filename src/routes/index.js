// We only need to import the modules necessary for initial render
import React from 'react'
import CoreLayout from '../containers/Layouts'
import Home from './Home'
import CounterRoute from './Counter'
import Login from './Login'
import {checkLogin} from '../HOC/checkLogin'
import SowRoute from './Sow'
import settingRouter from './Setting/settingRouter'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/',
  indexRoute:{
    onEnter: function (nextState, replace) {
      replace('/home')
    }
  },
  childRoutes : [
    Login(store),{
    component:checkLogin(CoreLayout),
    childRoutes:[
      {
      path        :'home',
      indexRoute  : Home
      },
      //setting
      settingRouter,
      CounterRoute(store),
      SowRoute(store),
    ]
  }]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes

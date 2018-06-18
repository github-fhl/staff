import React from 'react'
import {routerMap} from 'routes/routers.config'
import Company from './Company/containers/CompanyContainer'
import CreateCompany from './Company/containers/CreateContainer'
import UpdateCompany from './Company/containers/UpdateContainer'
import Clients from './Clients/containers/ClientsContainer'
import CreateClients from './Clients/containers/CreateContainer'
import UpdateClients from './Clients/containers/UpdateContainer'

import Offices from './Office/containers/OfficeContainer'
import CreateOffices from './Office/containers/CreateContainer'
import UpdateOffices from './Office/containers/UpdateContainer'

import FordFunctions from './FordFunctions/containers/FordFunctionContainer'
import CreateFordFunctions from './FordFunctions/containers/CreateContainer'

import Currencys from './Currency/containers/CurrencyContainer'
import CreateCurrencys from './Currency/containers/CreateContainer'
import UpdateCurrencys from './Currency/containers/UpdateContainer'

import SalaryType from './SalaryType/containers/SalaryTypeContainer'
import CreateSalaryType from './SalaryType/containers/CreateContainer'
import StdPoss from './StdPoss/containers/StdPossContainer'
import CreateStdPoss from './StdPoss/containers/CreateContainer'
import UpdateStdPoss from './StdPoss/containers/UpdateContainer'


const setting=routerMap.setting
// Sync route definition
export default {
  path        :setting.path,
  indexRoute:{
    onEnter: function (nextState, replace) {
      replace(`/${setting.path}/${setting.company.path}`)
    }
  },
  childRoutes :[
    {
      path    :setting.company.path,
      indexRoute:{
        component:Company
      },
      childRoutes :[
        {
          path:   'create',
          component:CreateCompany
        },
        {
          path    :':id',
          component:UpdateCompany
        }
      ]
    },
    {
      path    :setting.clients.path,
      indexRoute:{
        component:Clients
      },
      childRoutes :[
        {
          path:   'create',
          component:CreateClients
        },
        {
          path    :':id',
          component:UpdateClients
        }
      ]
    },
    {
      path    :setting.offices.path,
      indexRoute:{
        component:Offices
      },
      childRoutes :[
        {
          path:   'create',
          component:CreateOffices
        },
        {
          path    :':id',
          component:UpdateOffices
        }
      ]
    },
    {
      path    :setting.fordFunctions.path,
      indexRoute:{
        component:FordFunctions
      },
      childRoutes :[
        {
          path:   'create',
          component:CreateFordFunctions
        }
      ]
    },
    {
      path    :setting.salaryTypes.path,
      indexRoute:{
        component:SalaryType
      },
      childRoutes :[
        {
          path:   'create',
          component:CreateSalaryType
        }
      ]
    },
    {
      path    :setting.currency.path,
      indexRoute:{
        component:Currencys
      },
      childRoutes :[
        {
          path:   'create',
          component:CreateCurrencys
        },
        {
          path    :':id',
          component:UpdateCurrencys
        }
      ]
    },
    {
      path    :setting.stdPoss.path,
      indexRoute:{
        component:StdPoss
      },
      childRoutes :[
        {
          path:   'create',
          component:CreateStdPoss
        },
        {
          path    :':id',
          component:UpdateStdPoss
        }
      ]
    }
  ]
}

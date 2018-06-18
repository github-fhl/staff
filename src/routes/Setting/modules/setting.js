import Immutable from 'immutable'
import {easyfetch} from '../../../utils/fetch'
import {arrayToImmutableMap} from '../../../utils/'
import api from '../../../common/api'
import {routerMap} from 'routes/routers.config'
const settingRouters=routerMap.setting

//后端返回所有字段对应key值
const apiSettingField={
  [settingRouters.company.path]:'companys',
  [settingRouters.clients.path]:'clients',
  [settingRouters.currency.path]:'currencys',
  [settingRouters.fordFunctions.path]:'fordFunctions',
  [settingRouters.offices.path]:'offices',
  [settingRouters.salaryTypes.path]:'salaryTypes',
  [settingRouters.stdPoss.path]:'stdPoss',
  [settingRouters.teams.path]:'teams',
  titles:'titles',
}

// ------------------------------------
// Constants
// ------------------------------------

export const FETCH_SETTING_ALL = 'FETCH_SETTING_ALL'
export const FETCH_SETTING_COMPANYS = 'FETCH_SETTING_COMPANYS'
export const FETCH_SETTING_CLIENTS = 'FETCH_SETTING_CLIENTS'
export const FETCH_SETTING_TEAMS = 'FETCH_SETTING_TEAMS'
export const FETCH_SETTING_OFFICES = 'FETCH_SETTING_OFFICES'
export const FETCH_SETTING_FORD_FUNCTIONS = 'FETCH_SETTING_FORD_FUNCTIONS'
export const UPDATE_SETTING_FORD_FUNCTIONS_STATUS = 'UPDATE_SETTING_FORD_FUNCTIONS_STATUS'
export const FETCH_SETTING_SALARY_TYPES = 'FETCH_SETTING_SALARY_TYPES'
export const UPDATE_SETTING_SALARY_TYPES_INDEX = 'UPDATE_SETTING_SALARY_TYPES_INDEX'
export const FETCH_SETTING_CURRENCY = 'FETCH_SETTING_CURRENCY'
export const FETCH_SETTING_STD_POSS = 'FETCH_SETTING_STD_POSS'

// ------------------------------------
// Actions
// ------------------------------------

//获取有所设置数据
export const fetchAllSetting=()=>{
  return dispatch => {
    return easyfetch({
      url:api.setting.fetch,
    })
      .then(e=>{
        let data=e.obj;
        let $newSetting=Immutable.Map();
        for(let key in apiSettingField){
           let dataField=apiSettingField[key];
          if(data[dataField]){
            $newSetting=$newSetting.set(key,arrayToImmutableMap()(data[dataField].rows))
          }
        }
        dispatch({
          type:FETCH_SETTING_ALL,
          payload:$newSetting
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}


// 获取公司
export const fetchCompanys = (params) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.companys.fetch,
      data:params
    })
      .then(e=>{
        dispatch({
          type:FETCH_SETTING_COMPANYS,
          payload:arrayToImmutableMap()(e.objs)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 获取单条公司
export const fetchSingleCompanys = (id) => {
    return easyfetch({
      url:api.setting.companys.fetchSingle+id,
    })
      .then(e=>e.obj)
      .catch(error =>({error:error}))
}

// 创建公司
export const createCompanys = (data) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.companys.create,
      type:'post',
      data
    })
      .then(e=>{
        dispatch(fetchCompanys()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 更新公司
export const updateCompanys = ({id,...data}) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.companys.update+id,
      type:'put',
      data
    })
      .then(e=>{
        dispatch(fetchCompanys()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 创建公司detail
export const createCompanyDetail = (data) => {
    return easyfetch({
      url:api.setting.companys.createDetail,
      type:'post',
      data
    })
      .then(e=>e.obj)
      .catch(error =>({error:error}))
}

// 更新公司detail
export const updateCompanyDetail = ({id,...data}) => {
    return easyfetch({
      url:api.setting.companys.updateDetail+id,
      type:'put',
      data
    })
      .then(e=>e.obj)
      .catch(error =>({error:error}))
}

/**
* 
*  Clients
*  
**/


// 获取 Clients
export const fetchClients = (params) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.clients.fetch,
      data:params
    })
      .then(e=>{
        dispatch({
          type:FETCH_SETTING_CLIENTS,
          payload:arrayToImmutableMap()(e.objs)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 获取 Teams
export const fetchTeams = (params) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.teams.fetch,
      data:params
    })
      .then(e=>{
        dispatch({
          type:FETCH_SETTING_TEAMS,
          payload:arrayToImmutableMap()(e.objs)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 获取单条 Clients
export const fetchSingleClients = (id) => {
  return easyfetch({
    url:api.setting.clients.fetchSingle+id,
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 创建 Clients
export const createClients = (data) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.clients.create,
      type:'post',
      data
    })
      .then(e=>{
        dispatch(fetchClients()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 更新 Clients
export const updateClients = ({id,...data}) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.clients.update+id,
      type:'put',
      data
    })
      .then(e=>{
        dispatch(fetchClients()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 创建 Client Team
export const createClientsDetail = (data) => {
  return easyfetch({
    url:api.setting.clients.createTeam,
    type:'post',
    data
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}


// 更新 Client Team
  export const updateClientsDetail = ({id,...data}) => {
    return easyfetch({
      url:api.setting.clients.updateTeam+id,
      type:'put',
      data
    })
      .then(e=>e.obj)
      .catch(error =>({error:error}))
  }



/**
 *
 *  Offices
 *
 **/

// 获取Offices
export const fetchOffices = (params) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.offices.fetch,
      data:params
    })
      .then(e=>{
        dispatch({
          type:FETCH_SETTING_OFFICES,
          payload:arrayToImmutableMap()(e.objs)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 获取单条Offices
export const fetchSingleOffices = (id) => {
  return easyfetch({
    url:api.setting.offices.fetchSingle+id,
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 创建Offices
export const createOffices = (data) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.offices.create,
      type:'post',
      data
    })
      .then(e=>{
        dispatch(fetchOffices()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 更新Offices
export const updateOffices = ({id,...data}) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.offices.update+id,
      type:'put',
      data
    })
      .then(e=>{
        dispatch(fetchOffices()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 创建Officesdetail
export const createOfficeDetail = (data) => {
  return easyfetch({
    url:api.setting.offices.createDetail,
    type:'post',
    data
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 更新Officesdetail
export const updateOfficeDetail = ({id,...data}) => {
  return easyfetch({
    url:api.setting.offices.updateDetail+id,
    type:'put',
    data
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}


/**
 *
 *  FordFunctions
 *
 **/

// 获取FordFunctions
export const fetchFordFunctions = (params) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.fordFunctions.fetch,
      data:params
    })
      .then(e=>{
        dispatch({
          type:FETCH_SETTING_FORD_FUNCTIONS,
          payload:arrayToImmutableMap()(e.objs)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 获取单条FordFunctions
export const fetchSingleFordFunctions = (id) => {
  return easyfetch({
    url:api.setting.fordFunctions.fetchSingle+id,
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 创建FordFunctions
export const createFordFunctions = (data) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.fordFunctions.create,
      type:'post',
      data
    })
      .then(e=>{
        dispatch(fetchFordFunctions()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 禁用 FordFunction
export const disabledFordFunction = (id) => {
  return dispatch => {
    return easyfetch({
      url: api.setting.fordFunctions.disabled + id,
      type: 'delete'
    })
      .then(e=>{
        dispatch({
          type:UPDATE_SETTING_FORD_FUNCTIONS_STATUS,
          payload:{id,status:0}
        })
        return e.obj;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 启用 FordFunction
export const enabledFordFunction = (id) => {
  return dispatch => {
    return easyfetch({
      url: api.setting.fordFunctions.enabled + id,
      type: 'put'
    })
      .then(e=>{
        dispatch({
          type:UPDATE_SETTING_FORD_FUNCTIONS_STATUS,
          payload:{id,status:1}
        })
        return e.obj;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}



/**
 *
 *  Currencys
 *
 **/

// 获取Currencys
export const fetchCurrencys = (params) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.currencys.fetch,
      data:params
    })
      .then(e=>{
        dispatch({
          type:FETCH_SETTING_CURRENCY,
          payload:arrayToImmutableMap()(e.objs)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 获取单条Currencys
export const fetchSingleCurrencys = (id) => {
  return easyfetch({
    url:api.setting.currencys.fetchSingle+id,
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 创建Currencys
export const createCurrencys = (data) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.currencys.create,
      type:'post',
      data
    })
      .then(e=>{
        dispatch(fetchCurrencys()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}


// 创建Currencysdetail
export const createCurrencyDetail = (data) => {
  return easyfetch({
    url:api.setting.currencys.createDetail,
    type:'post',
    data
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 更新Currencysdetail
export const updateCurrencyDetail = ({id,...data}) => {
  return easyfetch({
    url:api.setting.currencys.updateDetail+id,
    type:'put',
    data
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

/**
 *
 *  StdPoss
 *
 **/

// 获取StdPoss
export const fetchStdPoss = (params) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.stdposs.fetch,
      data:params
    })
      .then(e=>{
        dispatch({
          type:FETCH_SETTING_STD_POSS,
          payload:arrayToImmutableMap()(e.objs)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 获取单条StdPoss
export const fetchSingleStdPoss = (id) => {
  return easyfetch({
    url:api.setting.stdposs.fetchSingle+id,
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 创建StdPoss
export const createStdPoss = (data) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.stdposs.create,
      type:'post',
      data
    })
      .then(e=>{
        dispatch(fetchStdPoss()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}


// 创建StdPossdetail
export const createStdPosDetail = (data) => {
  return easyfetch({
    url:api.setting.stdposs.createDetail,
    type:'post',
    data
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 更新StdPossdetail
export const updateStdPosDetail = ({id,...data}) => {
  return easyfetch({
    url:api.setting.stdposs.updateDetail+id,
    type:'put',
    data
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

/**
 *
 *  SalaryTypes
 *
 **/

// 获取SalaryTypes
export const fetchSalaryTypes = (params) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.salaryTypes.fetch,
      data:params
    })
      .then(e=>{
        dispatch({
          type:FETCH_SETTING_SALARY_TYPES,
          payload:arrayToImmutableMap()(e.objs)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 获取单条SalaryTypes
export const fetchSingleSalaryTypes = (id) => {
  return easyfetch({
    url:api.setting.salaryTypes.fetchSingle+id,
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 创建SalaryTypes
export const createSalaryTypes = (data) => {
  return dispatch => {
    return easyfetch({
      url:api.setting.salaryTypes.create,
      type:'post',
      data
    })
      .then(e=>{
        dispatch(fetchSalaryTypes()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 更新 SalaryTypes index
export const updateSalaryTypesIndex = (params) => {
  return (dispatch,getState) => {
    
    //获取 salary数据
    const $salary=getState()[settingRouters.path].get(settingRouters.salaryTypes.path);
    const targetIndex=params.type==='up'?params.index-1:params.index+1; // 切换的目标index
    const targetSalary=$salary.find($s=>$s.get('index')==targetIndex)
    const targetId=targetSalary && targetSalary.get('id');
    const values=[params.id,targetId];

    return easyfetch({
      url:api.setting.salaryTypes.updateIndex,
      type:'put',
      data:{ids:values}
    })
      .then(e=>{
        dispatch({
          type:UPDATE_SETTING_SALARY_TYPES_INDEX,
          payload:values
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
  [FETCH_SETTING_ALL] : (state, action) => state.merge(action.payload),
  [FETCH_SETTING_COMPANYS] : (state, action) => state.set(settingRouters.company.path,action.payload),
  [FETCH_SETTING_CLIENTS] : (state, action) => state.set(settingRouters.clients.path,action.payload),
  [FETCH_SETTING_TEAMS] : (state, action) => state.set(settingRouters.teams.path,action.payload),
  [FETCH_SETTING_OFFICES] : (state, action) => state.set(settingRouters.offices.path,action.payload),
  [FETCH_SETTING_FORD_FUNCTIONS] : (state, action) => state.set(settingRouters.fordFunctions.path,action.payload),
  [FETCH_SETTING_SALARY_TYPES] : (state, action) => state.set(settingRouters.salaryTypes.path,action.payload),
  [FETCH_SETTING_CURRENCY] : (state, action) => state.set(settingRouters.currency.path,action.payload),
  [FETCH_SETTING_STD_POSS] : (state, action) => state.set(settingRouters.stdPoss.path,action.payload),
  [UPDATE_SETTING_FORD_FUNCTIONS_STATUS] : (state, action) => state.update(settingRouters.fordFunctions.path,$ford=>{
    return $ford.setIn([action.payload.id,'status'],action.payload.status);
  }),
  [UPDATE_SETTING_SALARY_TYPES_INDEX] : (state, action) => state.update(settingRouters.salaryTypes.path,$salary=>{
    const selfIndex=$salary.getIn([action.payload[0],'index'])
    const targetIndex=$salary.getIn([action.payload[1],'index'])
    return $salary.setIn([action.payload[0],'index'],targetIndex).setIn([action.payload[1],'index'],selfIndex)
  }),
}


// ------------------------------------
// Reducer
// ------------------------------------

const initialState = Immutable.Map();
export default function settingReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
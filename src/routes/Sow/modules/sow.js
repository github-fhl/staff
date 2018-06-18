import React from 'react'
import Immutable from 'immutable'
import {easyfetch} from '../../../utils/fetch'
import {arrayToImmutableMap} from '../../../utils/'
import api from '../../../common/api'
import {currencyFields} from '../../../common/config'
import {format,fixedNumber} from 'common/format'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_SOW_ALL = 'FETCH_SOW_ALL';
export const EDIT_PASS_THROUGH = 'EDIT_PASS_THROUGH';

// ------------------------------------
// Actions
// ------------------------------------


export const buildSowColumnsDataSource=({columns,rate,$dataSource,targetCurrency})=>{

  // 如果是local 类型直接输出原 columns 和 dataSource
  if (targetCurrency === currencyFields.local) {
    return {columns,dataSource:$dataSource}
  }

  //统计 number 和 money 字段, 和访问值的路径
  let valuesPath={}, //字段的值访问路径
      numberFields = [], //number字段：统计汇总
      moneyFields = ['traditional','digital','CRM']; //金额字段：汇率转换时，统计汇总
  columns.forEach(column=> {
    if (column.type === 'number') {
      numberFields.push(column.dataIndex)
    } else if (column.type === 'money') {
      moneyFields.push(column.dataIndex)
    }
    if(column.path){
      valuesPath[column.dataIndex]=column.path.concat(column.dataIndex)
    }else{
      valuesPath[column.dataIndex]=[column.dataIndex]
    }
  })

  //转换并汇总 money 字段 值
  let totalAmount = {}; //汇总统计
  $dataSource = $dataSource && $dataSource.map($item=> {
      const itemCurrency = $item.get('currencyId');
      const countTotalAmount=key=>{
        totalAmount[key]=totalAmount[key] || 0;
        const path=valuesPath[key] || [key];
        if(!isNaN($item.getIn(path))){
          totalAmount[key]=fixedNumber(totalAmount[key]+$item.getIn(path))
        }
      }

      // 汇总及转换货币
      numberFields.forEach(countTotalAmount);
      moneyFields.forEach(key=>{
        const path=valuesPath[key] || [key];
        if(itemCurrency!==targetCurrency){
          $item=$item.updateIn(path,amount=>amount/rate[itemCurrency])
        }
        countTotalAmount(key);
      });
      return $item;
    })

  //将汇总数据显示在 columns.title 中
  const otherColumnSubTitle={currencyId:targetCurrency}; // 其它特殊的二级菜单
  const otherColumnProps={currencyId:{render:value=>targetCurrency}} // 其它columns属性
  columns=columns.map(column=>{
    let value;

    //合并其它二级菜单
    if(otherColumnSubTitle[column.dataIndex]){
      value=otherColumnSubTitle[column.dataIndex];
    }
    //合并其它属性
    if(otherColumnProps[column.dataIndex]){
      column={...column,...otherColumnProps[column.dataIndex]};
    }

    if(totalAmount[column.dataIndex]!==undefined){
      value=totalAmount[column.dataIndex];

      //数据是否需要格式化
      if(format[column.type]){
        value=format[column.type](value)
      }
    }
    let title=(
      <div className="total-amount-title">
        <div className="old">{column.title}</div>
        <div className="new">{value}</div>
      </div>
    )
    return {...column,title}
  })
  return {columns,dataSource:$dataSource};
}


//获取有所sow数据
export const fetchAllSow=(params)=>{
  return dispatch => {
    return easyfetch({
      url:api.sow.fetch,
      data:params
    })
      .then(e=>{
        const data=e.obj;
        let $data=Immutable.Map();

        //格式化处理数据
        const {soldSows,specialSows,currencys,sowLevel}=e.obj;
        $data=$data.set('soldSows',arrayToImmutableMap()(data.soldSows.rows));
        $data=$data.set('specialSows',arrayToImmutableMap()(data.specialSows.rows));
        $data=$data.set('currencys',arrayToImmutableMap()(data.currencys));
        $data=$data.set('sowLevel',Immutable.fromJS(sowLevel));

        dispatch({
          type:FETCH_SOW_ALL,
          payload:$data
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 创建sow
export const createSow = (data) => {
  return dispatch => {
    return easyfetch({
      url:api.sow.create,
      type:'post',
      data
    })
      .then(e=>{
        dispatch(fetchAllSow()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}


// 复制 预览 Sow
export const copyViewSow = (data) => {
  return easyfetch({
    url:api.sow.copyView,
    type:'get',
    data
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}


// 复制单条 Sow
export const copyCommitSow = (data) => {
  return dispatch => {
    return easyfetch({
      url:api.sow.copy,
      type:'post',
      data
    })
      .then(e=>{
        dispatch(fetchAllSow()) //创建成功后重新fetch;
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 编辑 Pass Through Sow
export const editPassThrough = ({id,...data}) => {
  return dispatch => {
    return easyfetch({
      url:api.sow.editPass+id,
      type:'put',
      data
    })
      .then(e=>{
        dispatch({
          type:EDIT_PASS_THROUGH,
          payload:Immutable.fromJS(e.obj)
        })
        return e;
      })
      .catch(error =>dispatch({type:'FETCH_ERROR',error:error}))
  }
}

// 获取单条公司
export const fetchSingleSow = (id) => {
  return easyfetch({
    url:api.sow.fetchSingle+id,
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 审批流Approval flow
export const approvalFlow = url => {
  return easyfetch({url,type:'put'})
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 录入PO信息
export const entryPo = (data,id) => {
  return easyfetch({
    url:api.sow.collectPO+id,
    data,
    type:'put'
  })
    .then(e=>e.obj)
    .catch(error =>({error:error}))
}

// 获取 PO信息
export const fetchPo = (data) => {
  return easyfetch({
    url:api.sow.fetchPO,
    data,
  })
    .then(e=>e.objs)
    .catch(error =>({error:error}))
}

// 更新 PO信息
export const updatePo = (data) => {
  return easyfetch({
    url:api.sow.updatePO,
    type:'put',
    data,
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}


// position 获取position Name
export const getPositionName = (data) => {
  return easyfetch({
    url:api.sow.getPositionName,
    data,
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}

// position 获取position Budget
export const getPositionBudget = (data) => {
  return easyfetch({
    url:api.sow.getPositionBudget,
    data,
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}

// position 获取 sowLevel
export const getSowLevel = (data) => {
  return easyfetch({
    url:api.sow.getSowLevel,
    data,
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}


// position 获取 note
export const getSowNote = (data) => {
  return easyfetch({
    url:api.sow.getSowNote,
    data,
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}

// position 创建 position
export const createPosition = (data) => {
  return easyfetch({
    url:api.sow.createPosition,
    data,
    type:'post'
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}


// 获取全部 position
export const fetchAllPosition = (data) => {
  return easyfetch({
    url:api.sow.fetchAllPosition,data
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}

// 获取单条 position
export const fetchSinglePosition = (id) => {
  return easyfetch({
    url:api.sow.fetchSinglePosition+id,
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}

// position 获取 position Remark
export const updatePositionRemark = ({id,...data}) => {
  return easyfetch({
    url:api.sow.updatePositionRemark+id,
    type:'put',
    data
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}

// 获取 position 对某个 sow 的费用
export const fetchClientCost = (data) => {
  return easyfetch({
    url:api.sow.clientCost,data
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}

// 获取 position 对某个 sow 的费用
export const createSowPositions = (data) => {
  return easyfetch({
    type:'post',
    url:api.sow.createSowPositions,data
  })
    .then(e=>e)
    .catch(error =>({error:error}))
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [FETCH_SOW_ALL]    : (state, action) => state.merge(action.payload),
  [EDIT_PASS_THROUGH]    : (state, action) => state.setIn(['soldSows',action.payload.get('id')],action.payload),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Immutable.Map();
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

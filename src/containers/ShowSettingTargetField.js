import React from 'react'
import { connect } from 'react-redux'
import  PropTypes from 'prop-types'

//通过Setting,type,fromField,及 value 查找Item;
const mapStateToProps = (state,{type,fromField='id',value}) => {
  let newProps={
    [type]: state.setting.get(type)
  }
  if(fromField=='id'){
    newProps.$item= state.setting.getIn([type,value])
  }else if(newProps[type]){
    newProps.$item=newProps[type].find($item=>$item.get(fromField)===value)
  }
  return newProps
};
export const createFindSettingItem=Component=>connect(mapStateToProps)(Component);
const ShowTargetComponent=({$item,targetField='name'})=>( $item && $item.get(targetField) ? <span>{$item.get(targetField)}</span> : null);
const ShowSettingTargetField=createFindSettingItem(ShowTargetComponent)
ShowSettingTargetField.propTypes={
  type:          PropTypes.string.isRequired,
  value:         PropTypes.string,
  targetField:   PropTypes.string,
  fromField:     PropTypes.string,
}

export  default ShowSettingTargetField;



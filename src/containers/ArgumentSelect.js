import React from 'react'
import Immutable from'immutable'
import  PropTypes from 'prop-types'
import {Select} from 'antd'
import { connect } from 'react-redux'

const Option = Select.Option;
const defalutWidth={}

const ArgumentSelect=({type,filterAction,$arguments=Immutable.Map(),style,...props})=>{
  let mergerStyle={minWidth:defalutWidth[type] || 100,...style}
  let $list=$arguments.get(type);

  //数据是否需要赛选
  if(filterAction && $list){
    $list=filterAction($list)
  }
  
  return (
    <Select {...props} style={mergerStyle}>
      {$list && $list.valueSeq().map(value=>(
        <Option key={value}>
          {value}
        </Option>
      ))}
    </Select>
  )
}
ArgumentSelect.propTypes={
  type:     PropTypes.string.isRequired,
  style:    PropTypes.object
}

const mapStateToProps = (state) => ({
  $arguments:state.arguments.get('cfg')
})

export default connect(mapStateToProps)(ArgumentSelect)
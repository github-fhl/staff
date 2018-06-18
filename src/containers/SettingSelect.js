import React from 'react'
import  PropTypes from 'prop-types'
import  ImmutablePropTypes from 'react-immutable-proptypes'
import {Select} from 'antd'
import { connect } from 'react-redux'
import {routerMap} from 'routes/routers.config'

const Option = Select.Option;
const defalutWidth={
  currency:80
}
// title 字段
const titleField={
  [routerMap.setting.company.path]:'name',
  [routerMap.setting.stdPoss.path]:'name',
  [routerMap.setting.teams.path]:'name',
}

const SettingSelect=({type,setting,style,showAll,filterAction,valueField='id',titleRender,...props})=>{
  let mergerStyle={minWidth:defalutWidth[type],...style}
  let options=showAll===true?[<Option key="all">All</Option>]:[];
  let titleKey=titleField[type]||'id';
  let $listMap=setting.get(type);

  //数据是否需要赛选
  if(filterAction && $listMap){
    $listMap=filterAction($listMap)
  }

  //将数据转为 option list
  if($listMap){
    options.push($listMap.valueSeq().map($item=>(
      <Option key={$item.get(valueField)}>
        { titleRender?  //是否用title 函数生成title
          titleRender($item):
          $item.get(titleKey)
        }
      </Option>
    )))
  }

  //列表数量大于7 则默认添加搜索功能
  let otherProps={dropdownMatchSelectWidth:false};
  if($listMap && $listMap.size>7){
    otherProps.showSearch=true;
    otherProps.optionFilterProp='children';
  }
  return (
    <Select {...otherProps} {...props} style={mergerStyle}>
      {options}
    </Select>
  )
}
SettingSelect.propTypes={
  type:     PropTypes.string.isRequired,
  style:    PropTypes.object,
  showAll:  PropTypes.bool,
  setting:  ImmutablePropTypes.map.isRequired,
  filterAction:     PropTypes.func,
  titleRender:     PropTypes.func
}

const mapStateToProps = (state) => ({
  setting:state.setting
})
export default connect(mapStateToProps)(SettingSelect)
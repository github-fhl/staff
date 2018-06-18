import React from 'react'
import {Input,InputNumber} from 'antd'
import {numberWithCommas,fixedNumber} from 'common/format'

export const DefalutInput=props=><Input {...props} onChange={e=>props.onChange(e.target.value)} />
export const YearInput=props=><InputNumber {...props} min={1900} max={2100} />

//格式化百分比显示，增加参数 fixed:2 显示到几位小数
export const PercentInput=props=>(
  <InputNumber
    {...props}
    min={0.01}
    max={1.00}
    step={0.01}
  />
)

//货币input
export const MoneyInput=props=>(
  <Input
    {...props}
    defaultValue={isNaN(props.defaultValue)?'':props.defaultValue/100}
    onChange={e=>props.onChange(isNaN(e.target.value)?'':e.target.value*100)}
  />
)

//数字 input
export const NumberInput=props=>(
  <InputNumber
    {...props}
    min={0}
    max={100}
    step={0.1}
  />
)

//数字 input
export class MoneyInputInForm extends React.PureComponent{
  onChange=value=>{
    value= isNaN(value)?value:fixedNumber(value * 100);
    if(value!==this.props.value){
      this.props.onChange(value)
    }
  }
  render(){
    let {value}=this.props;
    if(!isNaN(value)){
      value=fixedNumber(Math.floor(value)/100)
    }
    return (
      <InputNumber
        className="input-underline"
        formatter={value =>numberWithCommas(value)}
        parser={value =>value.replace(/\$\s?|(,*)/g, '')}
        {...this.props}
        onChange={this.onChange}
        value={value}
      />
    )
  }
}
import React from 'react'
import {Input,Icon} from 'antd'
import ArgumentSelect from 'containers/ArgumentSelect'
import {argumentFields} from 'common/config'

const createArgumentSelect=type=>{
  return class extends React.PureComponent{
    render(){
      return <ArgumentSelect {...this.props} type={type} className="select-underline" />
    }
  }
}

// 搜索的column
export const searchColumns=[
  {
    dataIndex:'keyWord',
    title:'Key word',
    match:'include',
    target:['id'],
    component: <Input size="default" />
  }
]

// SalaryType表格的column
export const salaryTypeTableColumns=[
  {dataIndex:'index'},
  {dataIndex:'id',title:'SalaryType',width:160},
  {dataIndex:'category'},
  {dataIndex:'location'},
  {dataIndex:'distributeType',width:130},
]

// SalaryType表单的column
export const salaryTypeFormColumns=[
  {dataIndex:'id',required:true},
  {dataIndex:'category',Component:createArgumentSelect(argumentFields.categorySalary)},
  {dataIndex:'distributeType',Component:createArgumentSelect(argumentFields.distributeType)},
  {dataIndex:'location',Component:createArgumentSelect(argumentFields.location)},
]

import React from 'react'
import {Button,Popconfirm} from 'antd'

export const FlowBtn=({title,onConfirm,type,disabled})=>(
  <span className="item">
    <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={onConfirm}>
       <Button size="small" type={type} disabled={disabled}>{title}</Button>
    </Popconfirm>
  </span>
)
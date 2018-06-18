import React from 'react'
import {Form,Input,Row,Col} from 'antd'
import './SimpleForm.scss'

const FormItem = Form.Item;
/*
* 简易的antd Form
* props
* labelCol:4          //label 宽度
* wrapperCol:14       //容器宽度
* columns:[]          //渲染表单的数组
*
* columns.dataIndex   //form字段名称
* columns.title       //该字段的标签
* columns.FormTag     //该字段的组件 默认 Input
* columns.option      //表单选项参考antd form
* columns.width      //表单项宽度
* */

class SimpleForm extends React.PureComponent{
  static defaultProps={
    columns:[],
    labelCol:{span:8},
    wrapperCol:{span:16}
  }
  render(){
    const {columns,form:{getFieldDecorator},labelCol,wrapperCol,layout}=this.props;
    return(
      <Form layout={layout} className="simple-form">
        {
          columns.map($column=>{
            const FormTag=$column.get('Component');


            // 表单验证属性
            let option={};
            if($column.get('option')){
              option=$column.get('option')
            }
            //是否必选
            if($column.get('required')===true){
              let requiredRule={
                type:'string',
                message:`Missing ${$column.get('title')}`,
                required:true
              }
              if($column.get('type')=='number'){
                requiredRule.type='number'
                requiredRule.transform=e=>parseFloat(e);
              }
              if(option.rules){
                option.rules=option.rules.concat(requiredRule)
              }else{
                option.rules=[requiredRule]
              }
            }

            // 表单样式
            let style={}
            if($column.get('width')){
              style.width=$column.get('width');
            }
            if($column.get('color')){
              style.color=$column.get('color');
            }
            return (
                <FormItem
                  style={style}
                  key={$column.get('dataIndex')}
                  label={$column.get('title')}
                  labelCol={$column.get('labelCol') || labelCol}
                  wrapperCol={$column.get('wrapperCol') || wrapperCol}
                >
                  {getFieldDecorator($column.get('dataIndex'),option)(
                    FormTag?<FormTag key={$column.get('dataIndex')} disabled={$column.get('disabled')} />:<Input className="input-underline" disabled={$column.get('disabled')} />
                  )}
                </FormItem>
            )
          })
        }
      </Form>
    )
  }
}
export default Form.create({onValuesChange:(props,values)=>props.onValuesChange && props.onValuesChange(values)})(SimpleForm)
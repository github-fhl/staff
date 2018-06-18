import React from 'react'
import {Form ,Button} from 'antd'
import PropTypes from 'prop-types'
import './search.scss'

/**
 *  表格的搜索的中间件 接受表格中data source 属性，并通过表单进行筛选。
 * @searchColumns
 * @param {string} dataIndex - 搜索的字段的名称.
 * @param {array} target - 筛选数据的目标字段，如果没有则默认为 dataIndex.
 * @param {string} match - 数据筛选的方式，'include'|'equal'|'timeline'.
 * @param {node} component - react 表单组件
 *
 */

const FormItem = Form.Item;

export function searchInclude(Component) {
  class Search extends React.PureComponent{
    state={
      searchValue:null,
    }
    handleSubmit=e=>{
      e.preventDefault();
      this.props.form.validateFields((err,values)=>{
        if(!err){
          this.setState({
            searchValue:values
          })
        }
      })
    }
    render(){
      const {form:{getFieldDecorator},searchColumns,...props}=this.props;
      const {searchValue}=this.state;
      let dataSource=this.props.dataSource;
      if(searchValue){

        //组织搜索条件
        let condition={}
        for(let key in searchValue){
          let keyCondition={
            value:searchValue[key]
          }
          searchColumns.some(column=>{
            if(column.dataIndex===key){
              keyCondition.target=column.target;
              keyCondition.match=column.match;
              return true;
            }
          })
          condition[key]=keyCondition
        }

        //根据条件筛选数据
        dataSource=dataSource.filter(data=>{
          return Object.keys(condition).every(key=>{

            // 搜索的目标字段
            const target=condition[key].target || [key];

            // 搜索的匹配方式
            if(condition[key].match==='include'){
              if(condition[key].value){
                const reg=new RegExp(condition[key].value,'gi');
                return target.some(field=>reg.test(data.get(field)));
              }else{
                return true;
              }
            }else if(condition[key].match==='equal'){
              if(condition[key].value==='all'){
                return true;
              }else{
                return target.some(field=>data.get(field)===condition[key].value)
              }
            }

          })
        });
      }
      return (
        <div className="flex-box">
          <div className="flex-header">
            <Form layout="inline" onSubmit={this.handleSubmit}>
              {
                searchColumns.map(column=>{

                  return (
                    <FormItem label={column.title} key={column.dataIndex}>
                      {getFieldDecorator(column.dataIndex,{initialValue:column.initialValue})(column.component)}
                    </FormItem>
                  )
                })
              }
              <FormItem>
                <Button size="small" htmlType="submit">Search</Button>
              </FormItem>
              <FormItem>
                Total of <span className="highlight">{dataSource.size}</span>
              </FormItem>
            </Form>
          </div>
          <div className="flex-content">
              <Component {...props} dataSource={dataSource} />
          </div>
        </div>
        )
    }
  }

  Search.propTypes = {
    form: PropTypes.object
  }

  return Form.create()(Search);
}
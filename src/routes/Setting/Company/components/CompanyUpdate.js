import React from 'react'
import update from 'react/lib/update'
import PropTypes from 'prop-types'
import {message,Button} from 'antd'
import TableForm from 'components/antd/TableForm'
import CompanyCreate from './CompanyCreate'
import Columns from 'common/columns'
import {detailFormColumns} from '../modules/company'
import {fetchSingleCompanys,createCompanyDetail,updateCompanyDetail,fetchCompanys} from 'routes/Setting/modules/setting'
import { browserHistory } from 'react-router'
import moment from 'moment'
import {routerMap} from 'routes/routers.config'
import {companyFormColumns} from '../modules/company'

const setting=routerMap.setting;

// 更新表单的 column
const updateFormColumns=new Columns(companyFormColumns);
updateFormColumns.updateForm({id:{disabled:true}}); //id 禁用

//新建一条detail的默认值
const detailInitial={
  year:moment().format('YYYY')
}
const extra=(
  <Button type="primary" size="large" onClick={()=>browserHistory.push(`/${setting.path}/${setting.company.path}/${setting.company.create.path}`)}>Create</Button>
)


//detail 表单的column
const companyDetailColumns=new Columns(detailFormColumns);

class CompanyUpdate extends React.PureComponent{
  static propTypes = {
    onSave: PropTypes.func.isRequired
  }
  state={}
  componentDidMount(){
    fetchSingleCompanys(this.props.params.id).then(e=>{
      if(e.error){
        message.error(e.error.message)
      }else{
        this.setState({details:e.companyDetails})
      }
    })
  }
  onSave=(params,editIndex)=>{
    params.companyId=this.props.params.id;

    // 新建或更新成功后操作
    const fetchThen=obj=>{
      if(!obj.error){
        this.props.dispatch(fetchCompanys()) // 保存成功 更新列表页数据
        this.setState(prevState=>({
          details:update(prevState.details,{$splice:[[editIndex,1,obj]]})
        }))
      }
      return obj
    };

    // 根据id判断是更新 或 新建
    if(params.id){
      return updateCompanyDetail(params).then(fetchThen)
    }else{
      return createCompanyDetail(params).then(fetchThen)
    }
  }
  render(){
    console.log('company Update props=',this.props)
    return (
      <CompanyCreate {...this.props} extra={extra} columns={updateFormColumns.form}>
        <TableForm initial={detailInitial} columns={companyDetailColumns.table} onSave={this.onSave} dataSource={this.state.details}  />
      </CompanyCreate>
    )
  }
}

export default CompanyUpdate
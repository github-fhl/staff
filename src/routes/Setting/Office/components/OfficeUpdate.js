import React from 'react'
import update from 'react/lib/update'
import PropTypes from 'prop-types'
import {message,Button} from 'antd'
import TableForm from 'components/antd/TableForm'
import OfficeCreate from './OfficeCreate'
import Columns from 'common/columns'
import {detailFormColumns} from '../modules/office'
import {fetchSingleOffices,createOfficeDetail,updateOfficeDetail,fetchOffices} from 'routes/Setting/modules/setting'
import { browserHistory } from 'react-router'
import moment from 'moment'
import {routerMap} from 'routes/routers.config'
import {officeFormColumns} from '../modules/office'

// 更新表单的 column
const updateFormColumns=new Columns(officeFormColumns);
updateFormColumns.updateForm({id:{disabled:true}}); //id 禁用

const setting=routerMap.setting;

//新建一条detail的默认值
const detailInitial={
  year:moment().format('YYYY')
}
const extra=(
  <Button type="primary" size="large" onClick={()=>browserHistory.push(`/${setting.path}/${setting.offices.path}/${setting.offices.create.path}`)}>Create</Button>
)


//detail 表单的column
const officeDetailColumns=new Columns(detailFormColumns);

class OfficeUpdate extends React.PureComponent{
  static propTypes = {
    onSave: PropTypes.func.isRequired
  }
  state={}
  componentDidMount(){
    fetchSingleOffices(this.props.params.id).then(e=>{
      if(e.error){
        message.error(e.error.message)
      }else{
        this.setState({details:e.officeDetails})
      }
    })
  }
  onSave=(params,editIndex)=>{
    params.officeId=this.props.params.id;

    // 新建或更新成功后操作
    const fetchThen=obj=>{
      if(!obj.error){
        this.props.dispatch(fetchOffices()) // 保存成功 更新列表页数据
        this.setState(prevState=>({
          details:update(prevState.details,{$splice:[[editIndex,1,obj]]})
        }))
      }
      return obj
    };

    // 根据id判断是更新 或 新建
    if(params.id){
      return updateOfficeDetail(params).then(fetchThen)
    }else{
      return createOfficeDetail(params).then(fetchThen)
    }
  }
  render(){
    return (
      <OfficeCreate {...this.props} extra={extra} columns={updateFormColumns.form}>
        <TableForm initial={detailInitial} columns={officeDetailColumns.table} onSave={this.onSave} dataSource={this.state.details}  />
      </OfficeCreate>
    )
  }
}

export default OfficeUpdate
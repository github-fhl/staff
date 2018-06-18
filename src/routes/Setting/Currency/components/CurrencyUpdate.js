import React from 'react'
import update from 'react/lib/update'
import PropTypes from 'prop-types'
import {message,Button} from 'antd'
import TableForm from 'components/antd/TableForm'
import CurrencyCreate from './CurrencyCreate'
import Columns from 'common/columns'
import {detailFormColumns} from '../modules/currency'
import {fetchSingleCurrencys,createCurrencyDetail,updateCurrencyDetail,fetchCurrencys} from 'routes/Setting/modules/setting'
import { browserHistory } from 'react-router'
import moment from 'moment'
import {routerMap} from 'routes/routers.config'

const setting=routerMap.setting;

//新建一条detail的默认值
const detailInitial={
  year:moment().format('YYYY')
}
const extra=(
  <Button type="primary" size="large" onClick={()=>browserHistory.push(`/${setting.path}/${setting.currency.path}/${setting.currency.create.path}`)}>Create</Button>
)


//detail 表单的column
const currencyDetailColumns=new Columns(detailFormColumns);

class CurrencyUpdate extends React.PureComponent{
  static propTypes = {
    onSave: PropTypes.func
  }
  state={}
  componentDidMount(){
    fetchSingleCurrencys(this.props.params.id).then(e=>{
      if(e.error){
        message.error(e.error.message)
      }else{
        this.setState({details:e.currencyDetails})
      }
    })
  }
  onSave=(params,editIndex)=>{
    params.currencyId=this.props.params.id;

    // 新建或更新成功后操作
    const fetchThen=obj=>{
      if(!obj.error){
        this.props.dispatch(fetchCurrencys()) // 保存成功 更新列表页数据
        this.setState(prevState=>({
          details:update(prevState.details,{$splice:[[editIndex,1,obj]]})
        }))
      }
      return obj
    };

    // 根据id判断是更新 或 新建
    if(params.id){
      return updateCurrencyDetail(params).then(fetchThen)
    }else{
      return createCurrencyDetail(params).then(fetchThen)
    }
  }
  render(){
    console.log('currency Update props=',this.props)
    return (
      <CurrencyCreate {...this.props} extra={extra}>
        <TableForm initial={detailInitial} columns={currencyDetailColumns.table} onSave={this.onSave} dataSource={this.state.details}  />
      </CurrencyCreate>
    )
  }
}

export default CurrencyUpdate
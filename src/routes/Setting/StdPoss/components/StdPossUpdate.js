import React from 'react'
import update from 'react/lib/update'
import PropTypes from 'prop-types'
import {message,Button,Switch,Icon} from 'antd'
import TableForm from 'components/antd/TableForm'
import StdPosCreate from './StdPossCreate'
import Columns from 'common/columns'
import {detailFormColumns} from '../modules/stdPoss'
import {fetchSingleStdPoss,createStdPosDetail,updateStdPosDetail,fetchStdPoss} from 'routes/Setting/modules/setting'
import { browserHistory } from 'react-router'
import moment from 'moment'
import {routerMap} from 'routes/routers.config'
import {MoneyInput} from 'components/column'
import {salaryTypeObject2Array,salaryTypeArray2Object} from 'common/format'

const setting=routerMap.setting;

//新建一条detail的默认值
const detailInitial={
  year:moment().format('YYYY')
}
const extra=(
  <Button type="primary" size="large" onClick={()=>browserHistory.push(`/${setting.path}/${setting.stdPoss.path}/${setting.stdPoss.create.path}`)}>Create</Button>
)


//detail 表单的column
const stdPosDetailColumns=new Columns(detailFormColumns);

class StdPosUpdate extends React.PureComponent{
  static propTypes = {
    onSave: PropTypes.func
  }
  state={
    details:null,
    showAllSalary:false
  }
  componentWillReceiveProps(nextProps){

    //获取id fetch detail
    if(
      (!this.props.$initialValue && nextProps.$initialValue) ||
      nextProps.$initialValue.get('id')!==this.props.$initialValue.get('id')
    ){
        this.fetchDetail(nextProps.$initialValue.get('id'));
    }

    //获取salary columns
    if(nextProps.$salary!==this.props.$salary){
      this.salaryColumns=this.getDetailColumns(nextProps.$salary)
    }
  }
  componentWillMount(){

    //获取salary columns
    this.salaryColumns=this.getDetailColumns(this.props.$salary)
  }
  componentDidMount(){

    //获取id fetch detail
    this.fetchDetail(this.props.$initialValue && this.props.$initialValue.get('id'))
  }

  //根据salary 生成 columns
  getDetailColumns=$salary=>{
    if($salary){
      return new Columns($salary.sortBy($d => $d.get('index')).toArray().map($s=>{
        const title=$s.get('id');
        let column={title,dataIndex:title,type:'money',Component:MoneyInput};

        //如果title 更具字符长度 自动延伸，以免文字title 换行的问题
        if(title && title.length>7){
          column.width=title.length * 8+25
        }
        return column;
      })).table;
    }else {
      return []
    }
  }
  fetchDetail=(id)=>{
    if(!id){return}

    fetchSingleStdPoss(id).then(e=>{
      if(e.error){
        message.error(e.error.message)
      }else{
        let details=e.stdPosDetails.map(({stdPosPrices,...otherFields})=>({
          ...salaryTypeArray2Object(stdPosPrices),
          ...otherFields
        }));

        this.setState({details})
      }
    })
  }
  onSave=(params,editIndex)=>{
    let {id,stdPosId,skillLevel,year,...stdPosPrices}=params;

    // 汇总salary amount
    if(stdPosPrices){
      stdPosPrices=salaryTypeObject2Array(stdPosPrices)
    }

    let values={
      skillLevel,year,
      stdPosId:this.props.$initialValue.get('id'),
      stdPosPrices
    }

    // 新建或更新成功后操作
    const fetchThen=obj=>{
      if(!obj.error){
        this.props.dispatch(fetchStdPoss()) // 保存成功 更新列表页数据

        //将后端的数据格式化成对象
        const {stdPosPrices,...otherFields}=obj
        const formatObj={...otherFields,...salaryTypeArray2Object(stdPosPrices)}
        this.setState(prevState=>({
          details:update(prevState.details,{$splice:[[editIndex,1,formatObj]]})
        }))
      }
      return obj
    };

    // 根据id判断是更新 或 新建
    if(id){
      return updateStdPosDetail({id,...values}).then(fetchThen)
    }else{
      return createStdPosDetail(values).then(fetchThen)
    }
  }
  onChangeSwitch=checked=>this.setState({showAllSalary:checked})
  render(){
    const {details,showAllSalary}=this.state;
    let columns=stdPosDetailColumns.table;
    if(this.salaryColumns){
      let salaryColumns=this.salaryColumns;

      //筛选含有有效值的columns
      if(Array.isArray(details) && !showAllSalary){
        let hasValueColumns=Object.keys(details.reduce((value,item)=>({...value,...item}),{}));
        salaryColumns=salaryColumns.filter(column=>hasValueColumns.indexOf(column.dataIndex)>-1)
      }
      columns=columns.concat(salaryColumns)
    }
    return (
      <StdPosCreate {...this.props} extra={extra}>
        <TableForm initial={detailInitial} columns={columns} onSave={this.onSave} dataSource={details}  />
        <span style={{marginLeft:20}}>
          <Switch onChange={this.onChangeSwitch} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} /> All Salary
        </span>
      </StdPosCreate>
    )
  }
}

export default StdPosUpdate
import React from 'react'
import PropTypes from 'prop-types'
import {SmallTable} from 'components/antd/Table'
import {getPositionBudget} from '../modules/sow'
import {debounce} from 'utils'
import Columns from 'common/columns'
import {MoneyInput} from 'components/column'

const budgetColumns=new Columns([
  {dataIndex:'annualSalary'},
  {dataIndex:'annualCola'},
  {dataIndex:'bonus'},
  {dataIndex:'directComp',showTitleTip:true},
  {dataIndex:'benefits'},
  {dataIndex:'directLabor',showTitleTip:true},
  {dataIndex:'net'},
  {dataIndex:'tax'},
  {dataIndex:'gross'},
  {dataIndex:'budgetIncentive',showTitleTip:true},
])
const keyWord=['annualSalary','annualCola','bonus'];

class CreatePositionBudget extends React.PureComponent {
  static propTypes = {
    value: PropTypes.object
  }
  componentWillMount(){
    this.updateColumns();
    this.localUpdate=false;//用来标记，新的value值，是否是this.onValueChange 产生(以确认是否更新input)
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value!==this.props.value && !this.localUpdate){
      this.updateColumns(+new Date());
    }
    this.localUpdate=false;
  }
  updateColumns=(values)=>{
    const formRender=keyWord.reduce((old,key)=>{
      if(!this.props.disabled){
        old[key]={render:text=><MoneyInput key={`${key}${values}`} onChange={this.onValueChange(key)} defaultValue={text} />}
      }
      return old
    },{});
    budgetColumns.updateTable(formRender)
  }
  onValueChange=key=>debounce(formValue=>{
    const {value,params}=this.props;

    //获取表格的旧值
    const oldValues=keyWord.reduce((old,key)=>{ old[key]=value[key];return old}, {});

    // 格式化成后台参数格式
    const newValues={adjustedBasicCost:JSON.stringify({...oldValues,[key]:formValue}),...params};

    // 获取新的budget信息
    getPositionBudget(newValues).then(e=>{
      if(!e.error){
        this.localUpdate=true;
        this.props.onChange(e.obj)
      }
    })
  },400)

  render() {
    const scroll={x:budgetColumns.table.reduce((v,column)=>isNaN(column.width)?v:v+column.width,0),...this.props.scroll};
    const {value}=this.props;
    return (<SmallTable dataSource={value && [value]} scroll={scroll} columns={budgetColumns.table} size="small" />);
  }
}

export default CreatePositionBudget
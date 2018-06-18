import React from 'react'
import {Button,Modal,message} from 'antd'
import update from 'react/lib/update'
import PropTypes from 'prop-types'
import Columns from 'common/columns'
import {ImmutableTable} from '../../../components/antd/Table'
import TableForm from '../../../components/antd/TableForm'
import {passThroughFormColumns,viewPoFilesTableColumns} from '../modules/SowColumns'
import {fetchPo,updatePo} from '../modules/sow'
import ImmutablePropsTypes from 'react-immutable-proptypes'
import {arrayReduceToObj} from 'utils'
import {format} from 'common/format'

const viewPoColumns = new Columns(passThroughFormColumns.map(item=>({dataIndex:item.dataIndex})));
const formColumns = new Columns(viewPoFilesTableColumns);
const formMoneys=arrayReduceToObj('dataIndex')(formColumns.table.filter(column=>column.type==='money'))
console.log('formMoneyFields=',formMoneys)

class SowDetailViewPO extends React.PureComponent{
  state={
    visible:false,
    dataSource:[]
  }
  static propTypes = {
    $sow:  ImmutablePropsTypes.map,
    adjustMoney: PropTypes.object.isRequired
  }
  fetchData=()=>fetchPo({sowId:this.props.id}).then(e=>{
    if(e.error){
      message.error(e.error.message)
    }else{
      this.setState({dataSource:e})
    }
  })
  onEdit=()=>{
    this.fetchData();
    this.setState({visible:true})
  };
  onCancel=()=>this.setState({visible:false});
  onSave=(params,index)=>{
    const adjustMoney=this.props.adjustMoney[params.currencyId];
    const oldParams=this.state.dataSource[index];

    //检查改变的值是否 超过 adjustMoney 的合法范围
    const errorList=Object.keys(formMoneys).reduce((value,key)=>{
      if(
        oldParams[key]!== params[key] &&
        Math.abs(oldParams[key]-params[key])>adjustMoney
      ){
        value.push({
          title:formMoneys[key].title,
          min:oldParams[key]-adjustMoney<0?0:oldParams[key]-adjustMoney,
          max:oldParams[key]+adjustMoney
        })
      }
      return value;
    },[]);
    if(errorList.length>0){
      const msg=(
        <table className="popover-table">
          <tbody>
          {errorList.map((item,i)=>{
            return (
              <tr key={`errorList${i}`} style={{textAlign:'right'}}>
                <td>{item.title} must be :</td>
                <td>
                  {format.money(item.min)}-{format.money(item.max)}
                </td>
              </tr>)
          })}
          </tbody>
        </table>
      );
      return new Promise(e=>e({error:{message:msg}}));
    }
    return updatePo({clientPos:[params]}).then(e=>{
      if(e.error){
        message.error(e.error.message)
      }else{
        this.setState(prevState=>({
          dataSource:update(prevState.dataSource,{$splice:[[index,1,params]]})
        }))
      }
      return e;
    })
  }
  render(){
    const {visible,dataSource}=this.state;
    const {$sow}=this.props;
    return (
      <a onClick={this.onEdit}>
        查看PO
        <Modal
          visible={visible}
          maskClosable={false}
          footer={<Button onClick={this.onCancel}>Close</Button>}
          onCancel={this.onCancel}
          title={`查看PO  (Currency:${$sow.get('currencyId')})`}
          width={1050}
        >
          <ImmutableTable columns={viewPoColumns.table} dataSource={[$sow]} />
          <h4 style={{marginTop:35,paddingTop:35,paddingBottom:10,borderTop:'#ccc dashed 1px'}}>PO Files</h4>
          <TableForm initial={null} columns={formColumns.table} dataSource={dataSource} onSave={this.onSave} />
        </Modal>
      </a>
    )
  }
}
export default SowDetailViewPO
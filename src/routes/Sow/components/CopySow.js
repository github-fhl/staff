import React from 'react'
import {Button,Modal,message} from 'antd'
import PropTypes from 'prop-types'
import Columns from 'common/columns'
import {ImmutableTable} from '../../../components/antd/Table'
import {copyTableColumns} from '../modules/SowColumns'
import {copyViewSow} from '../modules/sow'
import ImmutablePropsTypes from 'react-immutable-proptypes'
import immutable from 'immutable'
import './CopySow.scss'

const copyColumns = new Columns(copyTableColumns);
let newSow={};

class Create extends React.PureComponent{
  static propTypes = {
    target:          ImmutablePropsTypes.map,
    copyCommitSow:   PropTypes.func,
  }
  state={
    visible:false,
    dataSource:[]
  }
  getNewSow=props=>{
    if(props.target){
      const id=props.target.get('id');
      const year=props.target.get('year')

      // 选择的sow 是否已fetch 过
      if(newSow[id]){
        this.setState({dataSource:[props.target,newSow[id]]})
      }else{

        // fetch 新的sow 数据
        copyViewSow({targetSowId:id,year}).then(e=>{
          if(e.error){
            message.error(e.error.message)
          }else{
            newSow[id]=immutable.Map(e)
            this.setState({dataSource:[props.target,newSow[id]]})
          }
        })
      }
    }
  }
  onCopyClick=()=>{
    this.getNewSow(this.props);
    this.setState({visible:true})
  }
  onCancel=()=>this.setState({visible:false});
  onOk=()=>{
    this.props.copyCommitSow({targetSowId:this.props.target.get('id')}).then(e=>{
      if(!e.error){
        this.setState({visible:false})
      }
    })
  }
  render(){
    const {visible,dataSource}=this.state;
    return (
      <Button onClick={this.onCopyClick} disabled={!this.props.target}>
        Copy
        <Modal visible={visible} onOk={this.onOk} onCancel={this.onCancel} title="Copy SoW" width={800}>
          <ImmutableTable rowClassName={(r,index)=>`copySow${index}`} columns={copyColumns.table} dataSource={dataSource} className="table-data" />
        </Modal>
      </Button>
    )
  }
}
export default Create
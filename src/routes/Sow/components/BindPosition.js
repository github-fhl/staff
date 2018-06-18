import React from 'react'
import {Button,Modal} from 'antd'
import PropTypes from 'prop-types'
import Columns from 'common/columns'
import {SmallTable} from '../../../components/antd/Table'
import {bindPositionTableColumns} from '../modules/SowColumns'
import {fetchAllPosition} from '../modules/sow'
import ImmutablePropsTypes from 'react-immutable-proptypes'

const bindColumns = new Columns(bindPositionTableColumns);

class Create extends React.PureComponent{
  state={
    visible:false,
    position:[]
  }
  static propTypes = {
    positionList:  ImmutablePropsTypes.list.isRequired,
    year:         PropTypes.number,
  }
  fetchPosition=()=>{
    fetchAllPosition({year:this.props.year}).then(e=>{
      if(!e.error){
        this.setState({position:e.objs.filter(item=>{
          return !this.props.positionList.includes(item.id);
        })})
      }
    })
  }

  onEdit=()=>{
    this.fetchPosition();
    this.setState({visible:true})
  };
  onCancel=()=>this.setState({visible:false});
  render(){
    const {visible,position}=this.state;
    console.log('positionList',this.props.positionList.toJS())
    return (
      <Button size='large' onClick={this.onEdit}>
        绑定
        <Modal
          visible={visible} maskClosable={false} onCancel={this.onCancel} title="绑定已有Position" width={900}
          footer={<Button onClick={this.onCancel}>Close</Button>}
        >
          <SmallTable columns={bindColumns.table} dataSource={position} />
        </Modal>
      </Button>
    )
  }
}
export default Create

import React from 'react'
import {Modal} from 'antd'
import PropTypes from 'prop-types'
import Columns from 'common/columns'
import {fixedNumber} from 'common/format'
import {SmallTable} from '../../../components/antd/Table'
import SimpleForm from '../../../components/antd/SimpleForm'
import {passThroughFormColumns,viewPoFilesTableColumns} from '../modules/SowColumns'
import ImmutablePropsTypes from 'react-immutable-proptypes'
import {fetchPo} from '../modules/sow'
import './CopySow.scss'

const passThroughColumns = new Columns(passThroughFormColumns);
const poColumns = new Columns(viewPoFilesTableColumns);

class Create extends React.PureComponent{
  state={
    visible:false
  }
  static propTypes = {
    $initialValue:  ImmutablePropsTypes.map,
    onSave:         PropTypes.func,
  }
  componentWillReceiveProps(nextProps){
    if(this.props.$initialValue!==nextProps.$initialValue){
      this.setInitialValue(nextProps)
    }
  }
  componentDidMount(){
    if(this.props.$initialValue){
      this.setInitialValue(this.props)
    }
  }
  setInitialValue=props=>{
    if(props.$initialValue && this.form){
      let formFields=passThroughColumns.form.map(e=>e.get('dataIndex'));
      let initialValue=props.$initialValue.filter((value,key)=>formFields.indexOf(key)>-1).toJS()
      this.form.setFieldsValue(initialValue)
    }
  }
  onSave=()=>{
    this.form.validateFields((err, values) => {
      if (!err) {
        console.log('value==',values)
        const id=this.props.$initialValue.get('id');
        this.props.onSave({...values,id}).then(e=>{
          if(!e.error){
            this.setState({visible:false})
          }
        });
      }
    });
  }
  onEdit=()=>{
    this.fetchData();
    this.setState({visible:true},()=>
      this.setInitialValue(this.props));
  };
  onCancel=()=>this.setState({visible:false});
  onValuesChange=values=>{
    if(!this.form){return}  //找不到表单则返回；

    const changeField=Object.keys(values)[0];
    const productionFields=['CRM','traditional','digital'];
    const totalFields=['media','travel'];
    if(productionFields.concat(totalFields).indexOf(changeField)<0)return; //如果修改的非计算字段则返回；

    //改变后的表单
    const params={...this.form.getFieldsValue(),...values};

    // 计算 production
    let production=productionFields.reduce((value,key)=>{
      if(isNaN(params[key])){
        return value;
      }else{
        return value + parseFloat(params[key]);
      }
    },0);

    // 计算 total
    let total=totalFields.reduce((value,key)=>{
      if(isNaN(params[key])){
        return value;
      }else{
        return value +parseFloat(params[key]);
      }
    },production);

    production=fixedNumber(production)
    total=fixedNumber(total)

    // 重新设置表单的值
    this.form.setFieldsValue({production,total})
  }
  fetchData=()=>fetchPo({sowId:this.props.$initialValue.get('id')}).then(e=>{
    if(!e.error){
      this.setState({dataSource:e})
    }
  })
  render(){
    const {visible,dataSource}=this.state;
    return (
      <a onClick={this.onEdit}>
        PT Edit
        <Modal
          visible={visible} maskClosable={false} onOk={this.onSave} onCancel={this.onCancel}
          title={<span>PT Edit  <span style={{marginLeft:40,color:'#06a'}}>Currency:{this.props.$initialValue.get('currencyId')}</span></span>} width={1096}
        >
            <SimpleForm
              onValuesChange={this.onValuesChange}
              columns={passThroughColumns.form}
              wrappedComponentRef={e=>this.form=e.props.form}
              layout="inline"
            />
          {
            dataSource && dataSource.length>0 &&
              <div>
                <h4 style={{marginTop:35,paddingTop:35,paddingBottom:10,borderTop:'#ccc dashed 1px'}}>PO Files</h4>
                <SmallTable initial={null} columns={poColumns.table} dataSource={dataSource} onSave={this.onSave} />
              </div>
          }
        </Modal>
      </a>
    )
  }
}
export default Create
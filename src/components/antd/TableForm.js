import React from 'react'
import update from 'react/lib/update'
import PropTypes from 'prop-types'
import {Popconfirm,message,Button} from 'antd'
import {SmallTable} from './Table'
import {format} from 'common/format'
import './TableForm.scss'


class TableForm extends React.PureComponent {
  static  defalutProps = {
    initial:{}
  }
  static propTypes = {
    onSave: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state={
      editIndex:-1,
      dataSource:props.dataSource,
      editConfirmVisible:false,
      addConfirmVisible:false
    }

    // 记录当前编辑行的值
    this.values=null

    // operation columns
    this.operation={
      title: 'operation',
      width:100,
      fixed:'right',
      dataIndex: 'operation',
      render: (text, record, index) => {
        const editable  = this.state.editIndex===index;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.editDone(index, 'save')}>Save</a>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.editDone(index, 'cancel')}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                :
                <span>
                    <Popconfirm
                      visible={this.state.editConfirmVisible}
                      onVisibleChange={visible=>{
                        if(!visible){
                          return this.setState({editConfirmVisible:visible})
                        }

                        //是否还有未保存的修改
                        if (this.values && this.state.editIndex>-1) {
                          this.setState({ editConfirmVisible:visible });
                        } else {
                          this.edit(index);
                        }
                      }}
                      title="Sure to discard unsaved changes?"
                      onConfirm={() => this.edit(index)}
                    >
                      <a>Edit</a>
                    </Popconfirm>
                  </span>
            }
          </div>
        );
      },
    }
  }
  componentWillMount(){
    this.formatColumns(this.props.columns)
  }
  componentWillReceiveProps(nextProps){

    //更新表格数据
    if(this.props.dataSource !==nextProps.dataSource){
      this.setState({dataSource:nextProps.dataSource})
    }

    //更新columns
    if(this.props.columns!==nextProps.columns){
      this.formatColumns(nextProps.columns);
    }
  }

  //格式化 column
  formatColumns=columns=>{
    this.columns=columns.map(column=>{
      if(!column.hasRender){
        column.render=(text,record,index)=>this.renderColumns(text,record,index,column)
      }
      return column
    }).concat(this.operation)
  }
  renderColumns(text,record,index,column) {
    const { editIndex } =  this.state;
    let value=text;

    //检查是否是需要格式化显示的数据
    if(column.type && format[column.type]){
      value=format[column.type](value)
    }
    if (editIndex !== index) {
      return value;
    }

    //设置表单的禁用
    let disabled=false;
    if(column.disabled){
      if(typeof column.disabled ==='function'){
        disabled=column.disabled(record,index)
      }else{
        disabled=true;
      }
    }

    //如果组件被禁用或者 组件不存在form表单 则直接输出值
    if(disabled || !column.Component){
      return value;
    }

    //获取编辑的组件
    const FormTag=column.Component;
    return <FormTag defaultValue={text} disabled={disabled} onChange={value => this.handleChange(value,record,index,column)} />
  }
  handleChange(value,record,index,column) {
    let values=this.values || record;
    this.values={...values,[column.dataIndex]:value};
    console.log('save Value',this.values)
  }
  edit(index) {
    this.values=null;
    this.setState({ editIndex:index });
  }
  editDone(index, type) {
    if(type==='cancel'){
      if(this.state.dataSource[index] && this.state.dataSource[index].id){
        this.setState({editIndex:-1})
      }else{
        this.setState(preState=>({
          dataSource:update(preState.dataSource,{$splice:[[index,1]]}),
          editIndex:-1
        }))
      }
    }else if(type==='save'){
      if(this.values){ // 是否修改过表单
        this.props.onSave(this.values,index).then((e)=>{
          if(e.error){
            message.error(e.error.message)
          }else{
            this.setState({editIndex:-1})
          }
        })
      }else{

        //提示用户么有修改任何信息
        message.warning('No changes to data',1)
        this.setState({editIndex:-1})
      }
    }
  }
  onAdd=()=>{
    this.setState(prevState=>{

      let newDataSource=prevState.dataSource.concat(this.props.initial)
      return {dataSource:newDataSource,editIndex:newDataSource.length-1}
    })
  }
  render() {
    let scroll={x:this.columns.reduce((v,column)=>isNaN(column.width)?v:v+column.width,0),...this.props.scroll};
    return (
      <span>
        <SmallTable dataSource={this.state.dataSource} scroll={scroll} columns={this.columns} size="small" className="table-form" />
        {
          this.props.initial &&
          <Button icon="plus" size='small' onClick={this.onAdd} disabled={this.state.editIndex>-1} />
        }
      </span>
    );
  }
}

export default TableForm
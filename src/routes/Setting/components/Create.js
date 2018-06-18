import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropsTypes from 'react-immutable-proptypes'
import {Button} from 'antd'
import ContentLayout,{ContentHeader} from '../../../components/layouts/ContentLayout.js'
import SimpleForm from '../../../components/antd/SimpleForm'
import Immutable from 'immutable'
import {browserHistory} from 'react-router'

class Create extends React.PureComponent{
  static defaultProps={
    company:Immutable.Map(),
  }
  static propTypes = {
    $initialValue:  ImmutablePropsTypes.map,
    onSave:         PropTypes.func,
    columns:        PropTypes.array.isRequired,
    extra:          PropTypes.element
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
      let formFields=this.props.columns.map(e=>e.get('dataIndex'));
      let initialValue=props.$initialValue.filter((value,key)=>formFields.indexOf(key)>-1).toJS()
      this.form.setFieldsValue(initialValue)
    }
  }
  onSave=()=>{
    this.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSave(values)
      }
    });
  }
  render(){
    const {columns,location,children,extra,onSave}=this.props;
    return (
      <ContentLayout
        header={<ContentHeader location={location} extra={extra} />}
      >
        <SimpleForm columns={columns} ref={e=>this.form=e} layout="inline" />
        <div className="form-action">
          {
            onSave &&
            <Button type='primary' size="large" onClick={this.onSave}>Save</Button>
          }
          <Button size="large" onClick={browserHistory.goBack}>Back</Button>
        </div>
        {children}
      </ContentLayout>
    )
  }
}
export default Create
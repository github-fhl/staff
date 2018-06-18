import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropsTypes from 'react-immutable-proptypes'
import SimpleForm from '../../../components/antd/SimpleForm'
import Immutable from 'immutable'

class Create extends React.PureComponent{
  static propTypes = {
    $initialValue:  ImmutablePropsTypes.map,
    onSave:         PropTypes.func,
    columns:        PropTypes.array.isRequired,
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
    return (
      <SimpleForm wrappedComponentRef={e=>this.form=e.props.form} layout="inline" {...this.props} />
    )
  }
}
export default Create
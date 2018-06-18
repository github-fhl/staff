import React from 'react'
import {Button, Select ,Modal , message} from 'antd'
import {browserHistory} from 'react-router'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ContentLayout, {ContentHeader} from '../../../components/layouts/ContentLayout.js'
import {fetchSingleSow,createPosition,getSowNote} from '../modules/sow'
import {currencyFields} from '../../../common/config'
import CreatePosition from './CreatePosition'
import moment from 'moment'
import {routerMap} from 'routes/routers.config'

const Option=Select.Option

class CreatePositionWarp extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible:false,
      sow: {},
      notesList:[],
      note:''
    }
  }
  static propTypes = {
    $setting: ImmutablePropTypes.map.isRequired
  }

  componentDidMount() {
    this.fetchSow();
  }
  fetchSow=()=>{

    // fetch 当前的sow
    fetchSingleSow(this.props.params.id).then(e=>{
       const rate={
        [currencyFields.rmb]: e['currencys'].find(item=>item.id===currencyFields.rmb)['currencyDetails'][0],
        [currencyFields.usd]: e['currencys'].find(item=>item.id===currencyFields.usd)['currencyDetails'][0]
      }
      this.setState({
        rate,
        sow:e.sow
      })
    })
  }
  fetchNotes=()=>{
    if(this.state.notesList.length<1){
      getSowNote().then(e=>{
        if(!e.error){
          this.setState({notesList:e.objs})
        }
      })
    }
  }

  onCheckForm=()=>{
    this.form.validateFields((err) => {
      if (!err) {
        this.fetchNotes();
        this.setState({visible:true})
      }
    });
  }
  onSave=()=>{
    const {note,sow}=this.state;
    if(!note){
      return message.error('缺少备注')
    }

    this.form.validateFields((err, params) => {
      if (!err) {
        const {budget,...values}=params;
        const momentYear=moment(sow.year,'YYYY')
        const baseValue={
          year:sow.year,
          noteContent:note,
          sowId:this.props.params.id,
          validDate:momentYear.startOf('year').format('YYYY-MM-DD'),
          invalidDate:momentYear.endOf('year').format('YYYY-MM-DD'),
          FTE:1
        }
        createPosition({...budget,...values,...baseValue}).then(e=>{
          if(e.error){
            message.error(e.error.message)
          }else{
            browserHistory.push(`/${routerMap.sow.path}/${this.props.params.id}/${e.obj.id}`)
          }
        })
      }else{
        message.error(' Form validation error,Please check.')
      }
    });
  }

  onCancel=()=>this.setState({visible:false});
  onNoteChange=value=>this.setState({note:value})
  render() {
    const {sow,visible,notesList}=this.state;
    const {$setting}=this.props;

    //面包屑导航const
    const breadcrumbTitle={[sow.id]:sow.name};
    const Breadcrumb=(<ContentHeader location={location} title={breadcrumbTitle} />);

    return (
      <ContentLayout header={Breadcrumb}>
        <CreatePosition sow={sow} $setting={$setting} ref={e=>this.form=e} />
        <div className="form-action" style={{marginLeft:20,marginRight:40}}>
          <Button onClick={this.onCheckForm} type="primary" size='large'>Save</Button>
        </div>
        <Modal title='请填写备注' visible={visible} onCancel={this.onCancel} onOk={this.onSave}>
          <div style={{width:'60%',margin:'30px auto'}}>
            备注：
            <Select
              mode="combobox" showSearch={true} dropdownMatchSelectWidth={false} size="large"
              onChange={this.onNoteChange}
              style={{width:250}}
            >
              {notesList.map(item=>{
                return <Option key={item.noteContent}>{item.noteContent}</Option>
              })}
          </Select>
          </div>
        </Modal>
      </ContentLayout>
    )
  }
}
export default CreatePositionWarp

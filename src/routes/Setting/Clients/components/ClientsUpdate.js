import React from 'react'
import update from 'react/lib/update'
import PropTypes from 'prop-types'
import {message,Button} from 'antd'
import TableForm from 'components/antd/TableForm'
import ClientsCreate from './ClientsCreate'
import Columns from 'common/columns'
import {detailFormColumns} from '../modules/clients'
import {fetchSingleClients,createClientsDetail,updateClientsDetail,fetchClients,fetchTeams} from 'routes/Setting/modules/setting'
import { browserHistory } from 'react-router'
import {routerMap} from 'routes/routers.config'
import {clientsFormColumns} from '../modules/clients'
import SettingSelect from 'containers/SettingSelect'

const setting=routerMap.setting;

// 更新表单的 column
const updateFormColumns=new Columns(clientsFormColumns);
updateFormColumns.updateForm({id:{disabled:true}}); //id 禁用

//创建不重复的TeamsSelect

const createNoRepeatTeams=list=>{
  return class extends React.PureComponent{
    render(){
      let props={
        dropdownMatchSelectWidth:false,
        type:setting.teams.path,
        mode:'combobox',
        valueField:'name',
        filterAction:$list=>$list.filter($team=>list.indexOf($team.get('name'))<0)
      };
      return <SettingSelect {...this.props} {...props} />
    }
  }
}



//新建一条detail的默认值
const detailInitial={}
const extra=(
  <Button type="primary" size="large" onClick={()=>browserHistory.push(`/${setting.path}/${setting.clients.path}/${setting.clients.create.path}`)}>Create</Button>
)


//detail 表单的column
const clientsDetailColumns=new Columns(detailFormColumns);

class ClientsUpdate extends React.PureComponent{
  static propTypes = {
    onSave: PropTypes.func.isRequired
  }
  state={}
  componentDidMount(){
    fetchSingleClients(this.props.params.id).then(e=>{
      if(e.error){
        message.error(e.error.message)
      }else{
        this.setState({details:e.teams})
      }
    })
  }
  onSave=(params,editIndex)=>{
    params.clientId=this.props.params.id;

    // 新建或更新成功后操作
    const fetchThen=obj=>{
      if(!obj.error){
        this.props.dispatch(fetchClients()) // 保存成功 更新列表页数据

        // 是否 更新 teams 列表
        if(obj.createdTeam){
          this.props.dispatch(fetchTeams())
        }
        this.setState(prevState=>({
          details:update(prevState.details,{$splice:[[editIndex,1,obj]]})
        }))
      }
      return obj
    };

    // 根据id判断是更新 或 新建
    if(params.id){
      return updateClientsDetail(params).then(fetchThen)
    }else{

      //如果当前选择的是已存在的Team,需要将Team的 id 放入参数中
      let $teams=this.props.setting.get('teams');
      if($teams){
        const $selectTeam=$teams.find($team=>$team.get('name')===params.name)
        if($selectTeam){
          params.id=$selectTeam.get('id')
        }
      }
      return createClientsDetail(params).then(fetchThen)
    }
  }
  render(){
    console.log('clients Update props=',this.props)
    const {details}=this.state;

    //选项中排除掉已存在的teams
    if(Array.isArray(details)){
      const teamsNameList=details.map(detail=>detail.name);
      clientsDetailColumns.updateTable({
        name:{
          Component:createNoRepeatTeams(teamsNameList)
        }
      })
    }
    return (
      <ClientsCreate {...this.props} extra={extra} columns={updateFormColumns.form}>
        <TableForm initial={detailInitial} columns={clientsDetailColumns.table} onSave={this.onSave} dataSource={details}  />
      </ClientsCreate>
    )
  }
}

export default ClientsUpdate
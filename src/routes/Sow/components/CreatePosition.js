import React from 'react'
import {Input, Select ,Form ,Button,message} from 'antd'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {getPositionName,getPositionBudget,getSowLevel,updatePositionRemark} from '../modules/sow'
import {argumentFields} from '../../../common/config'
import SettingSelect from 'containers/SettingSelect'
import ArgumentSelect from 'containers/ArgumentSelect'
import CreatePositionBudget from './CreatePositionBudget'
import {routerMap} from 'routes/routers.config'
import './SowDetailEntryPO.scss'

const setting=routerMap.setting;
const FormItem = Form.Item;
const formItemLayout={
  labelCol:{span:9},
  wrapperCol:{span:15}
}

export const createFields={
  HCCategory: 'HCCategory',
  companyId: 'companyId',
  currencyId: 'currencyId',
  expectStaffId: 'expectStaffId',
  fordFunctionId: 'fordFunctionId',
  location: 'location',
  name: 'name',
  officeId: 'officeId',
  remark: 'remark',
  skillLevel: 'skillLevel',
  sowLevel: 'sowLevel',
  stdPosId: 'stdPosId',
  teamId: 'teamId',
  titleId: 'titleId',
  budget: 'budget',
  stdPosDetailId:'stdPosDetailId',
};

//设置Select 创建器
const createSettingSelect=type=>{
  return class extends React.PureComponent{
    render(){
      return <SettingSelect {...this.props} type={type} className="select-underline" />
    }
  }
}

// 系统参数 Select 创建器
const createArgumentSelect=type=>{
  return class extends React.PureComponent{
    render(){
      return <ArgumentSelect {...this.props} type={type} className="select-underline" />
    }
  }
}
const OfficeForm=createSettingSelect(setting.offices.path)
const TeamForm=createSettingSelect(setting.teams.path)
const StdPossForm=createSettingSelect(setting.stdPoss.path)
const TitleForm=createSettingSelect('titles')
const CompanyForm=createSettingSelect(setting.company.path)
const FordFunctionForm=createSettingSelect(setting.fordFunctions.path)
const LocationForm=createArgumentSelect(argumentFields.location)
const SkillLevelForm=createArgumentSelect(argumentFields.skillLevel)

class CreatePosition extends React.PureComponent {
  static propTypes = {
    params:        PropTypes.object,
    isUpdate:      PropTypes.bool,
    sow:           PropTypes.object.isRequired,
    $setting:      ImmutablePropTypes.map.isRequired
  }
  // 重置 StdPoss
  resetStdposs=()=>this.props.form.resetFields([createFields.stdPosId,createFields.budget])
  onTeamChange=value=>{

    // 设置 position code
    const teamBrief=this.props.$setting.getIn([setting.teams.path,value,'brief']);
    const clientBrief=this.props.$setting.getIn([setting.clients.path,this.props.sow.clientId,'brief']);
    getPositionName({
      year:this.props.sow.year,
      teamBrief,
      clientBrief
    }).then(e=>{
      if(!e.error){
        this.props.form.setFieldsValue({name:e.obj})
      }
    })

    // 重设stdPoss
    this.resetStdposs()
  }
  onOfficeChange=value=>{

    // 设置 Currency
    const currencyId=this.props.$setting.getIn([setting.offices.path,value,'currencyId']);
    this.props.form.setFieldsValue({currencyId})

    // 重设stdPoss
    this.resetStdposs()
  }
  onLocationChange=()=>this.resetStdposs();
  onStdPossChange=value=>this.getSalary({...this.props.form.getFieldsValue(),[createFields.stdPosId]:value})
  onChangeSkillLevel=value=>this.getSalary({...this.props.form.getFieldsValue(),[createFields.skillLevel]:value})
  getSalary=params=>{
    if(params[createFields.stdPosId] && params[createFields.skillLevel]){

      // 获取 stdPos detailId
      const stdPosDetailId=this.props.$setting.getIn([setting.stdPoss.path,params[createFields.stdPosId],'stdPosDetails']).find($detail=>{
        return $detail.get(createFields.skillLevel)===params[createFields.skillLevel]
      }).get('id');

      // 设置隐藏表单 stdPosDetailId
      this.props.form.setFieldsValue({stdPosDetailId});

      // 获取 Budget 金额
      getPositionBudget({stdPosDetailId}).then(e=>{
        if(!e.error){
          let budget=e.obj;
          this.props.form.setFieldsValue({budget:e.obj});
          this.onBudgetChange(budget);
        }
      })
    }
  }
  onBudgetChange=budget=>{
    const params=this.props.form.getFieldsValue();
    const directLabor=budget['directLabor'];
    const currencyId=params['currencyId']
    if(directLabor && currencyId){
      getSowLevel({directLabor,currencyId,year:this.props.sow.year}).then(e=>{
        if(!e.error){
          this.props.form.setFieldsValue({[createFields.sowLevel]:e.obj})
        }
      })
    }
  }
  onRemarkSave=()=>{
    const remark=this.props.form.getFieldValue(createFields.remark);
    updatePositionRemark({id:this.props.params.positionId,remark}).then(e=>{
      if(e.error){
        message.error(e.error.message)
      }else{
        message.success('save success')
      }
    })
  }

  render() {
    const {form:{getFieldDecorator,getFieldsValue},$setting,sow,isUpdate}=this.props;

    //获取表单的值
    const params=getFieldsValue();

    // 根据 sow clients 筛选 team 下拉列表
    const filterTeam=$teams=>{
      if(isUpdate)return $teams;
      const $clientTeams=$setting.getIn([setting.clients.path,sow.clientId,setting.teams.path]);
      const clientTeamsList=$clientTeams?$clientTeams.map($=>$.get('id')).toArray():[];
      return $teams.filter($team=>clientTeamsList.indexOf($team.get('id'))>-1);
    };

    //stdPoss 属性
    const stdPossDisabled= isUpdate || !(
      params[createFields.teamId] &&
      params[createFields.location] &&
      params[createFields.officeId]
    );
    const filterStdPoss=$teams=>{
     if(stdPossDisabled){
       return $teams;
     }
      return $teams.filter($team=>(
        $team.get(createFields.teamId)==params[createFields.teamId] &&
        $team.get(createFields.location)==params[createFields.location] &&
        $team.get(createFields.officeId)==params[createFields.officeId]
      ));
    };

    // 隐藏表单
    getFieldDecorator(createFields.stdPosDetailId);
    return (
        <Form className="simple-form" style={{marginLeft:20}} layout="inline">

          {/*  Code  */}
          <FormItem label='Code' {...formItemLayout}>
            {getFieldDecorator(createFields.name,{
              rules:[{
                type:'string',
                message:'Get the code through the Team',
                required:true
              }]
            })(<Input className="input-underline" disabled={true} />)}
          </FormItem>

          {/*  Staff  */}
          <FormItem label='Staff' {...formItemLayout}>
            {getFieldDecorator(createFields.expectStaffId)(<Select className="select-underline" disabled={isUpdate} />)}
          </FormItem>

          {/*  Company  */}
          <FormItem label='Company' {...formItemLayout}>
            {getFieldDecorator(createFields.companyId,{
              rules:[{
                type:'string',
                message:'Missing Company',
                required:true
              }]
            })(<CompanyForm disabled={isUpdate} />)}
          </FormItem>

          {/*  Title  */}
          <FormItem label='Title' {...formItemLayout}>
            {getFieldDecorator(createFields.titleId,{
              rules:[{
                type:'string',
                message:'Missing Title',
                required:true
              }]
            })(<TitleForm disabled={isUpdate} />)}
          </FormItem>

          {/*  SOW Level  */}
          <FormItem label='SoW Level' {...formItemLayout}>
            {getFieldDecorator(createFields.sowLevel)(<Input className="input-underline" disabled={true}/>)}
          </FormItem>

          {/*  Team  */}
          <FormItem label='Team' {...formItemLayout}>
            {getFieldDecorator(createFields.teamId,{
              rules:[{
                type:'string',
                message:'Missing Team',
                required:true
              }]
            })(<TeamForm disabled={isUpdate} filterAction={filterTeam} onChange={this.onTeamChange} />)}
          </FormItem>

          {/*  Ford Function  */}
          <FormItem label='Ford Function' {...formItemLayout}>
            {getFieldDecorator(createFields.fordFunctionId,{
              rules:[{
                type:'string',
                message:'Missing Ford Function',
                required:true
              }]
            })(<FordFunctionForm disabled={isUpdate} />)}
          </FormItem>

          {/*  Office  */}
          <FormItem label='Office' {...formItemLayout}>
            {getFieldDecorator(createFields.officeId,{
              rules:[{
                type:'string',
                message:'Missing Office',
                required:true
              }]
            })(<OfficeForm disabled={isUpdate} onChange={this.onOfficeChange} />)}
          </FormItem>

          {/*  Local / Expat  */}
          <FormItem label='Local / Expat' {...formItemLayout}>
            {getFieldDecorator(createFields.location,{
              rules:[{
                type:'string',
                message:'Missing Local / Expat',
                required:true
              }]
            })(
              <LocationForm
                disabled={isUpdate}
                filterAction={$list=>$list.filter(name=>name!=='Common')}
                onChange={this.onLocationChange}
              />)}
          </FormItem>

          {/*  Currency  */}
          <FormItem label='Currency' {...formItemLayout}>
            {getFieldDecorator(createFields.currencyId)(<Input disabled={true} className="input-underline"/>)}
          </FormItem>

          {/*  Standard Position  */}
          <FormItem label='Standard Position' {...formItemLayout}>
            {getFieldDecorator(createFields.stdPosId,{
              rules:[{
                type:'string',
                message:'Missing Standard Position',
                required:true
              }]
            })(<StdPossForm onChange={this.onStdPossChange} disabled={stdPossDisabled} filterAction={filterStdPoss} />)}
          </FormItem>

          {/*  Skill's Level  */}
          <FormItem label="Skill's Level" {...formItemLayout}>
            {getFieldDecorator(createFields.skillLevel,{
              rules:[{
                type:'string',
                message:"Missing Skill's Level",
                required:true
              }]
            })(<SkillLevelForm disabled={isUpdate} onChange={this.onChangeSkillLevel} />)}
          </FormItem>

          {/*  HC Category  */}
          <FormItem label='HC Category' {...formItemLayout}>
            {getFieldDecorator(createFields.HCCategory,{
              initialValue:`${sow.year} New`
            })(<Input className="input-underline" disabled={true} />)}
          </FormItem>

          {/*  Remark  */}
          <FormItem label='Remark' {...formItemLayout}>
            {getFieldDecorator(createFields.remark)(<Input className="input-underline"/>)}
          </FormItem>
          {isUpdate &&
            <Button type='primary' onClick={this.onRemarkSave}>Save</Button>
          }

          {/*  Remark  */}
          <FormItem style={{width:'100%',margin:0}}>
            {getFieldDecorator(createFields.budget)(<CreatePositionBudget  disabled={isUpdate} onChange={this.onBudgetChange} params={{
              year:sow.year,
              officeId:params['officeId'],
              existStaff:!!params[createFields.expectStaffId]
            }} />)}
          </FormItem>

        </Form>
    )
  }
}
export default Form.create()(CreatePosition)

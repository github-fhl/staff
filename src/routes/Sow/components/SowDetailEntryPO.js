import React from 'react'
import {Button, Input,Checkbox, Icon ,Form ,Upload ,Tooltip , message,Alert} from 'antd'
import { browserHistory } from 'react-router'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ContentLayout, {ContentHeader} from '../../../components/layouts/ContentLayout.js'
import {fetchSingleSow,entryPo} from '../modules/sow'
import {format} from '../../../common/format'
import {currencyFields,sowTargetCurrencyFields} from '../../../common/config'
import SettingSelect from 'containers/SettingSelect'
import {MoneyInputInForm} from 'components/column'
import {routerMap} from 'routes/routers.config'
import './SowDetailEntryPO.scss'

const setting=routerMap.setting;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
let formCount = 0;
const typeOptions = [
  { label: 'Gross Fee', value: 'gross' },
  { label: 'Incentive', value: 'incentive' },
  { label: 'Production', value: 'production' },
  { label: 'Travel', value: 'travel' },
  { label: 'Media', value: 'media' },
];
const formItemLayout={
  labelCol:{span:9},
  wrapperCol:{span:15}
}

//设置Select 创建器
const createSettingSelect=type=>{
  return class extends React.PureComponent{
    render(){
      return <SettingSelect {...this.props} type={type} className="select-underline" />
    }
  }
}
const Currency=createSettingSelect(setting.currency.path)

class SowDetailEntryPO extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      sow: {},
    }
  }
  static propTypes = {
    $transitions: ImmutablePropTypes.list
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

  // 换算汇率
  transformCurrency=(value,targetCurrency,fromCurrency=this.state.sow.currencyId)=>{
    const {rate}=this.state;

    console.log(value,targetCurrency,sowTargetCurrencyFields[targetCurrency]);

    //如果转换的值货币类型相同 则直接返回值
    if(fromCurrency===targetCurrency || value===undefined){
      return value;
    }else{
      const targetField=sowTargetCurrencyFields[targetCurrency];
      return value / rate[fromCurrency][targetField];
    }
  }
  add = () => {
    formCount++;
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(formCount);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  remove=k=>{
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  onSubmit=()=>{
    this.props.form.validateFields((err, params) => {
      if (!err) {
        console.log('onSubmit params=',params)

        entryPo({clientPos:params.values},this.props.params.id).then(e=>{
          if(e.error){
            message.error(e.error.message)
          }else{
            browserHistory.push(`/${routerMap.sow.path}/${this.props.params.id}`)
          }
        })
      }
    });
    // console.log('values=',this.props.form.getFieldsValue())
  }
  normFile = (e) => {
    console.log('Upload event:', e);
    return e && e.file.response && e.file.response.obj;
  }
  onTypeChange=key=>value=>{
    const {sow}=this.state;
    const {form:{getFieldValue,resetFields,setFieldsValue}}=this.props;
    let resetList=[];
    let newValue={};
    const values=getFieldValue('values');
    console.log('onTypeChange values===',values)
    typeOptions.forEach(item=>{
      if(value.indexOf(item.value)<0){
        resetList.push(`values[${key}].${item.value}`)
      }else if(values[key][item.value]===undefined){

        //如果已启用的key值为空，则找到sow下的值变为当前默认值
        newValue[`values[${key}].${item.value}`]=this.transformCurrency(sow[item.value],values[key]['currencyId'],sow['currencyId']);
      }
    });
    setFieldsValue(newValue);
    resetFields(resetList)
  }

  //当currency改变，根据汇率转换表单值，
  onCurrencyChange=key=>value=>{
    const {form:{getFieldValue,setFieldsValue}}=this.props;
    const values=getFieldValue('values');
    const oldCurrency=values[key]['currencyId'];
    const newValues={}

    //将需要改变的字段循环输出
    typeOptions.forEach(item=>{
        let field=`values[${key}].${item.value}`;
      newValues[field]=this.transformCurrency(values[key][item.value],value,oldCurrency)
    });
    setFieldsValue(newValues)
  }

  // 金额表单验证
  checkTypeValue=(field,key)=>(rule, value, callback)=>{
    if(value===undefined){return callback();} //如果是空值默认通过
    const {sow}=this.state;
    const values=this.props.form.getFieldValue('values');
    const currency=values[key]['currencyId'];
    let adjustMoney=parseFloat(this.transformCurrency(this.props.adjustMoneyUSD,currency,currencyFields.usd));
    const sowValue=parseFloat(this.transformCurrency(sow[field],currency));

    let minValue=sowValue-adjustMoney>0?sowValue-adjustMoney:0;
    let maxValue=sowValue+adjustMoney;
    if (parseFloat(value) >= minValue && parseFloat(value)<=maxValue){
      callback();
      return;
    }
    callback(`Must between ${format.money(minValue)} and ${format.money(maxValue)}`);
  }

  getTotalValue=k=>{
    const values=this.props.form.getFieldValue('values');
    return typeOptions.reduce((value,item)=>{
      const currValue=values[k] && values[k][item.value];
      return isNaN(currValue)?value:value+currValue;
    },0)
  }

  render() {
    const {sow}=this.state;
    const {form:{getFieldDecorator,getFieldValue}}=this.props;

    //面包屑导航
    const breadcrumbTitle={[sow.id]:sow.name};
    const Breadcrumb=(<ContentHeader location={location} title={breadcrumbTitle} />);

    //初始化表单key
    getFieldDecorator('keys', { initialValue: [0] });
    const keys=getFieldValue('keys');
    const types=getFieldValue('type') || [];
    const values=getFieldValue('values') || {};
    console.log('values==',values)

    //输出表list
    const formItems = keys.map((k) => {
      //获取某个字段的禁用值
      const getDisabled=field=>!(types[k] && types[k].indexOf(field)>-1);
      const typeItem=typeOptions.map(item=>{
        return (
          <FormItem label={item.label} {...formItemLayout} key={item.value}>
            {getFieldDecorator(`values[${k}].${item.value}`,{rules:[{ validator:this.checkTypeValue(item.value,k)}]})(
              <MoneyInputInForm disabled={getDisabled(item.value)} />
            )}
          </FormItem>
        )
      });
      return (
        <div key={k} className="po-form-row">
          <Icon type="close" className="close-item" onClick={()=>this.remove(k)} />
          <FormItem
            label={(
              <span>
                Type&nbsp;
                  <Tooltip title="选中会开启其它表单">
                    <Icon type="question-circle-o" />
                  </Tooltip>
              </span>
            )}
            style={{width:900,display:'block'}}
            labelCol={{span:3}}
            wrapperCol={{span:21}}
          >
            {getFieldDecorator(`type[${k}]`)(
              <CheckboxGroup options={typeOptions} onChange={this.onTypeChange(k)} />)}
          </FormItem>
          <FormItem label='PO' {...formItemLayout}>
            {getFieldDecorator(`values[${k}].name`,{
              rules:[{
                type:'string',
                message:'Missing PO',
                required:true
              }]
            })(<Input className="input-underline"/>)}
          </FormItem>
          <FormItem label='Currency' {...formItemLayout}>
            {getFieldDecorator(`values[${k}].currencyId`,{
              initialValue:sow.currencyId
            })(<Currency onChange={this.onCurrencyChange(k)}/>)}
          </FormItem>

          {/* 上传控件 */}
          <FormItem label='Upload File' {...formItemLayout}>
            {getFieldDecorator(`values[${k}].filePath`,{
              getValueFromEvent: this.normFile,
              rules:[{
                type:'string',
                message:'Missing File',
                required:true
              }]
            })(
              <Upload
                className="sow-po-upload"
                action="/api/uploadFile"
                data={{type:'clientPo'}}
              >
                <Button>
                  <Icon type="upload" />upload
                </Button>
              </Upload>
            )}
          </FormItem>

          {typeItem}

          <FormItem label='Total' {...formItemLayout}>
            {getFieldDecorator(`values[${k}].total`,{initialValue:this.getTotalValue(k)})(<MoneyInputInForm disabled={true}/>)}
          </FormItem>
        </div>
      )
    })

    console.log('录入po props',this.props)

    return (
      <ContentLayout header={Breadcrumb}>
        <Form className="po-form" style={{marginLeft:20}} layout="inline" onSubmit={this.onSubmit}>
          {formItems}
          <div className="form-action">
            <Button onClick={this.onSubmit} type="primary" disabled={keys.length<1}>Submit</Button>
            <Button onClick={this.add}>add</Button>
            <Alert
              style={{marginTop:20,marginRight:40}}
              message="温馨提示:"
              description={`勾选 Type 后会启用对应栏目，每个栏目的浮动值不能超过默认值 ${format.money(this.props.adjustMoneyUSD)} 美元`}
              type="info"
            />
          </div>
        </Form>
      </ContentLayout>
    )
  }
}
export default Form.create()(SowDetailEntryPO)

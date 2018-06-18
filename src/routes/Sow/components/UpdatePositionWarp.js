import React from 'react'
import {Button,message,DatePicker,Input,Popconfirm,Modal,InputNumber} from 'antd'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import ContentLayout, {ContentHeader} from '../../../components/layouts/ContentLayout.js'
import {fetchSingleSow,fetchSinglePosition,buildSowColumnsDataSource,fetchClientCost,createSowPositions} from '../modules/sow'
import {positionSowTableColumns} from '../modules/SowColumns'
import CreatePosition,{createFields} from './CreatePosition'
import {ImmutableTable} from 'components/antd/Table'
import {NumberInput} from 'components/column'
import {fixedNumber} from 'common/format'
import {sowType,sowFields,flowStatus} from 'common/config'
import Immutable from 'immutable'
import moment from 'moment'
import Columns from 'common/columns'
import {browserHistory} from 'react-router'
import {routerMap} from 'routes/routers.config'
import './UpdatePositionWarp.scss'

const { RangePicker } = DatePicker;
const budgetFields=["annualSalary", "annualCola", "bonus", "directComp", "benefits", "directLabor", "overhead", "markup", "net", "tax", "gross", "budgetIncentive",];
const costFields=['net','tax','gross','budgetIncentive','officeId'];
const postPositionFields=["id", "sowId", "FTE", "net", "tax", "gross", "incentive", "grandTotal"];
const costPositionFields=[ "FTE", "net", "tax", "gross", "incentive", "grandTotal"];
const tableColumns=new Columns(positionSowTableColumns);

class CreatePositionWarp extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible:false,
      sow: {},
      $position: Immutable.Map(),
      $sowPositions:Immutable.List()
    }
  }
  static propTypes = {
    $setting:   ImmutablePropTypes.map.isRequired,
    coreCompany:   PropTypes.string,
    $sow:       ImmutablePropTypes.map.isRequired
  }
  componentWillReceiveProps(nextProps){
    const {params:{id,positionId}}=nextProps;

    // 如果切换sow,重新fetch sow 和 position 内容
    if(this.props.params.id !==id){
      this.fetchSow(id);
      this.fetchPosition(positionId);
    }
  }
  componentDidMount() {
    this.fetchSow();
    this.fetchPosition();
    if(this.props.$sow.size<1){
      this.props.fetchAllSow().then(e=>this.mergeDefaultPosition());
    }
  }
  fetchSow=(id=this.props.params.id)=>{

    // fetch 当前的sow
    fetchSingleSow(id).then(e=>{
      const {sow}=e;
      if(sow.flowStatus===flowStatus.disabled){
        const refModal=Modal.error({
          title: 'Wrong page',
          content: `This sow status is ${sow.flowStatus},The page will jump out.`,
          onOk:()=>{
            refModal.destroy();
            browserHistory.push(`/${routerMap.sow.path}/${sow.id}`);
          }
        })
      }
      this.setState({sow:e.sow},this.mergeDefaultPosition)
    })
  }
  fetchPosition=(id=this.props.params.positionId)=>{

    // fetch 当前的sow
    fetchSinglePosition(id).then(e=>{
      if(!e.error){
        let {sowPositions,...position}=e.obj;

        // 设置时间为moment
        position.validDate=moment(position.validDate)
        position.invalidDate=moment(position.invalidDate)

        //获取budget的值给表单使用
        const budget=budgetFields.reduce((value,key)=>{value[key]=position[key];return value},{});
        let  formValues={}
        for( let field in createFields){
          formValues[field]=position[field]
        }
        this.setState({$sowPositions:Immutable.fromJS(sowPositions),$position:Immutable.Map(position)},this.mergeDefaultPosition);
        this.form.setFieldsValue({...formValues,budget});
      }
    })
  }
  mergeDefaultPosition=()=>{

    const {sow,$position}=this.state;
    //特殊情况不 merge InHouse
    if(
      sow.id !==this.props.params.id ||  // 如果最新的 sow 信息还没有fetch 下来;
      sow.sowType===sowType.letGo        // 如果当期的sow是 LetGo，
    ){
      return;
    }
    let newSowPosition=this.mergeCurrentSowPosition();

    //如果是 coreCompany 则 merge InHouse
    if(this.props.coreCompany === $position.get('companyId') ){
      newSowPosition=this.mergeInHousePosition(newSowPosition)
    }
    this.setState({$sowPositions:newSowPosition});
  }
  mergeCurrentSowPosition=($sowPositions=this.state.$sowPositions)=>{
    const {sow}=this.state;

    const hasCurrentSow=$sowPositions.some($p=>$p.get('sowId')===this.props.params.id);
    // 如果 sow position 不含 当前的sow，则merge 当前sow的数据进去；
    if(!hasCurrentSow && sow.year){
      const fields=["name", "version", "clientId","sowType"];
      const sowPosition=fields.reduce((value,key)=>{
        value[key]=sow[key];
        return value;
      },{});
      const costPosition=costPositionFields.reduce((value,key)=>{
        value[key]=0
        return value;
      },{});
      return $sowPositions.push(Immutable.fromJS({sow:sowPosition,...costPosition,sowId:sow.id}))
    }
    return $sowPositions
  }
  mergeInHousePosition=($sowPositions=this.state.$sowPositions)=>{
    const hasInHouse=$sowPositions.some($p=>$p.getIn(['sow','sowType'])===sowType.inHouse);
    const $specialSows=this.props.$sow.get(sowFields.specialSows);
    const year=this.state.sow.year;

    // 如果 sow position 不含 inHouse,则加入 inHouse sow
    if(!hasInHouse && year && $specialSows){
      const $inHouse=$specialSows.find($item=>{
        return (
          $item.get('sowType')===sowType.inHouse &&
          $item.get('year')===year
        )
      });
      const fields=["name", "version", "clientId","sowType"];
      const sowPosition=fields.reduce((value,key)=>{
        value[key]=$inHouse.get(key)
        return value;
      },{});
      const costPosition=costPositionFields.reduce((value,key)=>{
        value[key]=0
        return value;
      },{});
      const $newSowPositions=$sowPositions.push(Immutable.fromJS({sow:sowPosition,...costPosition,sowId:$inHouse.get('id')}))
      return $newSowPositions
    }
    return $sowPositions
  }
  onDataChange=values=>{
    let {sow,$position,$sowPositions}=this.state,
        newState={};

    //计算 MAX FTE
    if(values[0] && values[1]){
      const totalDay=Math.abs(values[0].diff(values[1],'day'));
      const yearDay=moment([sow.year]).isLeapYear()?366:365;
      $position=$position.set('FTE',fixedNumber(totalDay/yearDay))
    }
    $position=$position.merge({validDate:values[0],invalidDate:values[1]});
    newState.$position=$position;

    // check 并计算 InHouse FTE及花费
    this.resetInHouseFte($position);

    //如果当前sow下只有一条 sowPosition 并且不是In House， 则 MAX FTE 等于 sowPosition FTE
    const isCurrentSow=this.props.params.id === $sowPositions.getIn([0,'sowId']), // 是否是当前sow下
          notInHouse=$sowPositions.getIn([0,'sow','sowType'])!==sowType.inHouse;  // 是否不为InHouse
    if($sowPositions.size===1 && isCurrentSow && notInHouse){
      newState.$sowPositions=$sowPositions.setIn([0,'FTE'],$position.get('FTE'));

      //重新fetch FTE对应的花费。
      this.getFte($sowPositions.getIn([0,'sow','clientId']),$position.get('FTE'));
    }

    // 更新 state
    this.setState(newState);
  }
  resetInHouseFte=($position=this.state.$position,$sowPositions=this.state.$sowPositions)=>{
      const maxFte=$position.get('FTE');
      const totalFte=$sowPositions.reduce((value,$item)=>fixedNumber(value+$item.get('FTE')),0);
      const $inHouse=$sowPositions.find($item=>$item.getIn(['sow','sowType'])==sowType.inHouse);
      if(!$inHouse) return;
      const clientId=$inHouse.getIn(['sow','clientId']);

      // 如果最大 FTE 超过总和，剩余部分加入到inHouse中
      if(maxFte>totalFte){
        let newInHouseFte=fixedNumber(maxFte-totalFte+$inHouse.get('FTE'));
        this.getFte(clientId,newInHouseFte)
      }else if(maxFte<totalFte){

        // 如果最大 FTE 小于 总和，剩余部分从到inHouse中扣除
        if($inHouse.get('FTE')==0){return} // 如果inHouse==0 则不做处理
        let newInHouseFte=fixedNumber($inHouse.get('FTE')-totalFte+maxFte);
        newInHouseFte=newInHouseFte<0?0:newInHouseFte; //如果是FTE是负数则设为0;
        this.getFte(clientId,newInHouseFte)
      }
  }
  getFte=(clientId,FTE)=>{

    //获取ClientCost 必要的参数字段
    const params=costFields.reduce((value,key)=>{
      value[key]=this.state.$position.get(key)
      return value;
    },{clientId,FTE})

    //获取新的 cost;
    fetchClientCost(params).then(e=>{
      if(!e.error){
        let $sowPositions=this.state.$sowPositions,
            inHouseClientId;
        // 更新cost 到 state;
        this.setState({
          $sowPositions:$sowPositions.map($item=>{
            const itemClientId=$item.getIn(['sow','clientId']);

            //保存 inHouse Client id
            if($item.getIn(['sow','sowType'])===sowType.inHouse){
              inHouseClientId=itemClientId;
            }
             // 合并更新后的cost数据；
            if(itemClientId===clientId){
              return $item.merge(e.obj);
            }
            return $item;
          })
        },()=>{
          if(clientId!==inHouseClientId){
            this.resetInHouseFte()
          }
        })
      }
    })
  }
  onFteChange=$record=>fteValue=>{
    const oldFte=$record.get('FTE')
    if(oldFte===parseFloat(fteValue)){return} // 如果值没有改变则直接返回

    const {$position,$sowPositions}=this.state;
    const maxFte=$position.get('FTE');
    const clientId=$record.getIn(['sow','clientId']);
    let inHouseFte=0;
    const totalFte=fixedNumber($sowPositions.reduce((value,$item)=>{

      //保存 inHouse Fte 用于判断是否超过范围
      if($item.getIn(['sow','sowType'])==sowType.inHouse){
        inHouseFte=$item.get('FTE')
      }

      if($item.getIn(['sow','clientId'])===clientId){
        return value+fteValue
      }
      return value+parseFloat($item.get('FTE'))
    },0));
    if(totalFte>maxFte && inHouseFte<=0 && fteValue>oldFte){
      return message.error('Over MAX FTE,Please check.')
    }
    this.getFte(clientId,fteValue);
  }
  getPositionValue=()=>{
    const {$position,$sowPositions,sow}=this.state;


    //检查 Sow 是否包含一条 sowPosition信息。
    const hasSowId=$sowPositions.some($item=>$item.get('sowId')===sow.id);
    if(!hasSowId){
      message.error(`当前 SoW:${sow.name} 不能编辑 Position:${$position.get('name')}`);
      return null;
    }

    // 检查max 和 totalFte 是否相等
    const maxFte=$position.get('FTE');
    const totalFte=$sowPositions.reduce((value,$item)=>fixedNumber(value+$item.get('FTE')),0);
    if(maxFte!==totalFte) {
      message.error('MAX FTE must be equal to the total FTE')
      return null;
    }

    //获取参数
    const params={
      positionId:$position.get('id'),
      validDate: $position.get('validDate').format('YYYY-MM-DD'),
      invalidDate: $position.get('invalidDate').format('YYYY-MM-DD'),
      FTE:$position.get('FTE')
    }
    const sowPositions=$sowPositions.filter(item=>item.get('FTE')>0 || item.get('id')).reduce((list,$item)=>{
      let position=postPositionFields.reduce((v,key)=>{
        v[key]=$item.get(key)
        return v;
      },{})
      list.push(position);
      return list;
    },[])
    return {...params,sowPositions};
  }
  onPositionSave=()=>{

    //获取参数，并检查参数是否为空
    const params=this.getPositionValue();
    if(params===null) return;

    // 创建 Sow position
    createSowPositions(params).then(e=>{
      if(e.error){
        message.error(e.error.message)
      }else{
        browserHistory.push(`/${routerMap.sow.path}/${this.props.params.id}`);
      }
    })
  }
  onLetGoInHousePosition=type=>()=>{

    //获取参数，并检查参数是否为空
    const values=this.getPositionValue();
    if(values===null){return}
    const {sowPositions,...params} =values;

    // 查找 Let GO SowId
    const $specialSows=this.props.$sow.get(sowFields.specialSows);
    const year=this.state.sow.year;
    const $thisSow=$specialSows && $specialSows.find($item=>{
      return (
        $item.get('sowType')===type &&
        $item.get('year')===year
      )
    });
    const sowId=$thisSow && $thisSow.get('id');

    //创建 新的 sowPosition
    let newPosition={...sowPositions[0],sowId};
    delete newPosition.id;

    //重设 旧的 sowPosition
    const oldPosition=costPositionFields.reduce((value,key)=>{
      value[key]=0;
      return value;
    },{...sowPositions[0]});

    createSowPositions({...params,sowPositions:[newPosition,oldPosition]}).then(e=>{
      if(e.error){
        message.error(e.error.message)
      }else{
        this.fetchPosition()
        message.success('Save success')
      }
    })
  }
  render() {
    const {sow,$position,$sowPositions}=this.state;
    const {$setting}=this.props;
    console.log('当前 $position',$position.toJS())
    console.log('$sowPositions',$sowPositions.toJS())
    console.log('当前 sow的值',sow)

    //面包屑导航const
    const breadcrumbTitle={[sow.id]:sow.name,[$position.get('id')]:$position.get('name')};
    const Breadcrumb=(<ContentHeader location={location} title={breadcrumbTitle} />);

    // 表格属性
    tableColumns.updateTable({
      FTE:{
      render:(text,$record)=>{
        const isCurrentSow=this.props.params.id === $record.get('sowId'),
              isInHouse=$record.getIn(['sow','sowType'])===sowType.inHouse,
              isLetGo=$record.getIn(['sow','sowType'])===sowType.letGo;
        if(isCurrentSow){

          // inHouse 和 letGO Sow 不能编辑SowPosition FTE 或者 数据只存在一条时，通过修改生效日期来改变FTE
          if(isInHouse || isLetGo || $sowPositions.size===1){
            return $record.get('FTE');
          }else{
            return <InputNumber min={0} max={1} step={0.01} value={$record.get('FTE')} onChange={this.onFteChange($record)} />
          }
        }else{
          const targetLink=`/${routerMap.sow.path}/${$record.get('sowId')}/${$position.get('id')}`;
          return (
            <Popconfirm
              title={`去 ${$record.getIn(['sow','name'])} 的 ${$position.get('name')}`}
              okText="Yes" cancelText="No"
              onConfirm={()=>browserHistory.push(targetLink)}
            >
              <a>{$record.get('FTE')}</a>
            </Popconfirm>
          )
        }
      }
      },
      name:{
        render:(text,$record)=>(
          <Link
            to={`/${routerMap.sow.path}/${$record.get('sowId')}`}
            className={this.props.params.id===$record.get('sowId')?'highlight':''}
          >
            {$record.getIn(['sow','name'])}
          </Link>
        )
      }
    });
    const tableProps=buildSowColumnsDataSource({columns:tableColumns.table,$dataSource:$sowPositions});

    //Let go, In House 按钮逻辑
    const showLetGo=sow.sowType===sowType.inHouse;
    const showInHouse=sow.sowType===sowType.letGo;


    // LetGo 和 inHouse 禁用规则
    let letGoDisabled=true,
        inHouseDisabled=true;
    if(
      showLetGo &&
      $sowPositions.size==1 &&
      $sowPositions.getIn([0,'sowId'])===this.props.params.id &&  // 编辑的sowPosition 是当前的Sow
      $sowPositions.getIn([0,'sow','sowType'])===sowType.inHouse  // 编辑的sowPosition 是inHouse
    ){
      letGoDisabled=false;
    }
    if(
      showInHouse &&
      $sowPositions.size==1 &&
      $sowPositions.getIn([0,'sowId'])===this.props.params.id &&  // 编辑的sowPosition 是当前的Sow
      $sowPositions.getIn([0,'sow','sowType'])===sowType.letGo  // 编辑的sowPosition 是letGo
    ){
      inHouseDisabled=false;
    }
    return (
      <ContentLayout header={Breadcrumb}>
        <CreatePosition
          params={this.props.params}
          sow={sow}
          $setting={$setting}
          isUpdate={true}
          wrappedComponentRef={e=>this.form=e.props.form}
        />
        <div className="form-action" style={{margin:'0 40px 0 20px',border:0}}>

          {/* == Position For SOW== */}
          <h3 className="form-bar-title">Position For SoW</h3>
          <div className="form-bar-item">
            <span className="label">生效时间:</span>
            <RangePicker onChange={this.onDataChange} value={[$position.get('validDate'),$position.get('invalidDate')]} size='large' />
          </div>
          <div className="form-bar-item">
            <span className="label"> MAX FTE:</span><Input size="large" value={$position.get('FTE')} disabled={true} />
          </div>
          <ImmutableTable {...tableProps} />
          <div className="update-position-action">
            <Button type="primary" size='large' onClick={this.onPositionSave}>确认</Button>
            { showLetGo && <Button size='large' disabled={letGoDisabled} onClick={this.onLetGoInHousePosition(sowType.letGo)}>Let Go</Button> }
            { showInHouse &&<Button size='large' disabled={inHouseDisabled} onClick={this.onLetGoInHousePosition(sowType.inHouse)}>In House</Button>}
            <Button size='large' onClick={browserHistory.goBack}>Back</Button>
          </div>
        </div>
      </ContentLayout>
    )
  }
}
export default CreatePositionWarp

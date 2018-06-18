import React from 'react'
import PropTypes from 'prop-types'
import update from 'react/lib/update'
import { browserHistory } from 'react-router'
import { Link } from 'react-router'
import {Button, Switch,  Select , message ,Input, Icon ,Tooltip} from 'antd'
import ImmutablePropTypes from 'react-immutable-proptypes'
import immutable from 'immutable'
import ContentLayout, {ContentHeader} from '../../../components/layouts/ContentLayout.js'
import {ImmutableFixedTable} from '../../../components/antd/Table'
import {sowDetailTableColumns,sowDetailSalaryTableColumns,sowDetailMoreTableColumns,sowDetailColumnsWith} from '../modules/SowColumns'
import {fetchSingleSow,approvalFlow,buildSowColumnsDataSource} from '../modules/sow'
import Columns from 'common/columns'
import api from 'common/api'
import {flowStatus, currencyFields,sowType} from 'common/config'
import {fixedNumber} from 'common/format'
import {arrayToImmutableMap} from '../../../utils/'
import {FlowBtn} from './SowDetailFlow'
import SowDetailViewPO from './SowDetailViewPO'
import BindPosition from './BindPosition'
import SettingSelect from 'containers/SettingSelect'

import {routerMap} from 'routes/routers.config'
const Option = Select.Option;
const tableColumns = new Columns(sowDetailTableColumns);
const moreColumns = new Columns(sowDetailMoreTableColumns);
const salaryColumns = new Columns(sowDetailSalaryTableColumns);
const flowBtns=[
  {name:'submit',title:'提交',type:'primary'},
  {name:'fdApprove',title:'批准'},
  {name:'fdRefuse',title:'拒绝',type:'danger'},
  {name:'clientApprove',title:'客户批准'},
  {name:'clientRefuse',title:'客户拒绝',type:'danger'}
]

//汇率字段
const targetRateFiled = {
  [currencyFields.rmb]: currencyFields.fordRateToRMB,
  [currencyFields.usd]: currencyFields.fordRateToUSD
}

// 需要filter的字段
const filterList=['companyId', 'sowLevel', 'fordFunctionId', 'skillLevel', 'officeId', 'location', 'stdPosId', 'teamId','FTE'];


class SowDetail extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      $positions:immutable.List(),
      $sow: immutable.Map(),
      $currency:immutable.List(),
      currency: 'USD',

      //表格栏目显示控制
      hasMore: false,
      hasSalary: false,

      //表格搜索
      filterDropdownVisible: {},
      filtered: {},
      searchText: {},
    }

    // filter search 的默认输入表单
    this.FilterInput=props=>(
      <div className="custom-filter-dropdown">
        <Input
          style={{width:120}}
          ref={ele => this.searchInput = ele}
          placeholder="Search"
          {...props}
        />
        <Button type="primary" size="small" onClick={props.onPressEnter}>Search</Button>
      </div>
    )

    // stdpos 搜索表单
    this.StdposSelect=props=>(
      <div className="custom-filter-dropdown">
        <SettingSelect
          style={{width:120}}
          placeholder="Search"
          showSearch={true}
          onFocus={()=>this.stdposFocus=true}
          onBlur={()=>this.stdposFocus=false}
          optionFilterProp='children'
          dropdownMatchSelectWidth={false}
          titleRender={$item=>`${$item.get('officeId')},${$item.getIn(['team','brief'])},${$item.get('location')[0]},${$item.get('name')}`}
          type={routerMap.setting.stdPoss.path}
          {...props}
        />
        <Button type="primary" size="small" onClick={props.onPressEnter}>Search</Button>
      </div>
    )

    // team 搜索表单
    this.TeamSelect=props=>(
      <div className="custom-filter-dropdown">
        <SettingSelect
          style={{width:120}}
          placeholder="Search"
          showSearch={true}
          onFocus={()=>this.teamFocus=true}
          onBlur={()=>this.teamFocus=false}
          optionFilterProp='children'
          dropdownMatchSelectWidth={false}
          type={routerMap.setting.teams.path}
          {...props}
        />
        <Button type="primary" size="small" onClick={props.onPressEnter}>Search</Button>
      </div>
    )

    this.filterObj={}
    filterList.forEach(key=>{
      this.filterObj[key]=[]
    })
  }
  static propTypes = {
    $transitions: ImmutablePropTypes.list,
    adjustMoneyUSD:PropTypes.number
  }

  componentDidMount() {
    this.fetchSow();
  }
  fetchSow=()=>{
    //页面加载 fetch detail 内容
    fetchSingleSow(this.props.params.id).then(e=>{
      let sow=e.sow;
      let positions=sow.positions;
      delete sow.positions;
      this.$positions=immutable.fromJS(positions);
      this.updateFilterObj()
      this.setState({
        $positions:this.$positions,
        $sow:immutable.fromJS(sow),
        $currency:arrayToImmutableMap()(e.currencys),
        currency:sow.currencyId
      })
    })
  }

  // 更新已有数据的 filter 值
  updateFilterObj=()=>{


    let filterObj={};
    this.$positions && this.$positions.forEach($item=>{
      filterList.forEach(key=>{
        if(!filterObj[key]){
          filterObj[key]={}
        }

        // FTE 规则特殊处理
        let value=$item.get(key);
        if(key==='FTE'){
          value=Math.floor(parseFloat($item.getIn(['sowPosition',key]))*10);
        }
        filterObj[key][value]=value;
      })
    });


    // 筛选字段的值 给到  this.filterObj
    filterList.forEach(key=>{
      if(filterObj[key]){
        this.filterObj[key]=Object.keys(filterObj[key]);
      }
    })
  }
  onCurrencyChange = value=> this.setState({currency: value});
  onCreate=()=>browserHistory.push(`${this.props.location.pathname}/create`)
  onSwitchChange = field=>checked=>this.setState({[field]: checked});
  onFlow=url=>()=>approvalFlow(url+this.state.$sow.get('id')).then(e=>{
    if(e.error){
      message.error(e.error.message)
    }else{
      this.fetchSow()
    }
  });
  checkFlowDisabled=name=>{
    if(this.props.$transitions){
      const btnFlow=this.props.$transitions.find($item=>$item.get('name')===name).get('from');
      const sowStatus=this.state.$sow.get('flowStatus');

      //根据当前状态，以及flow 状态流设置按钮禁用
      if(typeof btnFlow === 'string'){
        return  btnFlow!==sowStatus;
      }else if(immutable.List.isList(btnFlow)){
        return btnFlow.every(status=>status!==this.state.$sow.get('flowStatus'));
      }
    }else{
      return true;
    }
  };

  //表格搜索
  onFilterDropdownVisibleChange=key=>visible=>{

    // stdPosId 在focus 下 不默认关闭
    if(visible===false && (
        (key==='stdPosId' &&  this.stdposFocus===true) ||
        (key==='teamId' &&  this.teamFocus===true)
      )
    )
      {return;}

    this.setState(prevState=>({
      filterDropdownVisible:{...prevState.filterDropdownVisible,[key]:visible}
    }), () =>this.searchInput && this.searchInput.focus());
  }
  onSearchChange = key=>e=>{
    const value=e.target?e.target.value:e
    this.setState(prevState=>{
      return {searchText:{...prevState.searchText,[key]:value}}
    })
  }
  onSearchSubmit =key=>() => {
    const { searchText } = this.state;
    this.setState(prevState=>({
      filterDropdownVisible: {...prevState.filterDropdownVisible,[key]:false},
      filtered: {...prevState.filtered,[key]:!!searchText[key]},
      $positions: this.$positions.filter(($record) => {
        const reg = new RegExp(searchText[key], 'gi');
        return reg.test($record.get(key));
      }),
    }));
  }
  onClearFilter=()=>this.setState({filteredInfo: {},searchText:{},filtered:{}},this.onSearchSubmit())

  tableOnchange=(pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters
    });
  }
  render() {
    const {$sow,$positions,$currency,currency,hasMore,hasSalary,filterDropdownVisible,searchText,filteredInfo={}}=this.state;
    const {location,adjustMoneyUSD} = this.props;

    //面包屑导航
    const showCreate=$sow.get('flowStatus')!==flowStatus.disabled && $sow.get('sowType') !==sowType.letGo;
    const showBind= showCreate &&  $sow.get('sowType') !==sowType.inHouse;
    const breadcrumbTitle={[$sow.get('id')]:$sow.get('name')};
    const RightButton=(
      <span>
        { showCreate &&
          <Button type="primary" size="large" onClick={this.onCreate}>Create</Button>
        }
        { showBind &&
          <BindPosition year={$sow.get('year')} positionList={$positions.map($item=>$item.getIn(['sowPosition','positionId']))} />
        }
      </span>);
    const Breadcrumb=(
      <ContentHeader extra={RightButton} location={location} title={breadcrumbTitle}>
        <span className="header-item">Client: {$sow.get('clientId')}</span>
        <span className="header-item">Year: {$sow.get('year')}</span>
        <span className="header-item">Version: {$sow.get('version')}</span>
        <span className="header-item">Status:
          <span
            className={$sow.get('flowStatus')===flowStatus.disabled?'highlight':''}
          > {$sow.get('flowStatus')}</span>
        </span>
      </ContentHeader>
    );


    //动态设置表格的栏目

    // 筛选的column

    //构建搜索的column
    const buildSearchColumn=key=>{
      let FilterInput=this.FilterInput;
      let formProps={
        value:searchText[key],
        onChange:this.onSearchChange(key),
        onPressEnter:this.onSearchSubmit(key),
      }
      if(key==='stdPosId'){
        FilterInput=this.StdposSelect;
        formProps.filterAction=$listMap=>$listMap.filter($map=>this.filterObj.stdPosId.indexOf($map.get('id'))>-1)
      }
      if(key==='teamId'){
        FilterInput=this.TeamSelect;
        formProps.filterAction=$listMap=>$listMap.filter($map=>this.filterObj.teamId.indexOf($map.get('id'))>-1)
      }
      return {
        filterIcon: <Icon type="search" style={{ color: this.state.filtered[key] ? '#108ee9' : '#aaa' }} />,
        filterDropdown:<FilterInput {...formProps}/>,
        filterDropdownVisible: filterDropdownVisible[key],
        onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange(key)
      }
    };

    tableColumns.updateTable({
      name:{
        render:(text,$record)=>{

          //如果 sow 的状态为 disabled 则无法跳转到 position页面
          return (
            <Tooltip title={$record.get('name')}>
              <div className="over-text"  style={{width:sowDetailColumnsWith.name-17}}>
              {
                $sow.get('flowStatus')===flowStatus.disabled ?
                $record.get('name') :
                (<Link to={`${location.pathname.replace(/\/$/,'')}/${$record.get('id')}`}>
                    {$record.get('name')}
                </Link>)
              }
              </div>
            </Tooltip>
          )
        },
        ...buildSearchColumn('name')
      },
      expectStaffId:buildSearchColumn('expectStaffId'),
      teamId:buildSearchColumn('teamId'),
      titleId:buildSearchColumn('titleId'),
      stdPosId:buildSearchColumn('stdPosId'),
      fordFunctionId:{
        filters: this.filterObj.fordFunctionId.map(key=>({text:key,value:key})),
        filteredValue: filteredInfo.fordFunctionId || null,
        onFilter: (value, $record) => $record.includes(value),
      },
      companyId:{
        filters:  this.filterObj.companyId.map(key=>({text:key,value:key})),
        filteredValue: filteredInfo.companyId || null,
        onFilter: (value, $record) => $record.includes(value),
      },
      sowLevel:{
        filters: this.filterObj.sowLevel.map(key=>({text:key,value:key})),
        filteredValue: filteredInfo.sowLevel || null,
        onFilter: (value, $record) => $record.includes(value),
      },
      FTE:{
        filters: this.filterObj.FTE.map(key=>({text:parseInt(key)/10,value:key})),
        filteredValue: filteredInfo.FTE || null,
        onFilter: (value, $record) => Math.floor(parseFloat($record.getIn(['sowPosition','FTE']))*10)==value
      },
    });

    let columns = tableColumns.table;

    //是否显示 更多栏目
    if (hasMore) {
      moreColumns.updateTable({
        skillLevel:{
          filters: Object.keys(skillLevelFilterObj).map(key=>({text:key,value:key})),
          filteredValue: filteredInfo.skillLevel || null,
          onFilter: (value, $record) => $record.get('skillLevel').includes(value),
        },
        officeId:{
          filters: Object.keys(officeIdFilterObj).map(key=>({text:key,value:key})),
          filteredValue: filteredInfo.officeId || null,
          onFilter: (value, $record) => $record.get('officeId').includes(value),
        },
        location:{
          filters: Object.keys(locationFilterObj).map(key=>({text:key,value:key})),
          filteredValue: filteredInfo.location || null,
          onFilter: (value, $record) => $record.get('location').includes(value),
        },
      })

      // 将more columns 插入到指定的位置
      let index=columns.findIndex(column=>column.dataIndex==='currencyId');
      columns = update(columns,{$splice:[[index,0,...moreColumns.table]]})
    }

    //是否显示 更多栏目
    if (hasSalary) {
      salaryColumns.updateTable()

      // 将salary columns 插入到指定的位置
      let index=columns.findIndex(column=>column.dataIndex==='FTE');
      columns = update(columns,{$splice:[[index,0,...salaryColumns.table]]})
    }

    //获取当年sow 下的 Rate
    const getRate = currencyType=>$currency.getIn([ currencyType, 'currencyDetails', 0, targetRateFiled[currency]]);
    const rate={
      [currencyFields.rmb]: getRate(currencyFields.rmb),
      [currencyFields.usd]: getRate(currencyFields.usd)
    }

    // 生成汇总和转换汇率后的  columns 和 dataSource
    const sowDetailColumnsDataSource=buildSowColumnsDataSource({
      rate,
      targetCurrency:currency,
      columns,
      $dataSource:$positions
    });

    // PO 编辑时的浮动值，美元和人民币
    const adjustMoney={
      [currencyFields.usd]:adjustMoneyUSD,
      [currencyFields.rmb]:fixedNumber(adjustMoneyUSD / rate[currencyFields.rmb])
    }
    return (
      <ContentLayout autoHeight={false} header={Breadcrumb}>
        <div className="flex-box">
          <div className="flex-header sow-header">
            {
              flowBtns.map(item=>(
                <FlowBtn
                  key={item.name}
                  title={item.title}
                  type={item.type}
                  disabled={this.checkFlowDisabled(item.name)}
                  onConfirm={this.onFlow(api.sow[item.name])}
                />
              ))
            }
            <span className="item">
              <Link to={`${location.pathname.replace(/\/$/,'')}/entry-po`}><Button size="small" disabled={this.checkFlowDisabled('collectPO')}>录入PO</Button></Link>
            </span>
            <span className="item">
              <SowDetailViewPO adjustMoney={adjustMoney} id={this.props.params.id} $sow={$sow} />
            </span>
            <span className="item"> Set Currency: <Select value={currency} onChange={this.onCurrencyChange}
                                                          style={{width: 80}}>
                <Option value="RMB">RMB</Option>
                <Option value="USD">USD</Option>
                <Option value="LOCAL">LOCAL</Option>
              </Select>
            </span>
            <span className="item">More Attributes:
              <Switch
                onChange={this.onSwitchChange('hasMore')}
                checked={hasMore}
              />
            </span>
            <span className="item">More Salary:
              <Switch
                onChange={this.onSwitchChange('hasSalary')}
                checked={hasSalary}
              />
            </span>
            <span className="item"><Button size="small" onClick={this.onClearFilter}>Clear filters</Button></span>
          </div>
          <div className="flex-content">
            <ImmutableFixedTable
              titleHeight={110}
              rowClassName={$record=>`row-${$record.get('flowStatus')}`}
              className="table-data"
              onChange={this.tableOnchange}
              {...sowDetailColumnsDataSource}
            />

          </div>
        </div>
      </ContentLayout>

    )
  }
}

export default SowDetail

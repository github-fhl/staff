import React from 'react'
import {Button, Input,Switch, Icon, Select ,Popover ,Collapse ,Modal , message} from 'antd'
import PropTypes from 'prop-types'
import update from 'react/lib/update'
import ImmutablePropTypes from 'react-immutable-proptypes'
import immutable from 'immutable'
import ContentLayout, {ContentHeader} from '../../../components/layouts/ContentLayout.js'
import {ImmutableFixedTable,ImmutableTable} from '../../../components/antd/Table'
import {summaryTableColumns, passThroughTableColumns, levelTableColumns,specialTableColumns,createFormColumns} from '../modules/SowColumns'
import {buildSowColumnsDataSource,createSow} from '../modules/sow'
import Columns from 'common/columns'
import {sowFields, flowStatus, currencyFields} from 'common/config'
import {format} from 'common/format'
import {YearInput} from 'components/column'
import CreateSow from './CreateSow'
import CopySow from './CopySow'
import EditPassThrough from './EditPassThrough'
import moment from 'moment'
import './SowSummary.scss'

const Panel = Collapse.Panel;
const Option = Select.Option;
const tableColumns = new Columns(summaryTableColumns);
const passColumns = new Columns(passThroughTableColumns);
const levelColumns = new Columns(levelTableColumns);
const nonChargeableColumns = new Columns(specialTableColumns);
const createColumns = new Columns(createFormColumns);
const sowYear = parseInt(moment().format('YYYY')) + 1;
const createInitialValue=immutable.Map({year:sowYear,version:'000'}) // sow 表单的初始值

class SowSummary extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      $sow: props.$sow,
      hasIssue: false,
      hasHistory: false,
      hasPass: false,
      hasLevel: false,
      currency: 'USD',

      //表格名称搜索
      filterDropdownVisible: {},
      searchText: {},
      filtered: {},

      //创建
      isCreate:false,
      createLoading:false,

      // 复制
      selectedRowKeys:[]
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
  }
  static propTypes = {
    $sow: ImmutablePropTypes.map.isRequired,
    setTitle: PropTypes.func,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.$sow !== nextProps.$sow) {
      this.setState({$sow: nextProps.$sow})
    }
  }

  componentDidMount() {
    this.props.fetchAllSow();
  }
  onYearChange = value=>this.props.fetchAllSow({year: value});
  onCurrencyChange = value=> this.setState({currency: value});
  onSwitchChange = field=>checked=>{
    this.setState({[field]: checked},()=>{

      //如果显示 pass 或者 leave， column 则将表格的滚动条显示到最右侧,以方便查看对应信息
      if(checked && ['hasPass','hasLevel'].indexOf(field)>-1){
        let scrollDom=document.querySelectorAll('.table-data .ant-table-body');
        if(scrollDom){
          scrollDom[0].scrollLeft=scrollDom[0].scrollWidth;
        }
      }
    })
  };

  //表格名称搜索
  onFilterDropdownVisibleChange=key=>visible=>{
    this.setState(prevState=>({
      filterDropdownVisible:{...prevState.filterDropdownVisible,[key]:visible}
    }), () =>this.searchInput && this.searchInput.focus());
  }
  onSearchChange = key=>e=>{
    const value=e.target?e.target.value:e
    console.log('value',value)
    this.setState(prevState=>{
      return {searchText:{...prevState.searchText,[key]:value}}
    })
  }

  onSearchSubmit =key=>() => {
    const { searchText } = this.state;
    this.setState(prevState=>({
      filterDropdownVisible: {...prevState.filterDropdownVisible,[key]:false},
      filtered: {...prevState.filtered,[key]:!!searchText[key]},
      $sow: this.props.$sow.update(sowFields.soldSows,$dataSource=>
        $dataSource.filter(($record) => {
          const reg = new RegExp(searchText[key], 'gi');
          return reg.test($record.get(key));
        })),
    }));
  }

  //sow 创建
  createCancel=()=>this.setState({isCreate:false})
  onCreate=()=>this.setState({isCreate:true})
  onCreateSave=params=>{

    // 增加 Name 表单规则验证
    const {year,clientId}=params;
    const reg=new RegExp(`^${year} ${clientId}`);
    if(!reg.test(params.name)){
      return message.error(`Name must start with ${year} ${clientId}`)
    }

    this.setState({createLoading:true});
    this.props.createSow(params).then(e=>{
      this.setState({createLoading:false})
      if(!e.error){
        // 创建成功 重置表单和关闭modal
        this.createSowKey=+new Date();
        this.setState({isCreate:false})
      }
    })
  }
  createOk=()=>this.createForm && this.createForm.onSave();
  onCreateValuesChange=values=>{
    if(!this.createForm){return}

    //根据 year 和 clientId 的值改变 Name的值
    const checkField=['year','clientId'];
    const changeField=Object.keys(values)[0];
    if(checkField.indexOf(changeField)>-1){

      //改变后的表单
      const params={...this.createForm.form.getFieldsValue(),...values};
      if(checkField.every(key=>params[key])){

        //所有字段都含有值，则改变 name 字段
        this.createForm.form.setFieldsValue({name:`${params.year} ${params.clientId}`})
      }
    }
  }
  onSelectChange=selectedRowKeys=>this.setState({selectedRowKeys});
  tableOnchange=(pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters
    });
  }
  onClearFilter=()=>this.setState({filteredInfo: {},searchText:{},filtered:{}},this.onSearchSubmit())

  render() {
    const {$sow, hasIssue, hasHistory, hasPass, hasLevel, currency,isCreate,createLoading,selectedRowKeys,filteredInfo={},searchText,filterDropdownVisible}=this.state;
    const {location,editPassThrough}=this.props;

    console.log('state==',this.state)

    //My Issue 和 历史版本筛选
    let $summaryDataSource = $sow.get(sowFields.soldSows);
    let $specialSows = $sow.get(sowFields.specialSows);
    if (!hasHistory && $summaryDataSource) {
      $summaryDataSource = $summaryDataSource.filter($item=>$item.get('flowStatus') !== flowStatus.disabled)
    }
    if (hasIssue && $summaryDataSource) {
      $summaryDataSource = $summaryDataSource.filter($item=>$item.get('flowStatus') === flowStatus.toSubmit)
    }

    let clientIdFilterObj={},
        flowStatusFilterObj={};

    $summaryDataSource && $summaryDataSource.forEach($item=>{
      clientIdFilterObj[$item.get('clientId')]=$item.get('clientId');
      flowStatusFilterObj[$item.get('flowStatus')]=$item.get('flowStatus');
    })
    //动态设置表格的栏目
    const buildSearchColumn=key=>{
      let FilterInput=this.FilterInput;
      let formProps={
        value:searchText[key],
        onChange:this.onSearchChange(key),
        onPressEnter:this.onSearchSubmit(key),
      }
      return {
        filterIcon: <Icon type="search" style={{ color: this.state.filtered[key] ? '#108ee9' : '#aaa' }} />,
        filterDropdown:<FilterInput {...formProps}/>,
        filterDropdownVisible: filterDropdownVisible[key],
        onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange(key)
      }
    };
    tableColumns.updateTable({

      // name column search
      name:buildSearchColumn('name'),
      clientId:{
        filters: Object.keys(clientIdFilterObj).map(key=>({text:key,value:key})),
        filteredValue: filteredInfo.clientId || null,
        onFilter: (value, $record) => $record.includes(value),
      },
      flowStatus:{
        filters: Object.keys(flowStatusFilterObj).map(key=>({text:key,value:key})),
        filteredValue: filteredInfo.flowStatus || null,
        onFilter: (value, $record) => $record.includes(value),
      }
    })
    nonChargeableColumns.updateTable()
    let specialColumns=nonChargeableColumns.table;
    let columns = tableColumns.table;

    //是否显示pass through
    if (hasPass) {
      passColumns.updateTable({
        editPass:{
          render:(text,$record)=><EditPassThrough onSave={editPassThrough} $initialValue={$record} />
        }
      })
      columns = columns.concat(passColumns.table)
    }

    //是否显示 Level
    if (hasLevel) {
      levelColumns.updateTable()

      // level columns 插入到指定的位置
      const columnsIndex=columns.findIndex(column=>column.dataIndex==='FTE');
      columns = update(columns,{$splice:[[columnsIndex,0,...levelColumns.table]]})

      const specialIndex=specialColumns.findIndex(column=>column.dataIndex==='FTE');
      specialColumns = update(specialColumns,{$splice:[[specialIndex,0,...levelColumns.table]]})
    }

    //获取当年sow 下的 Rate
    const rate=(
      ()=>{
        const targetRateFiled = {  //汇率字段
          [currencyFields.rmb]: currencyFields.fordRateToRMB,
          [currencyFields.usd]: currencyFields.fordRateToUSD
        }
        const getRate = currencyType=>$sow.getIn(['currencys', currencyType, 'currencyDetails', 0, targetRateFiled[currency]]);
        return {
          [currencyFields.rmb]: getRate(currencyFields.rmb),
          [currencyFields.usd]: getRate(currencyFields.usd)
        }
      })()

    // 生成汇总和转换汇率后的  columns 和 dataSource
    const summaryColumnsDataSource=buildSowColumnsDataSource({
      targetCurrency:currency,
      $dataSource:$summaryDataSource,
      rate,columns,
    });
    if(summaryColumnsDataSource.dataSource){
      summaryColumnsDataSource.dataSource=summaryColumnsDataSource.dataSource.sortBy($d=>$d.get('name'))
    }
    const specialColumnsDataSource=buildSowColumnsDataSource({
      rate,
      targetCurrency:currency,
      columns:specialColumns,
      $dataSource:$specialSows
    })

    let $selected;
    if(summaryColumnsDataSource.dataSource && selectedRowKeys[0]!==undefined){
      $selected=summaryColumnsDataSource.dataSource.valueSeq().toArray()[selectedRowKeys[0]];
    }
    return (
      <ContentLayout autoHeight={false} header={
        <ContentHeader
          extra={(
            <div>
              <Button type="primary" onClick={this.onCreate}>Create</Button>
              <CopySow target={$selected} copyCommitSow={this.props.copyCommitSow} />
            </div>
          )}
          location={location}
        />}
      >
        <div className="flex-box">
          <div className="flex-header sow-header">
            <span className="item">Year: <YearInput defaultValue={sowYear} onChange={this.onYearChange}/></span>
            <span className="item"> Set Currency: <Select value={currency} onChange={this.onCurrencyChange}
                                                          style={{width: 80}}>
                <Option value="RMB">RMB</Option>
                <Option value="USD">USD</Option>
                <Option value="LOCAL">LOCAL</Option>
              </Select>
            </span>
            <span className="item">My Issue:
              <Switch
                onChange={this.onSwitchChange('hasIssue')}
                checked={hasIssue}
              />
            </span>
            <span className="item">历史版本:
              <Switch
                onChange={this.onSwitchChange('hasHistory')}
                checked={hasHistory}
              />
            </span>
            <span className="item">Pass Through:
              <Switch
                onChange={this.onSwitchChange('hasPass')}
                checked={hasPass}
              />
            </span>
            <span className="item">Level:
              <Switch
                onChange={this.onSwitchChange('hasLevel')}
                checked={hasLevel}
              />
            </span>
            <span className="item"><Popover content={(
                <table className="popover-table">
                  <tbody>
                  <tr>
                    <td className="title">year</td>
                    <td className="amount">{$sow.getIn([sowFields.sowLevel,'year'])}</td>
                  </tr>
                  <tr>
                    <td className="title">currency</td>
                    <td className="amount">{$sow.getIn([sowFields.sowLevel,'currencyId'])}</td>
                  </tr>
                  {
                    $sow.get(sowFields.sowLevel) && $sow.get(sowFields.sowLevel).filter(($,key)=>key.includes('Max')).map((value,key)=>{
                      return (
                        <tr key={key}>
                          <td className="title">{key}</td>
                          <td className="amount">{format.money(value)}</td>
                        </tr>
                      )

                    }).valueSeq()
                  }
                  </tbody>
                </table>
            )}><span className="has-popover">Level 金额</span></Popover></span>
            <span className="item"><Button size="small" onClick={this.onClearFilter}>Clear filters</Button></span>
          </div>
          <div className="flex-content">

            <ImmutableFixedTable
              titleHeight={110}
              rowClassName={$record=>`row-${$record.get('flowStatus')}`}
              className="table-data"
              rowSelection={{type:'radio',selectedRowKeys,onChange: this.onSelectChange,}}
              onChange={this.tableOnchange}
              {...summaryColumnsDataSource}
            />
            <Collapse bordered={false} className='bottom-panel'>
              <Panel header="Non-Chargeable SoW"  className='bottom-panel-item'>
                <ImmutableTable
                  className="table-data"
                  {...specialColumnsDataSource}
                />
              </Panel>
            </Collapse>


            <Modal title="Create SoW" visible={isCreate} width={1096}
                   confirmLoading={createLoading}
                   onOk={this.createOk}
                   onCancel={this.createCancel}
            >
              <CreateSow
                onValuesChange={this.onCreateValuesChange}
                columns={createColumns.form}
                ref={f=>this.createForm=f}
                onSave={this.onCreateSave} $initialValue={createInitialValue}
                key={`Create SoW ${this.createSowKey}`}
              />
            </Modal>
          </div>
        </div>
      </ContentLayout>

    )
  }
}

export default SowSummary

import React from 'react'
import {Table} from 'antd'
import Immutable from 'immutable'
import  PropTypes  from 'prop-types'
import {debounce} from 'utils'
import './Table.scss'

export const SmallTable = props=><Table rowKey={(r, i)=>i} className='table-default' bordered={true} size="small"
                                        pagination={false} {...props} />


export class ImmutableTable extends React.PureComponent {
  static defaultProps = {
    dataSource: []
  }
  componentWillMount() {
    this.columns = this.transformColumns(this.props.columns);
    this.transformDataSource(this.props.dataSource)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.columns !== this.props.columns) {
      this.columns = this.transformColumns(nextProps.columns)
    }
    if (nextProps.dataSource !== this.props.dataSource) {
      this.transformDataSource(nextProps.dataSource)
    }
  }

  //转换 columns
  transformColumns = columns=>columns.map(column=> {

    //访问value值的路径
    const path=column.path?column.path.concat(column.dataIndex):[column.dataIndex];

    if (!column.render) {

      //如果 没有 render 则添加获取值的render
      column.render = (value, record, index)=>record.getIn(path);
    } else if(column.type==='money'){

      //如果是货币类型的则重写 render
      const oldRender=column.render;
      column.render = (value, record, index)=>oldRender(record.getIn(path),record,index);
    }
    return column;
  })

  //转换 dataSource
  transformDataSource = dataSource=> {
    if (Immutable.Map.isMap(dataSource) || Immutable.List.isList(dataSource)) {
      this.dataSource = dataSource.valueSeq().toArray()
    } else {
      this.dataSource = dataSource
    }
  }

  render() {
    return <SmallTable {...this.props} columns={this.columns} dataSource={this.dataSource}/>
  }
}

ImmutableTable.propTypes = {
  dataSource: PropTypes.any.isRequired,
  columns: PropTypes.array.isRequired,
  fixTitle: PropTypes.bool,
}



/**
 * 用于列表页面一屏自动延伸表格展示
 * .fixed-table 为position:absolute;width:100%;height:100%;
 * **/
export class ImmutableFixedTable extends React.PureComponent {
  static defaultProps = {
    titleHeight: 50
  }
  static propTypes = {
    titleHeight: PropTypes.number
  }
  constructor(props){
    super(props)
    this.columns=props.columns;
    this.isClearFixed=false; // 用来check 是否清楚掉固定column的标记；用来更新强制更新表格；
  }
  componentWillMount(){
    this.updateScrollColumns(this.props)
  }
  componentWillReceiveProps(nextProps){
    const {columns}=nextProps
    if(columns!==this.props.columns){
      this.updateScrollColumns(nextProps)
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.setHeightWidthResize, false)
    this.updateScrollColumns(this.props);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setHeightWidthResize, false)
  }

  // 根据页面宽度和column 自动更新
  updateScrollColumns=(props)=>{
    this.setHeight();
    const initialWidth=this.props.rowSelection?32:0; // 如果有表格前缀多选项 则宽度增加 32（选项宽度）；
    const width = props.columns.reduce((value, curr)=>value + curr.width, initialWidth);
    this.scroll = {y: this.height, x:width};
    this.columns=this.checkTableFixed(props.columns,width)
  }
  setHeight = ()=> {
    if (this.wrap) {
      this.height = this.wrap.clientHeight - this.props.titleHeight; // 去掉title 的高度
    }else{
      this.height = 500;  // 默认表格高度500
    }
  }
  setHeightWidthResize = debounce(()=> {
    this.setHeight()
    this.forceUpdate()
  }, 200)

  checkTableFixed=(columns,x)=>{

    // 获取table的宽度
    let dom=document.querySelectorAll('.table-data .ant-table-header .ant-table-fixed');

    // 如果表格没有滚动条则清除 fixed 属性
    this.isClearFixed=false;
    if(dom[0] && dom[0].clientWidth > x){
      return columns.map(column=>{
        if(column.fixed){
          this.isClearFixed=true;
          return {...column,fixed:false};
        }
        return column;
      })
    }

    // 如果表格有滚动条则保留fixed
    return columns
  }
  render() {
    console.log('this.isClearFixed=',this.isClearFixed)
    return (
      <div className="fixed-table" ref={e=>this.wrap = e}>
        <ImmutableTable {...this.props} key={`fixed-table${this.isClearFixed}`} columns={this.columns} scroll={this.scroll}/>
      </div>
    )
  }

}
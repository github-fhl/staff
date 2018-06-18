import React from 'react'
import {Tooltip} from 'antd'
import Immutable from 'immutable'
import {columnsDate,columnDefalut} from './columns.data'
import {format} from 'common/format'
import {columnWidth} from 'common/config'

/**
 * Columns 栏目对象 用于 antd 表格或 form。
 * @constructor
 * @param {string} dataIndex - 字段名称.
 * @param {string} title - 字段名称对应的Title.
 * @param {string} hideIn - 'form' | 'table' 该字段在form或者table中隐藏.
 * @param {string} type - 字段对应值的类型
 * @param {number} width - 字段宽度
 * @param {bool}   showTitleTip - 默认为false
 *
 *
 * @param {string} match -  include | equal 搜索字段的columns，用于数据匹配的方式
 *
 */

class Columns {
  static columnsDate = Immutable.fromJS(columnsDate);
  static columnDefalut = Immutable.fromJS(columnDefalut);
  constructor(columns=[]){
    this.columns=columns
  }
  get form(){

    //获取表单 columns
    if(!this.formData){
      this.updateForm()
    }
    return this.formData;
  }

  updateForm=(newColumn={})=>{
    this.formData=this.columns.map(
      column=>{
        if(column.hideIn==='form'){return}
        if(!Columns.columnsDate.get(column.dataIndex)){console.log('找不到默认columns=',column.dataIndex)}
        return Columns.columnDefalut.merge(Columns.columnsDate.get(column.dataIndex),column,newColumn[column.dataIndex])
      }
    ).filter(e=>e)
    return this.formData
  }

  get table(){

    //获取table columns
    if(!this.tableData){
      this.updateTable()
    }
    return this.tableData;
  }
  updateTable=(newColumn={})=>{
    this.tableData=this.columns.map(
      column=>{
        if(column.hideIn==='table'){return}
        const defaultProps=Columns.columnsDate.get(column.dataIndex);

        //如果在columns 找不到 当前的columns 则在面板中输出
        if(!defaultProps){
          console.log('找不到默认columns=',column.dataIndex)
        }

        //合并columns属性
        let mergeColumns=Columns.columnDefalut.merge(defaultProps,column,newColumn[column.dataIndex]);

        //设置默认width
        if(mergeColumns.get("width")===undefined){
          mergeColumns= mergeColumns.set('width',100)
        }

        //设置title dom
        if( typeof mergeColumns.get("title")==='string'){
            const style={maxWidth:mergeColumns.get("width")-17}  //去掉th的padding
            mergeColumns= mergeColumns.update('title',title=>{
              const titleDom=<div className="table-title" style={style}>{title}</div>;
              if(mergeColumns.get("showTitleTip")===true){
               return(
                 <Tooltip title={title}>
                   {titleDom}
                </Tooltip>
               )
              }
              return titleDom
            }
          )
        }

        //如果column 类型是数字类型
        if(mergeColumns.get('type')==='number'){
          mergeColumns=mergeColumns.update('className',e=>`${e?e+' ':''}number`);
        }else if(mergeColumns.get('type')==='money'){

          //如果column 类型是货币
          mergeColumns=mergeColumns.update('className',e=>`${e?e+' ':''}money`);

          //设置货币格式化render
          if(!mergeColumns.get('render')){
            mergeColumns=mergeColumns.set('render',value=>format.money(value))
          }

          // 设置金额默认宽度
          mergeColumns=mergeColumns.update('width',w=>w>columnWidth.money?w:columnWidth.money);

        }else if(mergeColumns.get('type')==='percent'){

          //如果column 类型是百分比
          mergeColumns=mergeColumns.update('className',e=>`${e?e+' ':''}percent`);
          if(!mergeColumns.get('render')){
            mergeColumns=mergeColumns.set('render',value=>format.percent(value))
          }
        }
        return mergeColumns.toJS()
      }
    ).filter(e=>e)
    return this.tableData
  }
}

export  default Columns
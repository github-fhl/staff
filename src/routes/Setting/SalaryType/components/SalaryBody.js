import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Button,Icon} from 'antd'
import ContentLayout, {ContentHeader} from 'components/layouts/ContentLayout.js'
import Immutable from 'immutable'
import {ImmutableFixedTable} from 'components/antd/Table'
import {searchInclude} from 'HOC/search'
import {salaryTypeTableColumns} from '../modules/salaryType'
import Columns from 'common/columns'
import {updateSalaryTypesIndex} from '../../modules/setting'

const SearchTable = searchInclude(ImmutableFixedTable);
const tableColumns = new Columns(salaryTypeTableColumns);

export class SalaryBody extends React.PureComponent {

  componentWillMount() {
    tableColumns.updateTable({
      index: {
        render: (t, $record, index)=> {
          return (
            <div className="index-box">
              <span className="index-num"> {$record.get('index')}</span>
              <Icon type="up-square"
                    className={$record.get('index')===1?'disabled':''}
                    onClick={()=>this.props.dispatch(updateSalaryTypesIndex({
                      type: 'up',
                      id: $record.get('id'),
                      index: $record.get('index'),
                    }))}/>
              <Icon type="down-square"
                    className={$record.get('index')===this.props.dataSourceSize?'disabled':''}
                    onClick={()=>this.props.dispatch(updateSalaryTypesIndex({
                      type: 'down',
                      id: $record.get('id'),
                      index: $record.get('index')
                    }))}/>
            </div>);
        }
      }
    })
  }
  render() {
    const {location, onCreate, ...props}=this.props;
    return (
      <ContentLayout
        autoHeight={false}
        header={
          <ContentHeader
            extra={<Button type="primary" size="large" onClick={onCreate}>Create</Button>}
            location={location}
          />}
      >
        <SearchTable className="table-data" {...props} columns={tableColumns.table}/>
      </ContentLayout>
    )
  }
}


SalaryBody.defaultProps = {
  dataSource: Immutable.Map()
}
SalaryBody.propTypes = {
  dataSourceSize: PropTypes.number.isRequired,
  searchColumns: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  onCreate: PropTypes.func.isRequired,
  dataSource: ImmutablePropTypes.map
}
export default SalaryBody
import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Button} from 'antd'
import ContentLayout,{ContentHeader} from '../../../components/layouts/ContentLayout.js'
import Immutable from 'immutable'
import {ImmutableFixedTable} from '../../../components/antd/Table'
import {searchInclude} from '../../../HOC/search'
const SearchTable=searchInclude(ImmutableFixedTable);


export const SettingBody = ({location,onCreate,...props}) => (
<ContentLayout
  autoHeight={false}
  header={
    <ContentHeader
      extra={<Button type="primary" size="large" onClick={onCreate}>Create</Button>}
      location={location}
    />}
>
  <SearchTable className="table-data" {...props} />
</ContentLayout>
)

SettingBody.defaultProps={
    dataSource:Immutable.Map()
}
SettingBody.propTypes={
    searchColumns:    PropTypes.array.isRequired,
    columns:          PropTypes.array.isRequired,
    location:         PropTypes.object.isRequired,
    onCreate:         PropTypes.func.isRequired,
    dataSource:       ImmutablePropTypes.map
}
export default SettingBody
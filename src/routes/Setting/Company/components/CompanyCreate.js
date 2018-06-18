import React from 'react'
import Create from '../../components/Create'
import Columns from 'common/columns'
import {companyFormColumns} from '../modules/company'

// 公司表单的 column
const formColumns=new Columns(companyFormColumns);

export default props=><Create columns={formColumns.form} {...props} />
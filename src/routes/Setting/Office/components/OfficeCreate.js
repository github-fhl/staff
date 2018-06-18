import React from 'react'
import Create from '../../components/Create'
import Columns from 'common/columns'
import {officeFormColumns} from '../modules/office'

// 公司表单的 column
const formColumns=new Columns(officeFormColumns);

export default props=><Create columns={formColumns.form} {...props} />
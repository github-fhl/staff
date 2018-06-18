import React from 'react'
import Create from '../../components/Create'
import Columns from 'common/columns'
import {salaryTypeFormColumns} from '../modules/salaryType'

// SalaryType表单的 column
const formColumns=new Columns(salaryTypeFormColumns);

export default props=><Create columns={formColumns.form} {...props} />
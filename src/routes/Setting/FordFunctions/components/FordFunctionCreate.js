import React from 'react'
import Create from '../../components/Create'
import Columns from 'common/columns'
import {fordFunctionFormColumns} from '../modules/fordFunction'

// FordFunction表单的 column
const formColumns=new Columns(fordFunctionFormColumns);

export default props=><Create columns={formColumns.form} {...props} />
import React from 'react'
import Create from '../../components/Create'
import Columns from 'common/columns'
import {clientsFormColumns} from '../modules/clients'

// 表单的 column
const formColumns=new Columns(clientsFormColumns);

export default props=><Create columns={formColumns.form} {...props} />
import React from 'react'
import Create from '../../components/Create'
import Columns from 'common/columns'
import {currencyFormColumns} from '../modules/currency'

// Currency表单的 column
const formColumns=new Columns(currencyFormColumns);

export default props=><Create columns={formColumns.form} {...props} />
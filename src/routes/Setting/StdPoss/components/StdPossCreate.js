import React from 'react'
import Create from '../../components/Create'
import Columns from 'common/columns'
import {stdPosFormColumns} from '../modules/stdPoss'

// StdPos表单的 column
const formColumns=new Columns(stdPosFormColumns);

export default props=><Create columns={formColumns.form} {...props} />
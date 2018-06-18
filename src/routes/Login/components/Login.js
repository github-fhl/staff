import React from 'react'
import  PropTypes  from 'prop-types'
import { Form, Input, Button, Row, Col,message ,Icon} from 'antd'
import { browserHistory } from 'react-router'
import './login.scss'

const FormItem = Form.Item
export const Login = (props) => {
  console.log('page',props)
  const { getFieldDecorator } = props.form
  const baseLeft = 0
  const baseRight = 24
  const formItemLayout = {
    labelCol: { span: baseLeft },
    wrapperCol: { span: baseRight }
  }
  return (
    <Row type='flex' justify='center' align='middle' className='login'>
      <Col className='login-wrap'>
        <Form onSubmit={e => {
          e.preventDefault()
          props.form.validateFields((err, values) => {
            if (!err) {

              //请求登录接口
              props.login(values).then(e=>{
                if(!e.error){
                  browserHistory.push(props.location.query.next || '/')
                }
              });
            }
          })
        }}>
          <h1>Staff Admin</h1>
          <FormItem {...formItemLayout}>
            { getFieldDecorator('id', {
              initialValue:'developer', // admin
              rules: [{ required: true, message: 'Missing username' }]
            })(<Input prefix={<Icon type="user" style={{ fontSize: 14 }} />} placeholder="Username" />) }
          </FormItem>
          <FormItem {...formItemLayout}>
            { getFieldDecorator('password', {
              initialValue:'123',
              rules: [{ required: true,  message: 'Missing password' }]
            })(<Input prefix={<Icon type="lock" style={{ fontSize: 14 }} />} type="password" placeholder="Password" />) }
          </FormItem>
          <Row>
            <Col offset={baseLeft} span={baseRight}>
              <Button type='primary' htmlType='submit' size='large' className='login-button'>Login</Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>

  )
}

Login.propTypes = {
  form: PropTypes.object.isRequired,
}

export default Form.create()(Login)

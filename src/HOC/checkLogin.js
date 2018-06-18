import React from 'react';
import {connect} from 'react-redux';
import {Spin} from 'antd';
import {getUserInfo} from '../routes/Login/modules/login'
import {fetchArguments} from '../store/arguments'
import {fetchAllSetting} from '../routes/Setting/modules/setting'
import { browserHistory } from 'react-router'

let hasFetchSetting=false;

//判断用户是否登录的组件
//用户登录成功后自动加载 setting数据
export function checkLogin(Component) {
  class AuthenticatedComponent extends React.PureComponent{
    state={
      loading:true
    }
    componentWillMount(){
      this.check(this.props)
    }
    componentDidMount(){
      //获取后台系统参数
      this.props.dispatch(fetchArguments())
    }
    componentWillReceiveProps(props){
      this.check(props)
    }
    check=props=>{
      if(props.user){
        if(props.user.get('id')){
          this.hasAuth=true;
        }else{
          browserHistory.push(`/login?next=${props.location.pathname}`)
        }
      }else{

        //获取用户信息
        props.dispatch(getUserInfo()).then(e=>{
          if(e.error){
            this.hasAuth=false;
            browserHistory.push(`/login?next=${props.location.pathname}`)
          }
        })
      }
    }
    render(){
      if(this.hasAuth && !hasFetchSetting){
        hasFetchSetting=true;
        this.props.dispatch(fetchAllSetting()).then(e=>{
          this.setState({loading:false})
        })
      }
      return this.hasAuth?<Spin tip="Loading resources..." spinning={this.props.hasSetting?false:this.state.loading} size="large"><Component {...this.props} /></Spin>:null
    }
  }
  const mapStateToProps = (state) => ({
    user: state.user,
    hasSetting:state.setting.size>0
  });
  return connect(mapStateToProps)(AuthenticatedComponent);
}
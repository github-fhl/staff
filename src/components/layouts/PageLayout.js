import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import MainNav from './MainNav'
import SubNav from './SubNav'
import './PageLayout.scss'
import { Layout, Icon ,message } from 'antd'
import {navList} from 'routes/routers.config'

const { Content, Sider } = Layout;
const collapsed = localStorage.getItem('collapsed') === 'true';
const subCollapsed = localStorage.getItem('subCollapsed') === 'true';
const mainNavPathReg=/(^\/)+|\/.*/g;
const subNavPathReg=/(^\/?\w*\/)+|\/.*/g;

class PageLayout extends React.Component {
  state = {
    collapsed: collapsed,
    mode: collapsed ? 'vertical' : 'inline',
    subCollapsed: subCollapsed,
    subMode: subCollapsed ? 'vertical' : 'inline',
    navList
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.$user !== this.props.user){
      this.updateNavList(nextProps)
    }
  }
  componentWillMount(){
    this.updateNavList(this.props)
  }
  updateNavList(props){

    //check 导航的中的权限在用户权限中存在，如有则显示导航
    const checkRole=nav=>{
      if(props.$user){

        if(nav.role && Array.isArray(nav.role)){
          let hasScope=props.$user.get('roles').some(role=>nav.role.indexOf(role.get('id'))>-1);
          if(!hasScope){
            nav.show=hasScope
          }
        }

        // 权限系统为上线，临时设置显示所有导航
        nav.show=true;

        //检查子导航的权限
        if(nav.children && Array.isArray(nav.children)){
          nav.children=nav.children.map(checkRole)
        }
      }


      return nav;
    }

    // 用户权限来匹配导航权限，确认是否显示该导航
    this.setState(prevState=>({
      navList:prevState.navList.map(checkRole)
    }))
  }
  mainNavToggle = () => {
    let nowState = !this.state.collapsed
    localStorage.setItem('collapsed', nowState)
    this.setState({
      collapsed: nowState,
      mode:nowState ? 'vertical' : 'inline'
    })
  }
  navOnClick=e=>{
    if(e.key==='login'){
      this.props.logout().then(result=>{
        if(result.error){
          message.error(result.error.message)
        }
      })
    }else{
      this.props.pathJump('/'+e.key)
    }
  }
  subNavToggle = () => {
    let nowState = !this.state.subCollapsed;
    localStorage.setItem('subCollapsed', nowState)
    this.setState({
      subCollapsed: nowState,
      subMode:nowState ? 'vertical' : 'inline'
    })
  }
  subNavOnClick=mainKey=>e=>this.props.pathJump(`/${mainKey}/${e.key}`)
  render () {
    const mainSelectedKey=this.props.location.pathname.replace(mainNavPathReg,'');
    const mainSelectNav=this.state.navList.find(nav=>nav.key===mainSelectedKey) || {};

    return (
      <Layout className='layout-main'>

        {/* 主导航 */}
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          trigger={null}
          width="180"
          collapsedWidth="50"
          className='side-main'
        >
          <Icon
            className='trigger'
            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.mainNavToggle}
          />
          <MainNav
            mode={this.state.mode}
            navList={this.state.navList}
            selectedKeys={[mainSelectedKey]}
            onClick={this.navOnClick}
          />
        </Sider>

        {/* 子导航 */}
        {
          mainSelectNav.children &&

          <Sider
            collapsible
            collapsed={this.state.subCollapsed}
            trigger={null}
            width="180"
            collapsedWidth="0"
            className='side-sub'
          >
            <Icon
              className='trigger'
              type={this.state.subCollapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.subNavToggle}
            />
            <SubNav
              title={mainSelectNav.name}
              mode={this.state.subMode}
              navList={mainSelectNav.children}
              selectedKeys={[this.props.location.pathname.replace(subNavPathReg,'')]}
              onClick={this.subNavOnClick(mainSelectedKey)}
            />
          </Sider>
        }
        <Layout>
          <Content className='content'>
            <div className='content-wrap'>
              {this.props.children}
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

PageLayout.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
  pathJump: PropTypes.func.isRequired,
  $user:    ImmutablePropTypes.map,
}

export default PageLayout

import React from 'react';
import {Link} from 'react-router'
import {Breadcrumb} from 'antd'
import PropTypes from 'prop-types';
import './ContentLayout.scss'

// autoHeight  是否固定内容区域的高度为一屏，还是自动延伸

//主内容区布局
const ContentLayout = ({header, footer, children, autoHeight = true})=>(
  <div className="layout-fix">
    {   header &&
    <div className="layout-fix-header">
      {header}
    </div>
    }
    <div className={`layout-fix-content${autoHeight ? '' : ' layout-fix-height'}`}>
      {children}
    </div>
    {   footer &&
    <div className="layout-fix-footer">
      {footer}
    </div>
    }
  </div>)


ContentLayout.propTypes = {
  fixHeight: PropTypes.bool,
  header: PropTypes.element,
  footer: PropTypes.element,
  children: PropTypes.any.isRequired
}

export default ContentLayout;

//主内容区头部
export const ContentHeader = ({extra, location,title={},children})=> {

  const pathSnippets = location.pathname.split('/').filter(i => i && i.toLowerCase()!=='home' );
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    let text=title[_] || decodeURI(_);
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>
          {text}
        </Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    (
      <Breadcrumb.Item key="home">
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);

  return (
    <div className="page-header">
      <h2 className="pull-left">
        <Breadcrumb>
          {breadcrumbItems}
        </Breadcrumb>
        {children}
      </h2>
      <div className="pull-right">{extra}</div>
    </div>
  )
}

ContentHeader.propTypes = {
  title: PropTypes.object,
  location: PropTypes.object,
  extra: PropTypes.element,
}


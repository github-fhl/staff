import React from 'react'
import { Menu, Icon ,Badge } from 'antd'
import  PropTypes  from 'prop-types'

const Side=({mode,selectedKeys,navList,onClick})=>(
  <Menu
    theme='dark'
    mode={mode}
    selectedKeys={selectedKeys}
    onClick={onClick}
  >
    {
      navList.map(item => (
        <Menu.Item
          key={item.key}
          style={{display:item.show?'block':'none'}}
        >
          <Badge className="nav-badge">
            <Icon type={item.icon} />
            <span className='nav-text'>{item.name}</span>
          </Badge>
        </Menu.Item>
      ))
    }
    <Menu className="divider" />
    <Menu.Item key='login'>
            <span>
              <Icon type='poweroff' />
              <span className='nav-text'>Logout</span>
            </span>
    </Menu.Item>
  </Menu>
);

Side.propTypes = {
  mode:           PropTypes.string.isRequired,
  onClick:        PropTypes.func.isRequired,
  selectedKeys:   PropTypes.array
}
export default Side


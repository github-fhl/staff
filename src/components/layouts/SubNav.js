import React from 'react'
import { Menu, Icon ,Badge } from 'antd'
import  PropTypes  from 'prop-types'

const Side=({mode,selectedKeys,navList,title,onClick})=>(
  <div>
    <h2 className="sub-nav-title">{title}</h2>
    <Menu
      theme='light'
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
              <span className='nav-text'>{item.name}</span>
            </Badge>
          </Menu.Item>
        ))
      }
    </Menu>
  </div>
);

Side.propTypes = {
  title:          PropTypes.string,
  mode:           PropTypes.string.isRequired,
  onClick:        PropTypes.func.isRequired,
  selectedKeys:   PropTypes.array
}
export default Side


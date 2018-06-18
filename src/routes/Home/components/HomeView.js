import React from 'react'
import {Link} from 'react-router'
import {Button,Card,Tag} from 'antd'
import ContentLayout,{ContentHeader} from 'components/layouts/ContentLayout.js'
import {navList,routerMap} from 'routes/routers.config'
import './HomeView.scss'

export const HomeView = ({location}) => (
<ContentLayout
  header={<ContentHeader location={location} />}
  footer={<Button>Save</Button>}
>
   <h3 style={{marginTop:20}}>Welcome to Staff Admin!</h3>
    <Card title="已完成部分" className="home-card">
      <div>
        <strong>Sow:</strong>
        <Link to={`/sow`}> SoW</Link>
      </div>
      <div>
        <strong>Setting:</strong>
        {
          navList.find(nav=>nav.key==='setting').children.map(router=>{
            return <span className="home-link" key={router.key}><Link to={`/setting/${router.key}`}>{router.name}</Link></span>
          })
        }
      </div>
    </Card>
</ContentLayout>
)

export default HomeView

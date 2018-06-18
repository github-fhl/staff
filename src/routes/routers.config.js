//网站路径
export const routerMap={
  home:{
    title:'Home',
    path:'home'
  },
  sow:{
    title:'SoW Summary',
    path:'sow'
  },
  setting:{
    title:'Setting',
    path:'setting',
    company:{
      title:'Companys',
      path:'companys',
      create:{
        title:'Create',
        path:'create'
      }
    },
    clients:{
      title:'Clients',
      path:'clients',
      create:{
        title:'Create',
        path:'create'
      }
    },
    currency:{
      title:'Currency',
      path:'currency',
      create:{
        title:'Create',
        path:'create'
      }
    },
    fordFunctions:{
      title:'Ford Functions',
      path:'fordFunctions',
      create:{
        title:'Create',
        path:'create'
      }
    },
    offices:{
      title:'Offices',
      path:'offices',
      create:{
        title:'Create',
        path:'create'
      }
    },
    salaryTypes:{
      title:'SalaryTypes',
      path:'salaryTypes',
      create:{
        title:'Create',
        path:'create'
      }
    },
    stdPoss:{
      title:'Standard Position',
      path:'stdPoss',
      create:{
        title:'Create',
        path:'create'
      }
    },
    teams:{
      path:'teams'
    }
  }
}

// 页面导航
export const navList=[
  { key: 'home',
    name: 'Home',
    icon: 'home',
    role:['finance','chief','maintainer','hr','admin'],
    show:true
  },
  { key: 'sow',
    name: 'SoW',
    icon: 'appstore-o',
    role:['finance','chief','maintainer','hr','admin'],
    show:true
  },
  { key: 'setting',
    name: 'Setting',
    icon: 'setting',
    role:['finance','chief','maintainer','hr','admin'],
    show:true,
    children:[
      {
        key: routerMap.setting.company.path,
        name: routerMap.setting.company.title,
        role:['finance','chief','maintainer','hr','admin'],
        show:true
      },
      {
        key: routerMap.setting.clients.path,
        name: routerMap.setting.clients.title,
        show:true
      },
      {
        key: routerMap.setting.offices.path,
        name: routerMap.setting.offices.title,
        show:true
      },
      {
        key: routerMap.setting.fordFunctions.path,
        name: routerMap.setting.fordFunctions.title,
        show:true
      },
      {
        key: routerMap.setting.stdPoss.path,
        name: routerMap.setting.stdPoss.title,
        show:true
      },
      {
        key: routerMap.setting.salaryTypes.path,
        name: routerMap.setting.salaryTypes.title,
        show:true
      },
      {
        key: routerMap.setting.currency.path,
        name: routerMap.setting.currency.title,
        show:true
      }
    ]
  }
]
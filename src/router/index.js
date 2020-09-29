import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },
  {
    path: '/common',
    component: Layout,
    redirect: '/notice',
    hidden: true,
    children: [{
      path: 'notice',
      name: '系统通知',
      component: () => import('@/views/common/notice/index'),
      meta: { title: '系统通知', icon: 'dashboard' }
    }]
  }

]

export const asyncRoutes = [
  // 项目管理
  {
    path: '/qc',
    name: '项目管理',
    component: Layout,
    alwaysShow: true,
    redirect: '/qc/project',
    meta: {
      title: '项目管理',
      icon: 'all-fill',
      roles: ['root', 'project_manager']
    },
    children: [
      {
        path: 'code',
        component: () => import('@/views/qc/project/code/index.vue'),
        name: '令号',
        redirect: '/qc/code/list',
        meta: { icon: 'nested', roles: ['root', 'project_manager_code'] },
        children: [
          {
            path: 'list',
            component: () => import('@/views/qc/project/code/list'),
            name: '令号管理',
            meta: { title: '令号管理' }
          }
        ]
      },
      {
        path: 'project',
        component: () => import('@/views/qc/project/project/treenode/index'),
        name: '项目管理',
        meta: { title: '项目管理', icon: 'nested' }

      },

      {

        path: 'almmanage',
        alwaysShow: true,
        component: () => import('@/views/qc/project/almmanage/index.vue'),
        name: 'almmanage',
        redirect: '/qc/almmanage/codecheck',
        meta: { icon: 'sysnc', title: 'ALM同步管理', roles: ['root', 'project_manager_alm'] },
        children: [
          {
            path: 'codecheck',
            component: () => import('@/views/qc/project/almmanage/codecheck/index'),
            name: 'Codecheck',
            meta: {
              icon: 'sysnc',
              title: '令号签收'

            }

          },
          {
            path: 'projectcheck',
            component: () => import('@/views/qc/project/almmanage/projectcheck/index'),
            name: 'Projectcheck',
            meta: {
              icon: 'sysnc',
              title: '项目审批'

            }

          },
          {
            path: 'almconfig',
            component: () => import('@/views/qc/project/almmanage/components/almconfig.vue'),
            name: 'Almconfig',
            meta: {
              icon: 'sysnc',
              title: '配置管理'

            }
          },
          {
            path: 'compensate',
            component: () => import('@/views/qc/project/almmanage/components/compensate.vue'),
            name: 'Compensate',
            meta: {
              icon: 'sysnc',
              title: '数据补偿'

            }
          },
          {
            path: 'changealm',
            component: () => import('@/views/qc/project/almmanage/components/changealm.vue'),
            name: 'Changealm',
            meta: {
              icon: 'sysnc',
              title: '映射变更'

            }
          }
        ]
      }

    ]
  },

  // 文档中心
  {
    path: '/document',
    name: '文档中心',
    component: Layout,
    alwaysShow: true,
    redirect: '/document/template',
    meta: {
      title: '文档中心',
      icon: 'logs',
      roles: ['root', 'document_manager']
    },
    children: [
      {
        // 令号管理侧边栏只显示令号列表，所以第二层路由和第三层路由显示的是同样的名称
        path: 'template',
        name: 'documentTemplate',
        component: () => import('@/views/qc/documentCenter/template'),
        meta: { icon: 'template', title: '文档模板' }

      },
      {
        path: 'generator',
        component: () => import('@/views/qc/documentCenter/generator'),

        redirect: '/codecenter/vulnerabilitydetection/list',
        meta: { icon: 'xiangmu', roles: ['root', 'document_manager_generate'] },
        children: [
          {
            path: 'list',
            component: () => import('@/views/qc/documentCenter/generator/list'),
            name: '文档生成',
            meta: { title: '文档生成' }
          }
        ]
      }
    ]
  },

  // 知识图谱
  {
    path: '/knowledge',
    name: 'knowledge',
    component: Layout,
    redirect: '/knowledge/knowledgeGraph',
    meta: {
      title: '知识工程',
      icon: 'logs'
    },
    children: [
      {
        path: 'knowledgeGraph',
        name: 'knowledgeGraph',
        component: () => import('@/views/qc/knowledge/knowledgeGraph'),
        meta: { title: '知识图谱', icon: 'user-add' }
      }
    ]

  },

  {
    path: '/quality',
    name: 'quality',
    component: Layout,
    redirect: '/quality/configuration',
    meta: {
      title: '质量中心',
      icon: 'logs'
    },
    alwaysShow: true,
    children: [
      {
        path: 'configuration',
        name: 'configuration',
        component: () => import('@/views/qc/quality/configuration'),
        meta: { title: '模型管理', icon: 'ok' },
        alwaysShow: true,
        children: [
          {
            path: 'configuration',
            name: 'configuration',
            component: () => import('@/views/qc/quality/configuration/indexDefinition'),
            meta: { title: '指标定义', icon: 'ok' }
          },
          {
            path: 'modelBuilding',
            name: 'modelBuilding',
            component: () => import('@/views/qc/quality/configuration/modelBuilding'),
            meta: { title: '模型构建', icon: 'ok' }
          }
        ]
      }
    ]

  },

  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/user',
    name: '权限管理',
    meta: { title: '权限管理', icon: 'user', roles: ['root', 'permission_manager'] },
    alwaysShow: true,
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/permission/user/index'),
        meta: { title: '用户管理', icon: 'user-add', roles: ['root', 'permission_manager_user'] }
      },

      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/permission/role/index'),
        meta: { title: '角色管理', icon: 'role', roles: ['root', 'permission_manager_role'] }
      },

      {
        path: 'menu',
        name: '菜单管理',
        component: () => import('@/views/permission/menu/index'),
        meta: { title: '菜单管理', icon: 'nested', roles: ['root', 'permission_manager_menu'] }
      }
    ]
  },
  {
    path: '/sysmanage',
    component: Layout,
    redirect: '/sysmanage/log',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'example', roles: ['root', 'sys_manager'] },
    alwaysShow: true,
    children: [

      {
        path: 'log',
        name: '日志管理',
        component: () => import('@/views/sysmanage/log/index'),
        meta: { title: '日志管理', icon: 'log', roles: ['root', 'sys_manager_log'] }
      },
      {
        path: 'param',
        name: '参数设置',
        component: () => import('@/views/sysmanage/param/index'),
        meta: { title: '参数设置', icon: 'param', roles: ['root', 'sys_manager_param'] }

      },
      {
        path: 'dic',
        name: '字典管理',
        component: () => import('@/views/sysmanage/dic/index'),
        meta: { title: '字典管理', icon: 'dic', roles: ['root', 'sys_manager_dic'] }

      },
      {
        path: 'dicvalue',
        name: '字典数据',
        component: () => import('@/views/sysmanage/dic/dicvalue/index'),
        hidden: true,
        meta: { title: '字典数据', icon: 'log' }

      },

      {
        path: 'http://127.0.0.1:8084/xxl-job-admin',
        meta: { title: '任务中心', icon: 'task', roles: ['root', 'sys_manager_task'] }
      },

      {
        path: 'kingdom',
        component: () => import('@/views/sysmanage/kingdom/index.vue'),
        name: '领域管理',
        meta: {
          title: '领域管理',
          icon: 'ok',
          roles: ['root', 'sys_manager_kingdom']
        }
      },
      {
        path: 'processmanage',
        name: '流程管理',
        component: () => import('@/views/sysmanage/activiti/index'),
        meta: { title: '流程管理', icon: 'flow', roles: ['root', 'process_manage'] },
        children: [

          {
            path: 'modelmanagement',
            component: () => import('@/views/sysmanage/activiti/modelManage/index.vue'),
            name: '模型管理',
            meta: {
              title: '模型管理',
              icon: 'ok',
              roles: ['root', 'process_manager_model']
            }
          },

          {
            path: 'processgroup',
            component: () => import('@/views/sysmanage/activiti/processGroup/index.vue'),
            name: '流程用户组',
            meta: {
              title: '流程用户组',
              icon: 'ok',
              roles: ['root', 'process_manager_group']
            }
          },

          {
            path: 'processinfo',
            component: () => import('@/views/sysmanage/activiti/processInfo/index.vue'),
            name: '流程信息',
            meta: {
              title: '流程信息',
              icon: 'ok',
              roles: ['root', 'process_manager_info']
            }
          }
        ]
      }
    ]
  },

  {
    path: '/sysmonitor',
    component: Layout,
    alwaysShow: true,
    redirect: '/sysmonitor/servicemonitor',
    name: '系统监控',
    meta: { title: '系统监控', icon: 'monitor', roles: ['sys_monitor'] },
    children: [
      {
        path: 'servicemonitor',
        name: '服务监控',
        component: () => import('@/views/monitor/servicemonitor/index'),
        meta: { title: '服务监控', icon: 'monitors', roles: ['sys_monitor_service'] }
      },
      {
        path: 'linktracking',
        name: '链路追踪',
        component: () => import('@/views/monitor/linktracking'),
        meta: { title: '链路追踪', icon: 'link', roles: ['sys_monitor_tracking'] }
      }
    ]
  },
  {
    path: '/developer',
    component: Layout,
    alwaysShow: true,
    redirect: '/developer/api',
    name: '开发者',
    meta: { title: '开发者', icon: 'partner', roles: ['developer'] },
    children: [
      {
        path: 'api',
        name: 'API文档',
        component: () => import('@/views/developer/api/index'),
        meta: { title: 'API文档', icon: 'dic', roles: ['developer_api'] }
      },

      {
        path: 'index',
        component: () => import('@/views/developer/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon_tool', noCache: true, roles: ['root', 'developer_icons'] }
      }

    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

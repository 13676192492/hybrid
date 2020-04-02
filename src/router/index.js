import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App'

Vue.use(VueRouter)

const routes = [{
    path: '/propertyPay',
    meta: {
      title: '物业缴费'
    },
    redirect: '/propertyPay/index',
    component: App,
    children: [{
        path: '/propertyPay/index',
        name: 'index',
        // redirect:'/index',
        meta: {
          title: '物业缴费'
        },
        component: () => import('@/views/propertyPay/index')
      },
      {
        path: '/propertyPay/details',
        name: 'details',
        // redirect:'/index',
        meta: {
          title: '账单详情'
        },
        component: () => import('@/views/propertyPay/details')
      },
      {
        path: '/propertyPay/detailed',
        name: 'detailed',
        // redirect:'/index',
        meta: {
          title: '账单明细'
        },
        component: () => import('@/views/propertyPay/detailed')
      },
      {
        path: '/propertyPay/success',
        name: 'success',
        // redirect:'/index',
        meta: {
          title: '支付成功'
        },
        component: () => import('@/views/propertyPay/success')
      },
      {
        path: '/propertyPay/lateFee',
        name: 'success',
        // redirect:'/index',
        meta: {
          title: '滞纳金'
        },
        component: () => import('@/views/propertyPay/lateFee')
      }
    ]
  },
  {
    path: '/complaintSuggestion',
    meta: {
      title: '投诉建议'
    },
    redirect: '/complaintSuggestion/index',
    component: App,
    children: [{
        path: '/complaintSuggestion/index',
        name: 'index',
        // redirect:'/index',
        meta: {
          title: '投诉建议'
        },
        component: () => import('@/views/complaintSuggestion/index')
      },
      {
        path: '/complaintSuggestion/details',
        name: 'index',
        // redirect:'/index',
        meta: {
          title: '详情'
        },
        component: () => import('@/views/complaintSuggestion/details')
      }
    ]
  },
  {
    path: '/evaluate',
    name: 'index',
    // component: App,
    meta: {
      title: '评价'
    },
    component: () => import('@/components/Evaluate')
  },
  {
    path: '/notice',
    redirect: '/notice/index',
    component: App,
    children: [{
        path: '/notice/index',
        name: 'index',
        // redirect:'/index',
        meta: {
          title: '通知公告'
        },
        component: () => import('@/views/notice/index')
      },
      {
        path: '/notice/details',
        name: 'index',
        // redirect:'/index',
        meta: {
          title: '详情'
        },
        component: () => import('@/views/notice/details')
      }
    ]
  },
  {
    path: '/quickRepair',
    redirect: '/quickRepair/index',
    component: App,
    children: [{
        path: '/quickRepair/index',
        name: 'index',
        // redirect:'/index',
        meta: {
          title: '快速报修'
        },
        component: () => import('@/views/quickRepair/index')
      },
      {
        path: '/quickRepair/details',
        name: 'index',
        // redirect:'/index',
        meta: {
          title: '报修详情'
        },
        component: () => import('@/views/quickRepair/details')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})


router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  if (route.meta.title) {
    document.title = route.meta.title;
    // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      const hackIframe = document.createElement('iframe');
      hackIframe.style.display = 'none';
      hackIframe.src = '/static/html/fixIosTitle.html?r=' + Math.random();
      document.body.appendChild(hackIframe);
      setTimeout(_ => {
        document.body.removeChild(hackIframe)
      }, 300)
    }
  }
});


export default router
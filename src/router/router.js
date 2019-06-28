import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '后台管理 '
    },
    component: () => import('@/components/login/login.vue')
};
// export const page404 = {
//     path: '/*',
//     name: 'error-404',
//     meta: {
//         title: '404-页面不存在'
//     },
//     component: () => import('@/views/error-page/404.vue')
// };

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/components/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: { i18n: 'home' }, name: 'home_index', component: () => import('@/components/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace', component: () => import('@/components/own-space/own-space.vue') },
        { path: 'change-pass', title: '修改密码', name: 'change_pass', component: () => import('@/components/change-pass/change-pass.vue') },
        { path: 'test', title: '富文本测试', name: 'test', component: () => import('@/views/sys/test/Test.vue') },
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/components/message/message.vue') },
        { path: 'message-send-detail', title: '消息发送详情', name: 'message_send_detail', component: () => import('@/views/sys/message/messageSendDetail.vue') }
    ]
};
export const appRouter = [];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    // page404,
    page403
];

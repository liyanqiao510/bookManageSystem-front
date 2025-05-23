import { defineConfig } from '@umijs/max';

export default defineConfig(
  
  {
    proxy: {
      '/api': {  // 代理前缀（根据后端接口路径调整）
        target: 'http://localhost:8081',  // 后端服务地址
        changeOrigin: true,               // 允许跨域
        pathRewrite: { '^/api': '' },     // 重写路径（可选）
      },},
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '图书管理系统',
  },
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
 
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: '用户管理',
      path: '/table',
      component: './Table',
      access: 'canSeeAdmin'
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      layout: false,
    },
  ],
  npmClient: 'pnpm',
});


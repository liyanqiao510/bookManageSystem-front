import { defineConfig } from '@umijs/max';

export default defineConfig(
  {
    proxy: {
      '/api': {  // 代理前缀（根据后端接口路径调整）
        target: 'http://localhost:8081',  // 后端服务地址
        changeOrigin: true,               // 允许跨域
        pathRewrite: { '^/api': '' },     // 重写路径（可选）
      },},
  esbuildMinifyIIFE: true,//打包时对 IIFE（立即调用的函数表达式） 格式的代码进行压缩优化
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/', // 生产环境用相对路径，开发环境用根路径

  // publicPath: './', // 文件路径, 生产使用相对路径
  runtimePublicPath: false,

  hash: true, // 可选：生成带哈希的文件名，避免缓存问题[1](@ref)[10](@ref)
   // 解决空白页关键配置
  history: { type: 'hash' }, 
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
      redirect: '/book',
    },
 
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: '用户管理',
      path: '/userManage',
      component: './UserManage',
      access: 'canSeeAdmin'
    },
    {
      name: '查看图书',
      path: '/book',
      component: './Book' 
    },
    {
      name: '图书类型管理',
      path: '/bookTypeManage',
      component: './BookTypeManage' 
    },
    {
      name: '借阅信息管理',
      path: '/borrowManage',
      component: './BorrowManage' 
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


// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate

import type { RequestConfig } from '@umijs/max'; // 新增类型导入 

import { history } from '@umijs/max';
import {jwtDecode} from 'jwt-decode';

import {  message  } from 'antd';

import services from '@/services/demo';
const { userLogout } =
  services.UserController;

//登录信息展示
export async function getInitialState(): Promise<{ name: string }> {
  const token = localStorage.getItem('token');
  // 若 token 不存在，直接返回空状态
  if (!token) return { name: '未登录用户', user_info: null };
  
  try {
    const decoded = jwtDecode(token);
    return { name: decoded.sub, user_info: decoded };
  } catch (error) {
    localStorage.removeItem('token'); 
    return { name: '未登录用户', user_info: null }; // 显式返回空状态
  }
}

export const layout = () => {
  
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },  
    //退出登录操作
    logout: async() => { 
      const response = await userLogout();
      if (response.code === 200  ) {
 
        localStorage.removeItem('token');
        console.log('退出成功');
        message.success('退出成功');
        // window.location.reload(); // 强制刷新页面
        // window.location.href = '/login?t=' + Date.now(); // 添加时间戳避免缓存
        history.push('/login');
    

      }else{ 
        console.log('退出失败');
        message.error('退出失败');
      }

    },
  };
};

// src/app.ts
export const request: RequestConfig = {
  timeout: 10000,
// src/app.ts
requestInterceptors: [
  (url, options) => {
    const token = localStorage.getItem('token');
    options.headers = { 
      ...options.headers, // 保留已有 headers
      Authorization: `Bearer ${token}`
    };
    return { url, options };
  }
], 
responseInterceptors: [ 
  (response) => { 
    if ( response?.data?.code === 401) { // 正确获取状态码
      localStorage.removeItem('token');
      console.log('验证失败，重新登录');
      history.push('/login'); 
    }
    return response;
  }

   
]

};

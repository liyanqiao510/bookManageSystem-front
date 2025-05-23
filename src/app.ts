// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate

import type { RequestConfig } from '@umijs/max'; // 新增类型导入 
import axios from 'axios';

import { history } from '@umijs/max';
import { jwtDecode } from 'jwt-decode';

import { message } from 'antd';

import services from '@/services/demo';
import { request as umiRequest } from '@umijs/max'; // 假设使用 umi 的 request
const { userLogout, refreshToken } =
  services.UserController;


//登录信息展示
export async function getInitialState(): Promise<{ name: string }> {

  const token = localStorage.getItem('token');
  // 若 token 不存在，直接返回空状态
  if (!token) return { name: '未登录用户', user_info: {}, role: '1' };

  try {

    const decoded = jwtDecode(token);
    return { name: decoded.sub, user_info: decoded, role: decoded.role };
  } catch (error) {
    localStorage.removeItem('token');
    return { name: '未登录用户', user_info: {},  role: '1' }; // 显式返回空状态
  }
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    //退出登录操作
    logout: async () => {
      const response = await userLogout();
      if (response.code === 20000) {

        localStorage.removeItem('token'); 
        message.success('退出成功');
 
        history.push('/login');
        // window.location.reload(); // 强制刷新页面 

      } else { 
        message.error('退出失败');
      }

    },
  };
};

export const request: RequestConfig = {

  timeout: 10000,
  withCredentials: true,  // 跨域携带Cookie

  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem('token');
      if (token && !url.includes('/refresh')) {
        options.headers = {
          ...options.headers, // 保留已有 headers
          Authorization: `Bearer ${token}`
        };
      }

      return { url, options };
    }
  ],
  responseInterceptors: [

    async (response) => {
      

      if (response?.data?.code === 401) {
        try {

          //刷新token的请求
          const response2 = await refreshToken();

          //更新token缓存
          if (response2?.code === 20000) {
            localStorage.removeItem('token')
            localStorage.setItem('token', response2?.data?.token);

          }else{
            message.error('请重新登录23');
            history.push('/login');
            return response;
          }
 
          // 重试原请求 
          //response.config 包含了原有请求的配置信息，如 URL、方法、头信息等。
          const retryConfig = response.config; 

          if (!retryConfig.headers) {
            retryConfig.headers = {};
          }
          retryConfig.headers.Authorization = `Bearer ${response2?.data?.token}`;

          const response3 = await umiRequest(retryConfig.url!, { ...retryConfig });
   
          //使用umi框架的结构返回, 才能正常返回重发的请求结果给组件
          return {...response,data: response3};

        } catch (error) {
          message.error('请重新登录');
          history.push('/login');
          return response;
        }
      }
 
      return response;

    },



  ]

};

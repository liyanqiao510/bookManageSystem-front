 
import { request } from '@umijs/max';
 

//登录
export async function userLogin(
  body?: API.UserInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_UserInfo_>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

//刷新登录状态
export async function refreshToken( 
  options?: { [key: string]: any },
) {
  return request<API.Result_UserInfo_>('/user/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true ,
     
    ...(options || {}),
  });
}

//退出登录
export async function userLogout(
  body?: API.UserInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_UserInfo_>('/user/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
 
export async function queryUserList(
  params: { 
    keyword?: string; 
    current?: number; 
    pageSize?: number;
    pageNum?: number;

    id?: string; 
    name?: string; 
    userName?: string;
    password?: string;
    role?: string;
    isLocked?: boolean;
    phone?: string;
    email?: string;
    birthday?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_PageInfo_UserInfo__>('/user/getList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
 
export async function addUser(
  body?: API.UserInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_UserInfo_>('/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
 
export async function getUserDetail(
  params: { 
    userId?: string;
  },
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return request<API.Result_UserInfo_>(`/v1/user/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
 
export async function modifyUser(
  params: { 
    id?: string;
  },
  body?: API.UserInfoVO,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<API.Result_UserInfo_>(`/user/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
 
export async function deleteUser(
  params: { 
    ids?: string;
  },
  options?: { [key: string]: any },
) {
  const { ids: param0 } = params;
  return request<API.Result_string_>(`/user/delete/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

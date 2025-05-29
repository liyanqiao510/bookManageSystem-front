
import { request } from '@umijs/max';

export async function queryBookTypeList(
  params: { 
    keyword?: string; 
    current?: number; 
    pageSize?: number;
    pageNum?: number;

    id?: string;  
    typeName?: string;
     
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_PageInfo_BookTypeInfo__>('/api/bookType/getList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
 
export async function addBookType(
  body?: API.BookTypeInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_BookTypeInfo_>('/api/bookType/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
 
export async function getBookTypeDetail(
  params: { 
    bookTypeId?: string;
  },
  options?: { [key: string]: any },
) {
  const { bookTypeId: param0 } = params;
  return request<API.Result_BookTypeInfo_>(`/api/v1/bookType/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
 
export async function modifyBookType(
  params: { 
    id?: string;
  },
  body?: API.BookTypeInfoVO,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<API.Result_BookTypeInfo_>(`/api/bookType/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
 
export async function deleteBookType(
  params: { 
    ids?: string;
  },
  options?: { [key: string]: any },
) {
  const { ids: param0 } = params;
  return request<API.Result_string_>(`/api/bookType/delete/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}


import { request } from '@umijs/max';

export async function queryBorrowList(
  params: { 
    keyword?: string; 
    current?: number; 
    pageSize?: number;
    pageNum?: number;

    id?: string;  
    userName?: string;  
    bookName?: string; 
     
  },
  options?: { [key: string]: any },
) {
  
  return request<API.Result_PageInfo_BorrowInfo__>('/borrow/getList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
 
export async function addBorrow(
  body?: API.BorrowInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_BorrowInfo_>('/borrow/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
 
 
export async function modifyBorrow(
  params: { 
    id?: string;
  },
  body?: API.BorrowInfoVO,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<API.Result_BorrowInfo_>(`/borrow/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
 
export async function deleteBorrow(
  params: { 
    ids?: string;
  },
  options?: { [key: string]: any },
) {
  const { ids: param0 } = params;
  return request<API.Result_string_>(`/borrow/delete/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}


import { request } from '@umijs/max';

export async function queryBookList(
  params: { 
    keyword?: string; 
    current?: number; 
    pageSize?: number;
    pageNum?: number;

    id?: string;  
    bookName?: string;
    bookAuthor?: string;
    bookTypeId?: number;
    isBorrowed?: boolean;
     
  },
  options?: { [key: string]: any },
) {
  return request<API.Result_PageInfo_BookInfo__>('/book/getList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryBookTypeList(
  
  options?: { [key: string]: any },
) {
  return request<API.Result_PageInfo_BookInfo__>('/bookType/getAll', {
    method: 'GET',
    params: { 
    },
    ...(options || {}),
  });
}
 
export async function addBook(
  body?: API.BookInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_BookInfo_>('/book/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function readBook(
  body?: API.BookInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_BookInfo_>('/book/readBook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

 
export async function modifyBook(
  params: { 
    id?: string;
  },
  body?: API.BookInfoVO,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<API.Result_BookInfo_>(`/book/update/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
 
export async function deleteBook(
  params: { 
    ids?: string;
  },
  options?: { [key: string]: any },
) {
  const { ids: param0 } = params;
  return request<API.Result_string_>(`/book/delete/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

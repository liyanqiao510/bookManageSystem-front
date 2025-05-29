/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace API {
  interface PageInfo {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<Record<string, any>>;
  }

  interface PageInfo_UserInfo_ {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<UserInfo>;
  }

  interface Result {
    success?: boolean;
    errorMessage?: string;
    data?: Record<string, any>;
  }

  interface Result_PageInfo_UserInfo__ {
    success?: boolean;
    errorMessage?: string;
    data?: PageInfo_UserInfo_;
  }

  interface Result_UserInfo_ {
    success?: boolean;
    errorMessage?: string;

    data?: UserInfo;
    code?: number;
    message?: string;
  }

  interface Result_string_ {
    success?: boolean;
    errorMessage?: string;

    data?: UserInfo;
    code?: number;
    message?: string;
  }

  type UserGenderEnum = 'MALE' | 'FEMALE';

  interface UserInfo {
    id?: string; 
   
    name?: string; 
    userName?: string;
    password?: string;
    role?: string;
    isLocked?: boolean;
    phone?: string;
    email?: string;
    birthday?: string;

    token?: string;
  }

  interface UserInfoVO {
    name?: string; 
    userName?: string;
    password?: string;
    role?: string;
    isLocked?: boolean;
    phone?: string;
    email?: string;
    birthday?: string;
  }

  interface BookTypeInfo {
    id?: string; 
   
    typeName?: string; 
    typeDesc?: string;
   
  }

  type definitions_0 = null;
}

import { useModel } from '@umijs/max';
import access from '@/access';
import type { ReactNode } from 'react';

export default ({ children, canSeeRole }: {
    children: ReactNode;
    canSeeRole?: 'Admin' | 'Reader';
}) => {
    const { initialState } = useModel('@@initialState');
    const { canSeeAdmin, canSeeReader } = access(initialState);

    if(canSeeRole === 'Admin'){
        return canSeeAdmin? children : null;
    }else if(canSeeRole === 'Reader'){
        return canSeeReader? children : null;
    }else if(canSeeRole === undefined){
        return canSeeAdmin || canSeeReader? children : null;
    }else{
        return null;
    }

};
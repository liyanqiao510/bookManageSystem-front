import { useModel } from '@umijs/max';
import access from '@/access';
import type { ReactNode } from 'react';

export default ({ children }: {
    children: ReactNode;
}) => {
    const { initialState } = useModel('@@initialState');
    const { canSeeAdmin } = access(initialState);

    return canSeeAdmin ? children : null;
};
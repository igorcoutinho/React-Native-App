import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { IUser } from '../../states/User/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const UsersListQuery = 'UsersListQuery';

export const useUsersListQuery = ({
    enabled = false,
}: {
    enabled?: boolean;
} = {}) => {
    const unsubscribe = React.useRef<any>(null);
    React.useEffect(() => {
        return () => {
            unsubscribe?.current?.();
        };
    }, []);
    return useQuery({
        enabled,
        queryFn: async () => {
            const collection = FirebaseFirestore()
                .collection('Users')
                .orderBy('displayName', 'asc')
            try {

                const result = await collection.get();
                return result.docs.map(d => ({
                    ...d.data(),
                    uid: d.id,
                })) as IUser[];
            } catch (error: Error | any) {
                CustomLogger({
                    componentStack: 'useUsersListQuery',
                    error: error,
                    message: 'Failed when recovery users list query',
                });
                throw error;
            }
        },
        queryKey: [UsersListQuery],
    });
};



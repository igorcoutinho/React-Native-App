import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { setAPIUrl } from '../../constants';
import { CustomLogger } from '../../utils/CustomLogger';

export const useAuthenticate3DSMutation = ({
  onError,
  onSuccess,
  sessionId,
  userId,
}: {
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  sessionId: string;
  userId: string;
}) => {
  return useMutation({
    mutationFn: async ({
      result,
    }: {
      result: 'SUCCESS' | 'FAIL' | 'ERROR' | 'TIMEOUT';
    }) => {
      try {
        if (!userId || !sessionId) throw new Error('Invalid 3DS Authentication Session.');
        const response = await axios.post(`${setAPIUrl('enfuceAuthenticateCallback')}/${userId}/${sessionId}`, {
          result,
        });
        console.log(response);
        return response.data;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useAuthenticate3DSMutation',
          error: error,
          message: 'Error captured in ErrorBoundary',
        });

        throw error;
      }
    },
    onError,
    onSuccess,
  });
};

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useFetchSvaps = () => {
  const axios = useAxios();
  return useQuery(['svaps'], async () => {
    const response = await axios.get('svaps', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  });
};

export {
  useFetchSvaps,
};

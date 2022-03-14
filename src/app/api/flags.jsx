import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchFlags = () => {
  const axios = useAxios();
  return useQuery(['feature-flags'], async () => {
    const response = await axios.get('feature-flags');
    return response.data;
  });
};

export default useFetchFlags;

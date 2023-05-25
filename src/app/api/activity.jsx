import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchActivity = ({ id, isEnabled }) => {
  const axios = useAxios();
  return useQuery(['activity', id], async () => {
    const response = await axios.get(`activity/${id}`);
    return response.data;
  }, {
    enabled: isEnabled && !!id,
  });
};

export {
  useFetchActivity, // eslint-disable-line import/prefer-default-export
};

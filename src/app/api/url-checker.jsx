import { useMutation } from 'react-query';

import { useAxios } from './axios';

const usePostUrlChecker = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('urls', data));
};

export default usePostUrlChecker;

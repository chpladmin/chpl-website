import { useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchComplaintsDownload = ({ isAuthenticated, isDownloading }) => {
  const axios = useAxios();
  return useQuery(['complaints/download-all'], async () => {
    const response = await axios.get('complaints/download-all');
    return response.data;
  }, {
    ...options.oneTime,
    enabled: isAuthenticated && isDownloading,
  });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export {
  useFetchComplaintsDownload,
};

import { useMutation, useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchAnnual = () => {
  const axios = useAxios();
  return useQuery(['annual'], async () => {
    const response = await axios.get('surveillance-report/annual');
    return response.data;
  });
};

const useFetchQuarters = () => {
  const axios = useAxios();
  return useQuery(['quarters'], async () => {
    const response = await axios.get('data/quarters');
    return response.data;
  }, options.daily);
};

const useFetchQuarterly = () => {
  const axios = useAxios();
  return useQuery(['quarterly'], async () => {
    const response = await axios.get('surveillance-report/quarterly');
    return response.data;
  });
};

const useFetchRelevantListings = ({ id }) => {
  const axios = useAxios();
  return useQuery(['relevant-listings', id], async () => {
    const response = await axios.get(`surveillance-report/quarterly/${id}/listings`);
    return response.data;
  });
};

const usePostAnnualReportRequest = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post(`surveillance-report/export/annual/${data.id}`, {}));
};

const usePostQuarterReportRequest = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post(`surveillance-report/export/quarter/${data.id}`, {}));
};

export {
  useFetchAnnual,
  useFetchQuarters,
  useFetchQuarterly,
  useFetchRelevantListings,
  usePostAnnualReportRequest,
  usePostQuarterReportRequest,
};

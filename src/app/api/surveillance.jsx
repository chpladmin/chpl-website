import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAxios } from './axios';
import options from './options';

const useDeleteAnnual = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`surveillance-report/annual/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['annual']);
    },
  });
};

const useDeleteQuarterly = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`surveillance-report/quarterly/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['quarterly']);
    },
  });
};

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

const usePostInitiateAnnualReport = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('surveillance-report/annual', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['annual']);
    },
  });
};

const usePostInitiateQuarterlyReport = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('surveillance-report/quarterly', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['quarterly']);
    },
  });
};

const usePostQuarterlyReportRequest = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post(`surveillance-report/export/quarterly/${data.id}`, {}));
};

const usePutAnnual = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('surveillance-report/annual', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['annual']);
    },
  });
};

const usePutQuarterly = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('surveillance-report/quarterly', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['quarterly']);
    },
  });
};

export {
  useDeleteAnnual,
  useDeleteQuarterly,
  useFetchAnnual,
  useFetchQuarters,
  useFetchQuarterly,
  useFetchRelevantListings,
  usePostAnnualReportRequest,
  usePostInitiateAnnualReport,
  usePostInitiateQuarterlyReport,
  usePostQuarterlyReportRequest,
  usePutAnnual,
  usePutQuarterly,
};

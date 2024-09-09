import { useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchActivity = ({
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['activity/search', {
    orderBy, pageNumber, pageSize, sortDescending, query,
  }], async () => {
    const response = await axios.get(`activity/search?${query}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

const useFetchActivityData = () => {
  const axios = useAxios();
  return useQuery(['activity/concepts'], async () => {
    const response = await axios.get('activity/concepts');
    return response.data;
  }, options.daily);
};

const useFetchQuestionableActivityData = () => {
  const axios = useAxios();
  return useQuery(['questionable-activity/trigger-types'], async () => {
    const response = await axios.get('questionable-activity/trigger-types');
    return response.data;
  }, options.daily);
};

const useFetchQuestionableActivity = ({
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['questionable-activity/search', {
    orderBy, pageNumber, pageSize, sortDescending, query,
  }], async () => {
    const response = await axios.get(`questionable-activity/search?${query}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

export {
  useFetchActivity,
  useFetchActivityData,
  useFetchQuestionableActivityData,
  useFetchQuestionableActivity,
};

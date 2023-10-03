import { useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchCertificationStatuses = () => {
  const axios = useAxios();
  return useQuery(['data/certification_statuses'], async () => {
    const response = await axios.get('data/certification_statuses');
    return response.data;
  }, options.daily);
};

const useFetchClassificationTypes = () => {
  const axios = useAxios();
  return useQuery(['data/classification_types'], async () => {
    const response = await axios.get('data/classification_types');
    return response.data;
  }, options.daily);
};

const useFetchComplainantTypes = () => {
  const axios = useAxios();
  return useQuery(['data/complainant-types'], async () => {
    const response = await axios.get('data/complainant-types');
    return response.data;
  }, options.daily);
};

const useFetchCqms = () => {
  const axios = useAxios();
  return useQuery(['data/search-options'], async () => {
    const response = await axios.get('data/search-options');
    return response.data.cqms;
  }, options.daily);
};

const useFetchCriteria = () => {
  const axios = useAxios();
  return useQuery(['data/certification-criteria'], async () => {
    const response = await axios.get('data/certification-criteria');
    return response.data;
  }, options.daily);
};

const useFetchPracticeTypes = () => {
  const axios = useAxios();
  return useQuery(['data/practice_types'], async () => {
    const response = await axios.get('data/practice_types');
    return response.data;
  }, options.daily);
};

export {
  useFetchCertificationStatuses,
  useFetchClassificationTypes,
  useFetchComplainantTypes,
  useFetchCqms,
  useFetchCriteria,
  useFetchPracticeTypes,
};

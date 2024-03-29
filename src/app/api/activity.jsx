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

const useFetchStandardsActivity = ({ isEnabled }) => {
  const axios = useAxios();
  return useQuery(['activity/metadata/standards'], async () => {
    const response = await axios.get('activity/metadata/standards');
    return response.data;
  }, {
    enabled: isEnabled,
  });
};

const useFetchSvapsActivity = ({ isEnabled }) => {
  const axios = useAxios();
  return useQuery(['activity/metadata/svaps'], async () => {
    const response = await axios.get('activity/metadata/svaps');
    return response.data;
  }, {
    enabled: isEnabled,
  });
};

export {
  useFetchActivity,
  useFetchStandardsActivity,
  useFetchSvapsActivity,
};

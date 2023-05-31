import { useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchAcbs = (editable = false) => {
  const axios = useAxios();
  return useQuery(['acbs', editable], async () => {
    const response = await axios.get(`acbs?editable=${editable ? 'true' : 'false'}`);
    return response.data;
  }, options.daily);
};

const useFetchUsersAtAcb = ({ id }) => {
  const axios = useAxios();
  return useQuery(['acbs', id], async () => {
    const response = await axios.get(`acbs/${id}/users`);
    return response.data;
  }, {
    enabled: !!id,
  });
};

export {
  useFetchAcbs,
  useFetchUsersAtAcb,
};

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

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchAcbs };

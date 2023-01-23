import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchIcsFamilyData = ({ id }) => {
  const axios = useAxios();
  return useQuery(['listing/ics-relationships', id], async () => {
    if (id) {
      const response = await axios.get(`certified_products/${id}/ics-relationships`);
      return response.data;
    }
    return {};
  }, {
    keepPreviousData: true,
  });
};

export {
  useFetchIcsFamilyData, // eslint-disable-line import/prefer-default-export
};

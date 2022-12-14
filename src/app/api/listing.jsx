import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchIcsFamilyData = ({ id }) => {
  const axios = useAxios();
  return useQuery(['listing/ics-relationships', id], async () => {
    if (id) {
      const response = await axios.get(`certified_products/${id}/ics_relationships`); // todo: change to "-", not "_"
      return response.data;
    }
    return {};
  }, {
    keepPreviousData: true,
  });
};

export {
  useFetchIcsFamilyData,
};

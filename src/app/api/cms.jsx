import { useMutation } from 'react-query';

import { useAxios } from './axios';

const usePostReportRequest = () => {
  const axios = useAxios();
  return useMutation(async () => axios.post('certification_ids/report-request', {}));
};

export {
  usePostReportRequest, // eslint-disable-line import/prefer-default-export
};

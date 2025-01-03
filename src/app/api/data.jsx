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

const useFetchComplaintTypes = () => {
  const axios = useAxios();
  return useQuery(['data/complaint-types'], async () => {
    const response = await axios.get('data/complaint-types');
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

const useFetchMeasureTypes = () => {
  const axios = useAxios();
  return useQuery(['data/measure-types'], async () => {
    const response = await axios.get('data/measure-types');
    return response.data;
  }, options.daily);
};

const useFetchMeasures = () => {
  const axios = useAxios();
  return useQuery(['data/measures'], async () => {
    const response = await axios.get('data/measures');
    return response.data;
  }, options.daily);
};

const useFetchNonconformityTypes = () => {
  const axios = useAxios();
  return useQuery(['data/nonconformity-types'], async () => {
    const response = await axios.get('data/nonconformity-types/v2');
    return response.data.data;
  }, options.daily);
};

const useFetchPracticeTypes = () => {
  const axios = useAxios();
  return useQuery(['data/practice_types'], async () => {
    const response = await axios.get('data/practice_types');
    return response.data;
  }, options.daily);
};

const useFetchRequirementGroupTypes = () => {
  const axios = useAxios();
  return useQuery(['data/requirement-group-types'], async () => {
    const response = await axios.get('data/requirement-group-types');
    return response.data.data;
  }, options.daily);
};

const useFetchRequirementTypes = () => {
  const axios = useAxios();
  return useQuery(['data/requirement-types'], async () => {
    const response = await axios.get('data/requirement-types');
    return response.data.data;
  }, options.daily);
};

const useFetchSurveillanceResultTypes = () => {
  const axios = useAxios();
  return useQuery(['data/surveillance_result_types'], async () => {
    const response = await axios.get('data/surveillance_result_types');
    return response.data.data;
  }, options.daily);
};

const useFetchSurveillanceTypes = () => {
  const axios = useAxios();
  return useQuery(['data/surveillance_types'], async () => {
    const response = await axios.get('data/surveillance_types');
    return response.data.data;
  }, options.daily);
};

const useFetchTargetedUsers = () => {
  const axios = useAxios();
  return useQuery(['/data/targeted_users'], async () => {
    const response = await axios.get('/data/targeted_users');
    return response.data;
  }, options.daily);
};

export {
  useFetchCertificationStatuses,
  useFetchClassificationTypes,
  useFetchComplainantTypes,
  useFetchComplaintTypes,
  useFetchCqms,
  useFetchMeasureTypes,
  useFetchMeasures,
  useFetchNonconformityTypes,
  useFetchPracticeTypes,
  useFetchRequirementGroupTypes,
  useFetchRequirementTypes,
  useFetchSurveillanceResultTypes,
  useFetchSurveillanceTypes,
  useFetchTargetedUsers,
};

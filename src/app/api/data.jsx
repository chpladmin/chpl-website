import { useQuery } from '@tanstack/react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchCapStatuses = () => {
  const axios = useAxios();
  return useQuery(['surveillance-report/cap-statuses'], async () => {
    const response = await axios.get('surveillance-report/cap-statuses');
    return response.data;
  }, options.daily);
};

const useFetchCertificationStatuses = () => {
  const axios = useAxios();
  return useQuery(['certified_products/certification-statuses'], async () => {
    const response = await axios.get('certified_products/certification-statuses');
    return response.data;
  }, options.daily);
};

const useFetchComplainantTypes = () => {
  const axios = useAxios();
  return useQuery(['complaints/complainant-types'], async () => {
    const response = await axios.get('complaints/complainant-types');
    return response.data;
  }, options.daily);
};

const useFetchComplaintTypes = () => {
  const axios = useAxios();
  return useQuery(['complaints/types'], async () => {
    const response = await axios.get('complaints/types');
    return response.data;
  }, options.daily);
};

const useFetchNonConformityTypes = () => {
  const axios = useAxios();
  return useQuery(['surveillance/non-conformity-types'], async () => {
    const response = await axios.get('surveillance/non-conformity-types');
    return response.data;
  }, options.daily);
};

const useFetchRequirementGroupTypes = () => {
  const axios = useAxios();
  return useQuery(['surveillance/requirement-group-types'], async () => {
    const response = await axios.get('surveillance/requirement-group-types');
    return response.data;
  }, options.daily);
};

const useFetchRequirementTypes = () => {
  const axios = useAxios();
  return useQuery(['surveillance/requirement-types'], async () => {
    const response = await axios.get('surveillance/requirement-types');
    return response.data;
  }, options.daily);
};

const useFetchSurveillanceGroundsForInitiating = () => {
  const axios = useAxios();
  return useQuery(['surveillance-report/surveillance-grounds-for-initiating'], async () => {
    const response = await axios.get('surveillance-report/surveillance-grounds-for-initiating');
    return response.data;
  }, options.daily);
};

const useFetchSurveillanceOutcomes = () => {
  const axios = useAxios();
  return useQuery(['surveillance-report/surveillance-outcomes'], async () => {
    const response = await axios.get('surveillance-report/surveillance-outcomes');
    return response.data;
  }, options.daily);
};

const useFetchSurveillanceProcessTypes = () => {
  const axios = useAxios();
  return useQuery(['surveillance-report/surveillance-process-types'], async () => {
    const response = await axios.get('surveillance-report/surveillance-process-types');
    return response.data;
  }, options.daily);
};

const useFetchSurveillanceResultTypes = () => {
  const axios = useAxios();
  return useQuery(['surveillance/result-types'], async () => {
    const response = await axios.get('surveillance/result-types');
    return response.data;
  }, options.daily);
};

const useFetchSurveillanceTypes = () => {
  const axios = useAxios();
  return useQuery(['surveillance/types'], async () => {
    const response = await axios.get('surveillance/types');
    return response.data;
  }, options.daily);
};

export {
  useFetchCapStatuses,
  useFetchCertificationStatuses,
  useFetchComplainantTypes,
  useFetchComplaintTypes,
  useFetchNonConformityTypes,
  useFetchRequirementGroupTypes,
  useFetchRequirementTypes,
  useFetchSurveillanceGroundsForInitiating,
  useFetchSurveillanceOutcomes,
  useFetchSurveillanceProcessTypes,
  useFetchSurveillanceResultTypes,
  useFetchSurveillanceTypes,
};

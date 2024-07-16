import { useQueries, useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchActivities = ({ ids, enabled }) => {
  const axios = useAxios();
  return useQueries(ids.map((id) => ({
    ...options.daily,
    queryKey: ['activity', id],
    queryFn: async () => {
      const response = await axios.get(`activity/${id}`);
      return response.data;
    },
    enabled: enabled && !!ids,
  })));
};

const useFetchActivity = ({ id, isEnabled }) => {
  const axios = useAxios();
  return useQuery(['activity', id], async () => {
    const response = await axios.get(`activity/${id}`);
    return response.data;
  }, {
    enabled: isEnabled && !!id,
  });
};

const useFetchFunctionalitiesTestedActivity = ({ isEnabled }) => {
  const axios = useAxios();
  return useQuery(['activity/metadata/functionalities-tested'], async () => {
    const response = await axios.get('activity/metadata/functionalities-tested');
    return response.data;
  }, {
    enabled: isEnabled,
  });
};

const useFetchListingActivityMetadata = ({ id, enabled }) => {
  const axios = useAxios();
  return useQuery({
    queryKey: ['activity/metadata/listings', id],
    queryFn: async () => {
      const response = await axios.get(`activity/metadata/listings/${id}`);
      return response.data;
    },
    enabled: enabled && !!id,
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
  useFetchActivities,
  useFetchActivity,
  useFetchFunctionalitiesTestedActivity,
  useFetchListingActivityMetadata,
  useFetchStandardsActivity,
  useFetchSvapsActivity,
};

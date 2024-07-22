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

const useFetchDeveloperActivitiesMetadata = ({ developers, enabled }) => {
  const axios = useAxios();
  return useQueries(developers.map((d) => ({
    ...options.daily,
    queryKey: ['activity/metadata/developers', d.id, d.end],
    queryFn: async () => {
      const response = await axios.get(`activity/metadata/developers/${d.id}?end=${d.end}`);
      return {
        data: response.data,
        id: d.id,
      };
    },
    enabled: enabled && !!developers,
  })));
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

const useFetchProductActivitiesMetadata = ({ products, enabled }) => {
  const axios = useAxios();
  return useQueries(products.map((p) => ({
    ...options.daily,
    queryKey: ['activity/metadata/products', p.id, p.end],
    queryFn: async () => {
      const response = await axios.get(`activity/metadata/products/${p.id}?end=${p.end}`);
      return {
        data: response.data,
        id: p.id,
      };
    },
    enabled: enabled && !!products,
  })));
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

const useFetchVersionActivitiesMetadata = ({ versions, enabled }) => {
  const axios = useAxios();
  return useQueries(versions.map((v) => ({
    ...options.daily,
    queryKey: ['activity/metadata/versions', v.id, v.end],
    queryFn: async () => {
      const response = await axios.get(`activity/metadata/versions/${v.id}?end=${v.end}`);
      return {
        data: response.data,
        id: v.id,
      };
    },
    enabled: enabled && !!versions,
  })));
};

export {
  useFetchActivities,
  useFetchActivity,
  useFetchDeveloperActivitiesMetadata,
  useFetchFunctionalitiesTestedActivity,
  useFetchListingActivityMetadata,
  useFetchProductActivitiesMetadata,
  useFetchStandardsActivity,
  useFetchSvapsActivity,
  useFetchVersionActivitiesMetadata,
};

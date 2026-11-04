import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import ChplAnnouncementsView from './announcements-view';

import {
  useDeleteAnnouncement,
  useFetchAnnouncements,
  usePostAnnouncement,
  usePutAnnouncement,
} from 'api/announcements';
import ChplSystemMaintenanceLoading from 'components/system-maintenance/system-maintenance-loading';
import { UserContext } from 'shared/contexts';

function ChplAnnouncements() {
  const { hasAnyRole } = useContext(UserContext);
  const { data, isLoading, isSuccess } = useFetchAnnouncements({ getFuture: hasAnyRole(['chpl-admin', 'chpl-onc']) });
  const { mutate: remove } = useDeleteAnnouncement();
  const { mutate: post } = usePostAnnouncement();
  const { mutate: put } = usePutAnnouncement();
  const { enqueueSnackbar } = useSnackbar();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setAnnouncements(data);
  }, [data, isLoading, isSuccess]);

  const deleteAnnouncement = (request) => {
    remove(request, {
      onError: (error) => {
        const message = error.response.data?.error
              || error.response.data?.errorMessages.join(' ');
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  const save = (request) => {
    const mutate = request.id ? put : post;
    mutate({
      ...request,
    }, {
      onError: (error) => {
        const message = error.response.data?.error
              || error.response.data?.errorMessages.join(' ');
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'delete':
        deleteAnnouncement(payload);
        break;
      case 'save':
        save(payload);
        break;
        // no default
    }
  };

  if (isLoading) {
    return (
      <ChplSystemMaintenanceLoading
        editable
        fieldGroups={[[{ flex: '1 1 100%', lines: 2 }], 3]}
        label="Loading announcements"
      />
    );
  }

  return (
    <ChplAnnouncementsView
      announcements={announcements}
      dispatch={handleDispatch}
    />
  );
}

export default ChplAnnouncements;

ChplAnnouncements.propTypes = {
};

import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import ChplAnnouncementsView from './announcements-view';

import {
  useDeleteAnnouncement,
  useFetchAnnouncements,
  usePostAnnouncement,
  usePutAnnouncement,
} from 'api/announcements';
import { UserContext } from 'shared/contexts';

function ChplAnnouncements() {
  const { hasAnyRole } = useContext(UserContext);
  const { data, isLoading, isSuccess } = useFetchAnnouncements({ isAuthenticated: hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) });
  const { mutate: remove } = useDeleteAnnouncement();
  const { mutate: post } = usePostAnnouncement();
  const { mutate: put } = usePutAnnouncement();
  const { enqueueSnackbar } = useSnackbar();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setAnnouncements(data.sort((a, b) => a.startDate - b.startDate));
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
      startDate: (new Date(request.startDate)).getTime(),
      endDate: (new Date(request.endDate)).getTime(),
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
      default:
        console.log({ file: 'root', action, payload });
    }
  };

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

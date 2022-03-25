import React, { useContext, useEffect, useState } from 'react';
import {
  arrayOf, func, string,
} from 'prop-types';
import Moment from 'react-moment';
import { useSnackbar } from 'notistack';

import ChplAnnouncementsView from './announcements-view';

import {
  useFetchAnnouncements,
  usePostAnnouncement,
  usePutAnnouncement,
} from 'api/announcements';

function ChplAnnouncements() {
  const { data, isLoading, isSuccess } = useFetchAnnouncements();
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

  const save = (request) => {
    mutate(request, {
      onSuccess: () => {
        setAnnouncement(undefined);
      },
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
      default:
        console.log({ action, payload });
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

import React from 'react';

import ChplAnnouncements from './announcements';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';

function ChplAnnouncementsWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplAnnouncements />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplAnnouncementsWrapper;

ChplAnnouncementsWrapper.propTypes = {
};

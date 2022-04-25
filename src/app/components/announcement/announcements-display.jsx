import React, { useEffect, useState } from 'react';

import { useFetchAnnouncements } from 'api/announcements';

function ChplAnnouncementsDisplay() {
  const { data, isLoading, isSuccess } = useFetchAnnouncements({ getFuture: false });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setAnnouncements(data.sort((a, b) => (a.startDateTime < b.startDateTime ? -1 : 1)));
  }, [data, isLoading, isSuccess]);

  if (announcements.length === 0) { return null; }

  return (
    <>
      { announcements
        .map((item) => (
          <p key={item.id} className="announcement nav-text spaced-out badge">
            { item.title }
            { item.text ? `: ${item.text}` : ''}
          </p>
        ))}
    </>
  );
}

export default ChplAnnouncementsDisplay;

ChplAnnouncementsDisplay.propTypes = {
};

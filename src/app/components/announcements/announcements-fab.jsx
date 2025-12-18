import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { useFetchAnnouncements } from 'api/announcements';

function ChplAnnouncementsFab() {
  const [expanded, setExpanded] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  const { data, isLoading, isSuccess } = useFetchAnnouncements({ getFuture: false });

  useEffect(() => {
    if (isLoading) return;
    if (!isSuccess) {
      setError('Failed to load announcements');
      setAnnouncements([]);
      return;
    }
    setError(null);
    setAnnouncements(data || []);
  }, [data, isLoading, isSuccess]);

  const handleToggle = (event) => {
    event.stopPropagation();
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const panel = document.getElementById('announcements-panel');
      if (panel && !panel.contains(event.target)) {
        setExpanded(false);
      }
    };
    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [expanded]);

  return (
    <>

      <button
        style={{
          position: 'sticky',
          zIndex: 96000,
          backgroundColor: 'transparent',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'none',
          padding: '12px',
          borderRadius: '50%',
        }}
        onClick={handleToggle}
        aria-label="Show announcements"
      >
      <span
        style={{
        backgroundColor: '#156dac',
        color: 'white',
        borderRadius: '50%',
        padding: '4px 8px',
        fontSize: '0.75rem',
        position: 'absolute',
        top: 0,
        right: 0,
        }}
      >
        {announcements.length}
      </span>
      <NotificationsIcon style={{ fontSize: 18, color: 'white' }} />
      </button>

      {expanded && (
        <div
          id="announcements-panel"
          style={{
            width: 325,
            top: 64,
            right: 0,
            position: 'fixed',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 100px)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            border: `2px solid ${palette.primary}`,
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          role="region"
          aria-label="Announcements panel"
          aria-live="polite"
        >
          <div
            style={{
              padding: 16,
              backgroundColor: '#156dac',
              color: 'white',
              borderRadius: '8px 8px 0px 0px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'inherit' }}>
              Announcement{announcements.length !== 1 ? 's' : ''}
            </h3>
            <button
              onClick={handleToggle}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}
              aria-label="Close announcements panel"
            >
              ×
            </button>
          </div>
          <div role="main" style={{ flex: 1, overflowY: 'auto' }}>
            {error ? (
              <div style={{ textAlign: 'center', color: 'red', padding: '32px 16px' }}>
                <p style={{ fontFamily: 'inherit', fontSize: 'inherit', margin: 0 }}>Error: {error}</p>
              </div>
            ) : announcements.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '32px 16px' }}>
                <p style={{ fontFamily: 'inherit', fontSize: 'inherit', margin: 0 }}>No current announcements</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {announcements.map((announcement, index) => (
                  <div key={announcement.id || index} style={{ padding: 16, wordWrap: 'break-word', whiteSpace: 'pre-wrap', borderBottom: '1px solid #e0e0e0' }}>
                    <h4 style={{ fontFamily: 'inherit', fontSize: 'inherit', margin: 0 }}>
                      <strong>{announcement.title}</strong>
                    </h4>
                     {announcement.text && (
                        <span>{announcement.text}</span>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ChplAnnouncementsFab;
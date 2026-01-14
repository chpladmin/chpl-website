import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { useFetchAnnouncements } from 'api/announcements';
import { palette } from 'themes';

function ChplAnnouncementsFab() {
  const [expanded, setExpanded] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const { data, isLoading, isSuccess } = useFetchAnnouncements({ getFuture: false });

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setAnnouncements(data.sort((a, b) => a.startDate - b.startDate));
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
          color: palette.white,
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'none',
          padding: '14px',
          borderRadius: '50%',
        }}
        onClick={handleToggle}
        aria-label="Show announcements"
      >
        <span
          style={{
            backgroundColor: palette.primary,
            color: palette.white,
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            position: 'absolute',
            border: `2px ${palette.primaryDark} solid`,
            top: '-2px',
            right: '4px',
          }}
        >
          {announcements.length}
        </span>
        <NotificationsIcon style={{ fontSize: 18, color: palette.white }} />
      </button>

      {expanded && (
        <div
          id="announcements-panel"
          style={{
            width: '325px',
            top: '64px',
            right: 0,
            position: 'fixed',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 100px)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            border: `2px solid ${palette.primary}`,
            background: palette.white,
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          role="region"
          aria-label="Announcements panel"
          aria-live="polite"
        >
          <div
            style={{
              padding: '16px',
              backgroundColor: palette.primary,
              color: palette.white,
              borderRadius: '8px 8px 0px 0px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{
              margin: 0, fontSize: '1.75rem', fontWeight: 'bold', fontFamily: 'inherit',
            }}
            >
              Announcement
              {announcements.length !== 1 ? 's' : ''}
            </h3>
            <button
              type="button"
              onClick={handleToggle}
              style={{
                background: 'none', border: 'none', color: palette.white, fontSize: '20px', cursor: 'pointer',
              }}
              aria-label="Close announcements panel"
            >
              ×
            </button>
          </div>
          <div role="main" style={{ flex: 1, overflowY: 'auto' }}>
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '32px 16px' }}>
                <p style={{ fontFamily: 'inherit', fontSize: 'inherit', margin: 0 }}>No current announcements</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {announcements.map((announcement, index) => (
                  <div
                    key={announcement.id || index}
                    style={{
                      padding: '16px', wordWrap: 'break-word', whiteSpace: 'pre-wrap', borderBottom: '1px solid #e0e0e0',
                    }}
                  >
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

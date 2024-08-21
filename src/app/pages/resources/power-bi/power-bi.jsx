import React from 'react';

import { useFetchReportUrl } from 'api/reports';

function PowerBI() {
  const developerStatisticsReportUrl = useFetchReportUrl('DeveloperStatistics');
  
  return (
    <iframe 
      title="DeveloperStatistics" 
      width="100%" 
      height="800" 
      src={developerStatisticsReportUrl?.data?.reportUrl} 
      frameBorder="0" 
      allowFullScreen
    />
  );
}

export default PowerBI;

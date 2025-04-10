import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  object,
  string,
} from 'prop-types';

import ChplAnnual from './annual';
import ChplQuarter from './quarter';

import { useFetchAnnual, useFetchQuarters, useFetchQuarterly } from 'api/surveillance';
import { ChplTextField } from 'components/util';
import { acb as acbPropType } from 'shared/prop-types';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplReport({
  acb,
  dispatch,
  errorMessages,
  isProcessing,
}) {
  const annualQuery = useFetchAnnual();
  const quarterQuery = useFetchQuarters();
  const quarterlyQuery = useFetchQuarterly();
  const [activeYear, setActiveYear] = useState(new Date().getYear() + 1900);
  const [annual, setAnnual] = useState([]);
  const [filteredAnnual, setFilteredAnnual] = useState([]);
  const [filteredQuarterly, setFilteredQuarterly] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [quarterly, setQuarterly] = useState([]);
  const classes = useStyles();
  const availableYears = [...Array(new Date().getYear() + 1900 - 2019 + 1)]
        .map((_, i) => 2019 + i)
        .sort((a, b) => b - a);

  useEffect(() => {
    if (annualQuery.isLoading || !annualQuery.isSuccess) { return; }
    setAnnual(annualQuery.data);
  }, [annualQuery.data, annualQuery.isLoading, annualQuery.isSuccess]);

  useEffect(() => {
    if (quarterQuery.isLoading || !quarterQuery.isSuccess) { return; }
    setQuarters(quarterQuery.data);
  }, [quarterQuery.data, quarterQuery.isLoading, quarterQuery.isSuccess]);

  useEffect(() => {
    if (quarterlyQuery.isLoading || !quarterlyQuery.isSuccess) { return; }
    setQuarterly(quarterlyQuery.data);
  }, [quarterlyQuery.data, quarterlyQuery.isLoading, quarterlyQuery.isSuccess]);

  useEffect(() => {
    setFilteredAnnual((annual).find((r) => r.acb.id === acb.id && r.year === activeYear));
    setFilteredQuarterly((quarterly).filter((r) => r.acb.id === acb.id && r.year === activeYear));
  }, [annual, quarterly, acb, activeYear]);

  if (quarters.length === 0 || quarterly.length === 0 || annual.length === 0) { return <CircularProgress /> }

  return (
    <Card>
      <CardHeader title={acb.name} />
      <CardContent>
        <ChplTextField
          select
          id="active-year"
          name="activeYear"
          label="Active Year"
          value={activeYear}
          onChange={(event) => setActiveYear(event.target.value)}
        >
          { availableYears
            .map((item) => (
              <MenuItem value={item} key={item}>{item}</MenuItem>
            ))}
        </ChplTextField>
        { quarters.map((q) => (
          <ChplQuarter
            dispatch={dispatch}
            key={q.id}
            quarter={q}
            report={filteredQuarterly.find((r) => r.quarter === q.name)}
            year={activeYear}
          />
        ))}
          <ChplAnnual
            dispatch={dispatch}
            report={filteredAnnual}
            year={activeYear}
          />
      </CardContent>
    </Card>
  );
}

export default ChplReport;

ChplReport.propTypes = {
  acb: acbPropType.isRequired,
  dispatch: func.isRequired,
  errorMessages: arrayOf(string),
  isProcessing: bool,
};

ChplReport.defaultProps = {
  errorMessages: [],
  isProcessing: false,
};

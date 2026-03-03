import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import { useSnackbar } from 'notistack';

import ChplSvapEdit from './svap-edit';
import ChplSvapsView from './svaps-view';

import {
  useDeleteSvap,
  useFetchCriteriaForSvaps,
  useFetchSvaps,
  usePostSvap,
  usePutSvap,
} from 'api/standards';
import {
  FilterProvider,
  defaultFilter,
} from 'components/filter';
import { certificationCriteriaIds } from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';

const staticFilters = [{
  ...defaultFilter,
  key: 'replaced',
  display: 'Replaced',
  getValueEntry: getRadioValueEntry,
  singular: true,
  values: [
    { value: 'active', display: 'Active' },
    { value: 'replaced', display: 'Replaced' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => (v.selected ? (acc && (v.value === 'active' ? !item.replaced : item.replaced)) : acc), true),
}];

function ChplSvaps() {
  const { data, isLoading, isSuccess } = useFetchSvaps();
  const deleteSvap = useDeleteSvap();
  const postSvap = usePostSvap();
  const putSvap = usePutSvap();
  const criterionOptionsQuery = useFetchCriteriaForSvaps();
  const { enqueueSnackbar } = useSnackbar();
  const [activeSvap, setActiveSvap] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [svaps, setSvaps] = useState([]);
  const [filters, setFilters] = useState(staticFilters);
  let handleDispatch;

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setSvaps(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (criterionOptionsQuery.isLoading || !criterionOptionsQuery.isSuccess) { return; }
    setCriterionOptions(criterionOptionsQuery.data);
    const values = criterionOptionsQuery.data
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.status === 'RETIRED' ? 'Retired | ' : ''}${cc.number}`,
        longDisplay: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.status === 'RETIRED' ? 'Retired | ' : ''}${cc.number}: ${cc.title}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        values,
      }));
  }, [criterionOptionsQuery.data, criterionOptionsQuery.isLoading, criterionOptionsQuery.isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveSvap(undefined);
        setIsProcessing(false);
        break;
      case 'delete':
        setErrors([]);
        setIsProcessing(true);
        deleteSvap.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('SVAP Deleted', {
              variant: 'success',
            });
            setIsProcessing(false);
            setActiveSvap(undefined);
          },
          onError: (error) => {
            setIsProcessing(false);
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveSvap(payload);
        setErrors([]);
        break;
      case 'save':
        setErrors([]);
        setIsProcessing(true);
        if (payload.svapId) {
          putSvap.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('SVAP Updated', {
                variant: 'success',
              });
              setIsProcessing(false);
              setActiveSvap(undefined);
            },
            onError: (error) => {
              setIsProcessing(false);
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postSvap.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('SVAP Created', {
                variant: 'success',
              });
              setIsProcessing(false);
              setActiveSvap(undefined);
            },
            onError: (error) => {
              setIsProcessing(false);
              setErrors(error.response.data?.errorMessages);
            },
          });
        }
        break;
        // no default
    }
  };

  if (activeSvap) {
    return (
      <Card>
        <CardHeader title={(
          <>
            <TrendingUpOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`${activeSvap.svapId ? 'Edit' : 'Add'} SVAP`}
          </>
)} />
        <CardContent>
          <ChplSvapEdit
            svap={activeSvap}
            dispatch={handleDispatch}
            criterionOptions={criterionOptions}
            errors={errors}
            isProcessing={isProcessing}
          />
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <FilterProvider
      filters={filters}
      storageKey="storageKey-svapManagement"
    >
      <Card>
        <CardHeader
          style={{ paddingLeft: '16px' }}
          title={(
            <>
              SVAP
              <TrendingUpOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </>
)}
        />
        <CardContent>
          { (deleteSvap.isLoading || postSvap.isLoading || putSvap.isLoading)
            && (
              <CircularProgress />
            )}
          <ChplSvapsView
            svaps={svaps}
            dispatch={handleDispatch}
          />
        </CardContent>
      </Card>
    </FilterProvider>
  );
}

export default ChplSvaps;

ChplSvaps.propTypes = {
};

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import PlaylistAddCheckOutlinedIcon from '@material-ui/icons/PlaylistAddCheckOutlined';
import { useSnackbar } from 'notistack';

import ChplStandardEdit from './standard-edit';
import ChplStandardsView from './standards-view';

import {
  useDeleteStandard,
  useFetchCriteriaForStandards,
  useFetchRules,
  useFetchStandards,
  usePostStandard,
  usePutStandard,
} from 'api/standards';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateEntry,
} from 'components/filter';
import { certificationCriteriaIds } from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';

const staticFilters = [{
  ...defaultFilter,
  key: 'startDay',
  display: 'Start Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => ((!!v.selected && !!item.startDay) ? acc && (v.value === 'Before' ? item.startDay <= v.selected : item.startDay >= v.selected) : acc), true),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}, {
  ...defaultFilter,
  key: 'endDay',
  display: 'End Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => {
    if ((!!v.selected && !!item.endDay)) { // selected and item has a value
      return acc && (v.value === 'Before' ? item.endDay <= v.selected : item.endDay >= v.selected);
    }
    if (!v.selected) { // not selected
      return acc;
    }
    // selected but no item value
    return acc && (v.value !== 'Before');
  }, true),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}, {
  ...defaultFilter,
  key: 'requiredDay',
  display: 'Required Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => {
    if ((!!v.selected && !!item.requiredDay)) { // selected and item has a value
      return acc && (v.value === 'Before' ? item.requiredDay <= v.selected : item.requiredDay >= v.selected);
    }
    if (!v.selected) { // not selected
      return acc;
    }
    // selected but no item value
    return acc && (v.value !== 'Before');
  }, true),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}, {
  ...defaultFilter,
  key: 'extensionEndDay',
  display: 'Extension End Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => {
    if ((!!v.selected && !!item.extensionEndDay)) { // selected and item has a value
      return acc && (v.value === 'Before' ? item.extensionEndDay <= v.selected : item.extensionEndDay >= v.selected);
    }
    if (!v.selected) { // not selected
      return acc;
    }
    // selected but no item value
    return acc && (v.value !== 'Before');
  }, true),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}, {
  ...defaultFilter,
  key: 'expired',
  display: 'Expired',
  getValueEntry: getRadioValueEntry,
  singular: true,
  values: [
    { value: 'active', display: 'Active', default: true },
    { value: 'expired', display: 'Expired' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => (v.selected ? (acc && (v.value === 'active' ? !item.retired : item.retired)) : acc), true),
}];

function ChplStandards() {
  const { data, isLoading, isSuccess } = useFetchStandards();
  const deleteStandard = useDeleteStandard();
  const postStandard = usePostStandard();
  const putStandard = usePutStandard();
  const criterionOptionsQuery = useFetchCriteriaForStandards();
  const rulesQuery = useFetchRules();
  const { enqueueSnackbar } = useSnackbar();
  const [activeStandard, setActiveStandard] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rules, setRules] = useState([]);
  const [errors, setErrors] = useState([]);
  const [filters, setFilters] = useState(staticFilters);
  const [standards, setStandards] = useState([]);
  let handleDispatch;

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setStandards(data);
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

  useEffect(() => {
    if (rulesQuery.isLoading || !rulesQuery.isSuccess) { return; }
    setRules(rulesQuery.data);
  }, [rulesQuery.data, rulesQuery.isLoading, rulesQuery.isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveStandard(undefined);
        setIsProcessing(false);
        break;
      case 'delete':
        setErrors([]);
        setIsProcessing(true);
        deleteStandard.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Standard Deleted', {
              variant: 'success',
            });
            setActiveStandard(undefined);
            setIsProcessing(false);
          },
          onError: (error) => {
            setIsProcessing(false);
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveStandard(payload);
        setErrors([]);
        break;
      case 'save':
        setErrors([]);
        setIsProcessing(true);
        if (payload.id) {
          putStandard.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Standard Updated', {
                variant: 'success',
              });
              setActiveStandard(undefined);
              setIsProcessing(false);
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
              setIsProcessing(false);
            },
          });
        } else {
          postStandard.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Standard Created', {
                variant: 'success',
              });
              setActiveStandard(undefined);
              setIsProcessing(false);
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

  if (activeStandard) {
    return (
      <Card>
        <CardHeader title={(
          <>
            <PlaylistAddCheckOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`${activeStandard.id ? 'Edit' : 'Add'} Standard`}
          </>
)} />
        <CardContent>
          <ChplStandardEdit
            standard={activeStandard}
            dispatch={handleDispatch}
            criterionOptions={criterionOptions}
            isProcessing={isProcessing}
            rules={rules}
            errors={errors}
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
      storageKey="storageKey-standardsManagement"
    >
      <Card>
        <CardHeader
          style={{ paddingLeft: '16px' }}
          title={(
            <>
              Standards
              <PlaylistAddCheckOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </>
)}
        />
        <CardContent>
          { (deleteStandard.isLoading || postStandard.isLoading || putStandard.isLoading)
            && (
              <CircularProgress />
            )}
          <ChplStandardsView
            standards={standards}
            dispatch={handleDispatch}
          />
        </CardContent>
      </Card>
    </FilterProvider>
  );
}

export default ChplStandards;

ChplStandards.propTypes = {
};

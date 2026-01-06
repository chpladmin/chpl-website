import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import BeenhereOutlinedIcon from '@material-ui/icons/BeenhereOutlined';
import { useSnackbar } from 'notistack';

import ChplFunctionalityTestedEdit from './functionality-tested-edit';
import ChplFunctionalitiesTestedView from './functionalities-tested-view';

import {
  useDeleteFunctionalityTested,
  useFetchCriteriaForFunctionalitiesTested,
  useFetchRules,
  useFetchFunctionalitiesTested,
  usePostFunctionalityTested,
  usePutFunctionalityTested,
} from 'api/standards';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateEntry,
} from 'components/filter';
import { certificationCriteriaIds } from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';
import { BreadcrumbContext } from 'shared/contexts';

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
    if ((!!v.selected && !!item.requiredDay)) { // selected and item has a value
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
  key: 'retired',
  display: 'Retired',
  getValueEntry: getRadioValueEntry,
  singular: true,
  values: [
    { value: 'active', display: 'Active', default: true },
    { value: 'retired', display: 'Retired' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => (v.selected ? (acc && (v.value === 'active' ? !item.retired : item.retired)) : acc), true),
}];

function ChplFunctionalitiesTested() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchFunctionalitiesTested();
  const deleteFunctionalityTested = useDeleteFunctionalityTested();
  const postFunctionalityTested = usePostFunctionalityTested();
  const putFunctionalityTested = usePutFunctionalityTested();
  const criterionOptionsQuery = useFetchCriteriaForFunctionalitiesTested();
  const rulesQuery = useFetchRules();
  const { enqueueSnackbar } = useSnackbar();
  const [activeFunctionalityTested, setActiveFunctionalityTested] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [rules, setRules] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState(staticFilters);
  const [functionalitiesTested, setFunctionalitiesTested] = useState([]);
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="functionalitiesTested.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Functionalities Tested
      </Button>,
    );
    append(
      <Button
        key="functionalitiesTested.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        Functionalities Tested
      </Button>,
    );
    display('functionalitiesTested.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setFunctionalitiesTested(data);
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
        setActiveFunctionalityTested(undefined);
        setIsProcessing(false);
        display('functionalitiesTested.viewall.disabled');
        hide('functionalitiesTested.viewall');
        hide('functionalitiesTested.add.disabled');
        hide('functionalitiesTested.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        setIsProcessing(true);
        deleteFunctionalityTested.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Functionality Tested Deleted', {
              variant: 'success',
            });
            setActiveFunctionalityTested(undefined);
            setIsProcessing(false);
            display('functionalitiesTested.viewall.disabled');
            hide('functionalitiesTested.viewall');
          },
          onError: (error) => {
            setIsProcessing(false);
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveFunctionalityTested(payload);
        setErrors([]);
        display('functionalitiesTested.viewall');
        hide('functionalitiesTested.viewall.disabled');
        break;
      case 'save':
        setErrors([]);
        setIsProcessing(true);
        if (payload.id) {
          putFunctionalityTested.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Functionality Tested Updated', {
                variant: 'success',
              });
              setActiveFunctionalityTested(undefined);
              setIsProcessing(false);
              display('functionalitiesTested.viewall.disabled');
              hide('functionalitiesTested.viewall');
            },
            onError: (error) => {
              setIsProcessing(false);
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postFunctionalityTested.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Functionality Tested Created', {
                variant: 'success',
              });
              setActiveFunctionalityTested(undefined);
              setIsProcessing(false);
              display('functionalitiesTested.viewall.disabled');
              hide('functionalitiesTested.viewall');
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

  if (activeFunctionalityTested) {
    return (
      <Card>
        <CardHeader title={(
          <>
            <BeenhereOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`${activeFunctionalityTested.id ? 'Edit' : 'Add'} Functionality Tested`}
          </>
)}
        />
        <CardContent>
          <ChplFunctionalityTestedEdit
            functionalityTested={activeFunctionalityTested}
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
      storageKey="storageKey-functionalitiesTestedManagement"
    >
      <Card>
        <CardHeader
          style={{ paddingLeft: '16px' }}
          title={(
            <>
              Functionalities Tested
              <BeenhereOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </>
)}
        />
        <CardContent>
          { (deleteFunctionalityTested.isLoading || postFunctionalityTested.isLoading || putFunctionalityTested.isLoading)
            && (
              <CircularProgress />
            )}
          <ChplFunctionalitiesTestedView
            functionalitiesTested={functionalitiesTested}
            dispatch={handleDispatch}
          />
        </CardContent>
      </Card>
    </FilterProvider>
  );
}

export default ChplFunctionalitiesTested;

ChplFunctionalitiesTested.propTypes = {
};

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplTestToolEdit from './test-tool-edit';
import ChplTestToolsView from './test-tools-view';

import {
  useDeleteTestTool,
  useFetchCriteriaForTestTools,
  useFetchRules,
  useFetchTestTools,
  usePostTestTool,
  usePutTestTool,
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
  key: 'retired',
  display: 'Retired',
  getValueEntry: getRadioValueEntry,
  singular: true,
  values: [
    { value: 'active', display: 'Active' },
    { value: 'retired', display: 'Retired' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => (v.selected ? (acc && (v.value === 'active' ? !item.retired : item.retired)) : acc), true),
}];

function ChplTestTools() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchTestTools();
  const deleteTestTool = useDeleteTestTool();
  const postTestTool = usePostTestTool();
  const putTestTool = usePutTestTool();
  const criterionOptionsQuery = useFetchCriteriaForTestTools();
  const rulesQuery = useFetchRules();
  const { enqueueSnackbar } = useSnackbar();
  const [activeTestTool, setActiveTestTool] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [rules, setRules] = useState([]);
  const [errors, setErrors] = useState([]);
  const [filters, setFilters] = useState(staticFilters);
  const [testTools, setTestTools] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="testTools.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Test Tools
      </Button>,
    );
    append(
      <Button
        key="testTools.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        Test Tools
      </Button>,
    );
    display('testTools.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setTestTools(data);
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
        setActiveTestTool(undefined);
        setIsProcessing(false);
        display('testTools.viewall.disabled');
        hide('testTools.viewall');
        hide('testTools.add.disabled');
        hide('testTools.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        setIsProcessing(true);
        deleteTestTool.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Test Tool Deleted', {
              variant: 'success',
            });
            setActiveTestTool(undefined);
            setIsProcessing(false);
            display('testTools.viewall.disabled');
            hide('testTools.viewall');
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
            setIsProcessing(false);
          },
        });
        break;
      case 'edit':
        setActiveTestTool(payload);
        setErrors([]);
        display('testTools.viewall');
        hide('testTools.viewall.disabled');
        break;
      case 'save':
        setErrors([]);
        setIsProcessing(true);
        if (payload.id) {
          putTestTool.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Test Tool Updated', {
                variant: 'success',
              });
              setActiveTestTool(undefined);
              setIsProcessing(false);
              display('testTools.viewall.disabled');
              hide('testTools.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
              setIsProcessing(false);
            },
          });
        } else {
          postTestTool.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Test Tool Created', {
                variant: 'success',
              });
              setActiveTestTool(undefined);
              setIsProcessing(false);
              display('testTools.viewall.disabled');
              hide('testTools.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data?.errorMessages);
              setIsProcessing(false);
            },
          });
        }
        break;
        // no default
    }
  };

  if (activeTestTool) {
    return (
      <Card>
        <CardHeader title={`${activeTestTool.id ? 'Edit' : 'Add'} Test Tool`} />
        <CardContent>
          <ChplTestToolEdit
            testTool={activeTestTool}
            dispatch={handleDispatch}
            criterionOptions={criterionOptions}
            rules={rules}
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
      storageKey="storageKey-testToolsManagement"
    >
      <Card>
        <CardHeader title="Test Tools" />
        <CardContent>
          { (deleteTestTool.isLoading || postTestTool.isLoading || putTestTool.isLoading)
            && (
              <CircularProgress />
            )}
          <ChplTestToolsView
            testTools={testTools}
            dispatch={handleDispatch}
          />
        </CardContent>
      </Card>
    </FilterProvider>
  );
}

export default ChplTestTools;

ChplTestTools.propTypes = {
};

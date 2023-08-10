import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplTestFunctionalityEdit from './test-functionality-edit';
import ChplTestFunctionalitiesView from './test-functionalities-view';

import {
  useDeleteTestFunctionality,
  useFetchCriteriaForTestFunctionalities,
  useFetchRules,
  useFetchTestFunctionalities,
  usePostTestFunctionality,
  usePutTestFunctionality,
} from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplTestFunctionalities() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchTestFunctionalities();
  const deleteTestFunctionality = useDeleteTestFunctionality();
  const postTestFunctionality = usePostTestFunctionality();
  const putTestFunctionality = usePutTestFunctionality();
  const criterionOptionsQuery = useFetchCriteriaForTestFunctionalities();
  const rulesQuery = useFetchRules();
  const { enqueueSnackbar } = useSnackbar();
  const [activeTestFunctionality, setActiveTestFunctionality] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [rules, setRules] = useState([]);
  const [errors, setErrors] = useState([]);
  const [testFunctionalities, setTestFunctionalities] = useState([]);
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="testFunctionalities.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Test Functionalities
      </Button>,
    );
    append(
      <Button
        key="testFunctionalities.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        Test Functionalities
      </Button>,
    );
    display('testFunctionalities.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setTestFunctionalities(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (criterionOptionsQuery.isLoading || !criterionOptionsQuery.isSuccess) { return; }
    setCriterionOptions(criterionOptionsQuery.data);
  }, [criterionOptionsQuery.data, criterionOptionsQuery.isLoading, criterionOptionsQuery.isSuccess]);

  useEffect(() => {
    if (rulesQuery.isLoading || !rulesQuery.isSuccess) { return; }
    setRules(rulesQuery.data);
  }, [rulesQuery.data, rulesQuery.isLoading, rulesQuery.isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveTestFunctionality(undefined);
        display('testFunctionalities.viewall.disabled');
        hide('testFunctionalities.viewall');
        hide('testFunctionalities.add.disabled');
        hide('testFunctionalities.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        deleteTestFunctionality.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Test Functionality Deleted', {
              variant: 'success',
            });
            setActiveTestFunctionality(undefined);
            display('testFunctionalities.viewall.disabled');
            hide('testFunctionalities.viewall');
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveTestFunctionality(payload);
        setErrors([]);
        display('testFunctionalities.viewall');
        hide('testFunctionalities.viewall.disabled');
        break;
      case 'save':
        setErrors([]);
        if (payload.id) {
          putTestFunctionality.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Test Functionality Updated', {
                variant: 'success',
              });
              setActiveTestFunctionality(undefined);
              display('testFunctionalities.viewall.disabled');
              hide('testFunctionalities.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postTestFunctionality.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Test Functionality Created', {
                variant: 'success',
              });
              setActiveTestFunctionality(undefined);
              display('testFunctionalities.viewall.disabled');
              hide('testFunctionalities.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data?.errorMessages);
            },
          });
        }
        break;
        // no default
    }
  };

  if (activeTestFunctionality) {
    return (
      <Card>
        <CardHeader title={`${activeTestFunctionality.id ? 'Edit' : 'Add'} Test Functionality`} />
        <CardContent>
          <ChplTestFunctionalityEdit
            testFunctionality={activeTestFunctionality}
            dispatch={handleDispatch}
            criterionOptions={criterionOptions}
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
    <Card>
      <CardHeader title="Test Functionalities" />
      <CardContent>
        { (deleteTestFunctionality.isLoading || postTestFunctionality.isLoading || putTestFunctionality.isLoading)
          && (
            <CircularProgress />
          )}
        <ChplTestFunctionalitiesView
          testFunctionalities={testFunctionalities}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplTestFunctionalities;

ChplTestFunctionalities.propTypes = {
};

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
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
import { BreadcrumbContext } from 'shared/contexts';

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
  }, [criterionOptionsQuery.data, criterionOptionsQuery.isLoading, criterionOptionsQuery.isSuccess]);

  useEffect(() => {
    if (rulesQuery.isLoading || !rulesQuery.isSuccess) { return; }
    setRules(rulesQuery.data);
  }, [rulesQuery.data, rulesQuery.isLoading, rulesQuery.isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveFunctionalityTested(undefined);
        display('functionalitiesTested.viewall.disabled');
        hide('functionalitiesTested.viewall');
        hide('functionalitiesTested.add.disabled');
        hide('functionalitiesTested.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        deleteFunctionalityTested.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Functionality Tested Deleted', {
              variant: 'success',
            });
            setActiveFunctionalityTested(undefined);
            display('functionalitiesTested.viewall.disabled');
            hide('functionalitiesTested.viewall');
          },
          onError: (error) => {
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
        if (payload.id) {
          putFunctionalityTested.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Functionality Tested Updated', {
                variant: 'success',
              });
              setActiveFunctionalityTested(undefined);
              display('functionalitiesTested.viewall.disabled');
              hide('functionalitiesTested.viewall');
            },
            onError: (error) => {
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
              display('functionalitiesTested.viewall.disabled');
              hide('functionalitiesTested.viewall');
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

  if (activeFunctionalityTested) {
    return (
      <Card>
        <CardHeader title={`${activeFunctionalityTested.id ? 'Edit' : 'Add'} Functionality Tested`} />
        <CardContent>
          <ChplFunctionalityTestedEdit
            functionalityTested={activeFunctionalityTested}
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
      <CardHeader title="Functionalities Tested" />
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
  );
}

export default ChplFunctionalitiesTested;

ChplFunctionalitiesTested.propTypes = {
};

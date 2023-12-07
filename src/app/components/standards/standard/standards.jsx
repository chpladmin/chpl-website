import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
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
import { BreadcrumbContext } from 'shared/contexts';

function ChplStandards() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchStandards();
  const deleteStandard = useDeleteStandard();
  const postStandard = usePostStandard();
  const putStandard = usePutStandard();
  const criterionOptionsQuery = useFetchCriteriaForStandards();
  const rulesQuery = useFetchRules();
  const { enqueueSnackbar } = useSnackbar();
  const [activeStandard, setActiveStandard] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [rules, setRules] = useState([]);
  const [errors, setErrors] = useState([]);
  const [standards, setStandards] = useState([]);
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="standards.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Standards
      </Button>,
    );
    append(
      <Button
        key="standards.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        Standards
      </Button>,
    );
    display('standards.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setStandards(data);
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
        setActiveStandard(undefined);
        display('standards.viewall.disabled');
        hide('standards.viewall');
        hide('standards.add.disabled');
        hide('standards.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        deleteStandard.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Standard Deleted', {
              variant: 'success',
            });
            setActiveStandard(undefined);
            display('standards.viewall.disabled');
            hide('standards.viewall');
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveStandard(payload);
        setErrors([]);
        display('standards.viewall');
        hide('standards.viewall.disabled');
        break;
      case 'save':
        setErrors([]);
        if (payload.id) {
          putStandard.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Standard Updated', {
                variant: 'success',
              });
              setActiveStandard(undefined);
              display('standards.viewall.disabled');
              hide('standards.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postStandard.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Standard Created', {
                variant: 'success',
              });
              setActiveStandard(undefined);
              display('standards.viewall.disabled');
              hide('standards.viewall');
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

  if (activeStandard) {
    return (
      <Card>
        <CardHeader title={`${activeStandard.id ? 'Edit' : 'Add'} Standard`} />
        <CardContent>
          <ChplStandardEdit
            standard={activeStandard}
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
      <CardHeader title="Standards" />
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
  );
}

export default ChplStandards;

ChplStandards.propTypes = {
};

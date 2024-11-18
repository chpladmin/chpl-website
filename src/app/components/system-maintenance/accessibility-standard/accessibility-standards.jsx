import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplAccessibilityStandardEdit from './accessibility-standard-edit';
import ChplAccessibilityStandardsView from './accessibility-standards-view';

import {
  useDeleteAccessibilityStandard,
  useFetchAccessibilityStandards,
  usePostAccessibilityStandard,
  usePutAccessibilityStandard,
} from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplAccessibilityStandards() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchAccessibilityStandards();
  const deleteAccessibilityStandard = useDeleteAccessibilityStandard();
  const postAccessibilityStandard = usePostAccessibilityStandard();
  const putAccessibilityStandard = usePutAccessibilityStandard();
  const { enqueueSnackbar } = useSnackbar();
  const [activeAccessibilityStandard, setActiveAccessibilityStandard] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const [accessibilityStandards, setAccessibilityStandards] = useState([]);
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="accessibilityStandards.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Accessibility Standards
      </Button>,
    );
    append(
      <Button
        key="accessibilityStandards.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        Accessibility Standards
      </Button>,
    );
    display('accessibilityStandards.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setAccessibilityStandards(data);
  }, [data, isLoading, isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveAccessibilityStandard(undefined);
        display('accessibilityStandards.viewall.disabled');
        hide('accessibilityStandards.viewall');
        hide('accessibilityStandards.add.disabled');
        hide('accessibilityStandards.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        deleteAccessibilityStandard.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Accessibility Standard Deleted', {
              variant: 'success',
            });
            setActiveAccessibilityStandard(undefined);
            display('accessibilityStandards.viewall.disabled');
            hide('accessibilityStandards.viewall');
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveAccessibilityStandard(payload);
        setErrors([]);
        display('accessibilityStandards.viewall');
        hide('accessibilityStandards.viewall.disabled');
        break;
      case 'save':
        setErrors([]);
        if (payload.id) {
          putAccessibilityStandard.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Accessibility Standard Updated', {
                variant: 'success',
              });
              setActiveAccessibilityStandard(undefined);
              display('accessibilityStandards.viewall.disabled');
              hide('accessibilityStandards.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postAccessibilityStandard.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Accessibility Standard Created', {
                variant: 'success',
              });
              setActiveAccessibilityStandard(undefined);
              display('accessibilityStandards.viewall.disabled');
              hide('accessibilityStandards.viewall');
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

  if (activeAccessibilityStandard) {
    return (
      <Card>
        <CardHeader title={`${activeAccessibilityStandard.id ? 'Edit' : 'Add'} Accessibility Standard`} />
        <CardContent>
          <ChplAccessibilityStandardEdit
            accessibilityStandard={activeAccessibilityStandard}
            dispatch={handleDispatch}
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
      <CardHeader title="Accessibility Standards" />
      <CardContent>
        { (deleteAccessibilityStandard.isLoading || postAccessibilityStandard.isLoading || putAccessibilityStandard.isLoading)
          && (
            <CircularProgress />
          )}
        <ChplAccessibilityStandardsView
          accessibilityStandards={accessibilityStandards}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplAccessibilityStandards;

ChplAccessibilityStandards.propTypes = {
};

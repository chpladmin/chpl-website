import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import AccessibilityNewOutlinedIcon from '@material-ui/icons/AccessibilityNewOutlined';
import { useSnackbar } from 'notistack';

import ChplAccessibilityStandardEdit from './accessibility-standard-edit';
import ChplAccessibilityStandardsView from './accessibility-standards-view';

import {
  useDeleteAccessibilityStandard,
  useFetchAccessibilityStandards,
  usePostAccessibilityStandard,
  usePutAccessibilityStandard,
} from 'api/standards';

function ChplAccessibilityStandards() {
  const { data, isLoading, isSuccess } = useFetchAccessibilityStandards();
  const deleteAccessibilityStandard = useDeleteAccessibilityStandard();
  const postAccessibilityStandard = usePostAccessibilityStandard();
  const putAccessibilityStandard = usePutAccessibilityStandard();
  const { enqueueSnackbar } = useSnackbar();
  const [activeAccessibilityStandard, setActiveAccessibilityStandard] = useState(undefined);
  const [accessibilityStandards, setAccessibilityStandards] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  let handleDispatch;

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setAccessibilityStandards(data);
  }, [data, isLoading, isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveAccessibilityStandard(undefined);
        setIsProcessing(false);
        break;
      case 'delete':
        setErrors([]);
        setIsProcessing(true);
        deleteAccessibilityStandard.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Accessibility Standard Deleted', {
              variant: 'success',
            });
            setActiveAccessibilityStandard(undefined);
            setIsProcessing(false);
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
            setIsProcessing(false);
          },
        });
        break;
      case 'edit':
        setActiveAccessibilityStandard(payload);
        setErrors([]);
        break;
      case 'save':
        setErrors([]);
        setIsProcessing(true);
        if (payload.id) {
          putAccessibilityStandard.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Accessibility Standard Updated', {
                variant: 'success',
              });
              setActiveAccessibilityStandard(undefined);
              setIsProcessing(false);
            },
            onError: (error) => {
              setIsProcessing(false);
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
              setIsProcessing(false);
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

  if (activeAccessibilityStandard) {
    return (
      <Card>
        <CardHeader title={(
          <>
            <AccessibilityNewOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`${activeAccessibilityStandard.id ? 'Edit' : 'Add'} Accessibility Standard`}
          </>
)} />
        <CardContent>
          <ChplAccessibilityStandardEdit
            accessibilityStandard={activeAccessibilityStandard}
            dispatch={handleDispatch}
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
    <Card>
      <CardHeader
        style={{ paddingLeft: '16px' }}
        title={(
          <>
            Accessibility Standards
            <AccessibilityNewOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </>
)}
      />
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

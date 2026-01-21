import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import { useSnackbar } from 'notistack';

import ChplConformanceMethodEdit from './conformance-method-edit';
import ChplConformanceMethodsView from './conformance-methods-view';

import {
  useDeleteConformanceMethod,
  useFetchCriteriaForConformanceMethods,
  useFetchConformanceMethods,
  usePostConformanceMethod,
  usePutConformanceMethod,
} from 'api/standards';

function ChplConformanceMethods() {
  const { data, isLoading, isSuccess } = useFetchConformanceMethods();
  const deleteConformanceMethod = useDeleteConformanceMethod();
  const postConformanceMethod = usePostConformanceMethod();
  const putConformanceMethod = usePutConformanceMethod();
  const criterionOptionsQuery = useFetchCriteriaForConformanceMethods();
  const { enqueueSnackbar } = useSnackbar();
  const [conformanceMethods, setConformanceMethods] = useState([]);
  const [activeConformanceMethod, setActiveConformanceMethod] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setConformanceMethods(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (criterionOptionsQuery.isLoading || !criterionOptionsQuery.isSuccess) { return; }
    setCriterionOptions(criterionOptionsQuery.data);
  }, [criterionOptionsQuery.data, criterionOptionsQuery.isLoading, criterionOptionsQuery.isSuccess]);

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveConformanceMethod(undefined);
        setIsProcessing(false);
        break;
      case 'delete':
        setErrors([]);
        setIsProcessing(true);
        deleteConformanceMethod.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Conformance Method Deleted', {
              variant: 'success',
            });
            setActiveConformanceMethod(undefined);
            setIsProcessing(false);
          },
          onError: (error) => {
            setIsProcessing(false);
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveConformanceMethod(payload);
        setErrors([]);
        break;
      case 'save':
        setErrors([]);
        setIsProcessing(true);
        if (payload.id) {
          putConformanceMethod.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Conformance Method Updated', {
                variant: 'success',
              });
              setActiveConformanceMethod(undefined);
              setIsProcessing(false);
            },
            onError: (error) => {
              setIsProcessing(false);
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postConformanceMethod.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Conformance Method Created', {
                variant: 'success',
              });
              setActiveConformanceMethod(undefined);
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

  if (activeConformanceMethod) {
    return (
      <Card>
        <CardHeader title={(
          <>
            <AccountBalanceOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`${activeConformanceMethod.id ? 'Edit' : 'Add'} Conformance Method`}
          </>
)} />
        <CardContent>
          <ChplConformanceMethodEdit
            conformanceMethod={activeConformanceMethod}
            dispatch={handleDispatch}
            criterionOptions={criterionOptions}
            isProcessing={isProcessing}
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
      <CardHeader
        style={{ paddingLeft: '16px' }}
        title={(
          <>
            Conformance Methods
            <AccountBalanceOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </>
)}
      />
      <CardContent>
        { (deleteConformanceMethod.isLoading || postConformanceMethod.isLoading || putConformanceMethod.isLoading)
            && (
              <CircularProgress />
            )}
        <ChplConformanceMethodsView
          conformanceMethods={conformanceMethods}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplConformanceMethods;

ChplConformanceMethods.propTypes = {
};

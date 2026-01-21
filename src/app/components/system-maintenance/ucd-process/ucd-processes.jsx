import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import TouchAppOutlinedIcon from '@material-ui/icons/TouchAppOutlined';
import { useSnackbar } from 'notistack';

import ChplUcdProcessEdit from './ucd-process-edit';
import ChplUcdProcessesView from './ucd-processes-view';

import {
  useDeleteUcdProcess,
  useFetchUcdProcesses,
  usePostUcdProcess,
  usePutUcdProcess,
} from 'api/standards';

function ChplUcdProcesses() {
  const { data, isLoading, isSuccess } = useFetchUcdProcesses();
  const deleteUcdProcess = useDeleteUcdProcess();
  const postUcdProcess = usePostUcdProcess();
  const putUcdProcess = usePutUcdProcess();
  const { enqueueSnackbar } = useSnackbar();
  const [activeUcdProcess, setActiveUcdProcess] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const [ucdProcesses, setUcdProcesses] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  let handleDispatch;

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setUcdProcesses(data);
  }, [data, isLoading, isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveUcdProcess(undefined);
        setIsProcessing(false);
        break;
      case 'delete':
        setErrors([]);
        setIsProcessing(true);
        deleteUcdProcess.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('UCD Process Deleted', {
              variant: 'success',
            });
            setActiveUcdProcess(undefined);
            setIsProcessing(false);
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
            setIsProcessing(false);
          },
        });
        break;
      case 'edit':
        setActiveUcdProcess(payload);
        setErrors([]);
        break;
      case 'save':
        setErrors([]);
        setIsProcessing(true);
        if (payload.id) {
          putUcdProcess.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('UCD Process Updated', {
                variant: 'success',
              });
              setActiveUcdProcess(undefined);
              setIsProcessing(false);
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
              setIsProcessing(false);
            },
          });
        } else {
          postUcdProcess.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('UCD Process Created', {
                variant: 'success',
              });
              setActiveUcdProcess(undefined);
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

  if (activeUcdProcess) {
    return (
      <Card>
        <CardHeader title={(
          <>
            <TouchAppOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`${activeUcdProcess.id ? 'Edit' : 'Add'} UCD Process`}
          </>
)} />
        <CardContent>
          <ChplUcdProcessEdit
            ucdProcess={activeUcdProcess}
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
            UCD Processes
            <TouchAppOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </>
)}
      />
      <CardContent>
        { (deleteUcdProcess.isLoading || postUcdProcess.isLoading || putUcdProcess.isLoading)
          && (
            <CircularProgress />
          )}
        <ChplUcdProcessesView
          ucdProcesses={ucdProcesses}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplUcdProcesses;

ChplUcdProcesses.propTypes = {
};

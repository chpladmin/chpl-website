import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplQmsStandardEdit from './qms-standard-edit';
import ChplQmsStandardsView from './qms-standards-view';

import {
  useDeleteQmsStandard,
  useFetchQmsStandards,
  usePostQmsStandard,
  usePutQmsStandard,
} from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplQmsStandards() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchQmsStandards();
  const deleteQmsStandard = useDeleteQmsStandard();
  const postQmsStandard = usePostQmsStandard();
  const putQmsStandard = usePutQmsStandard();
  const { enqueueSnackbar } = useSnackbar();
  const [activeQmsStandard, setActiveQmsStandard] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const [qmsStandards, setQmsStandards] = useState([]);
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="qmsStandards.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        QMS Standards
      </Button>,
    );
    append(
      <Button
        key="qmsStandards.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        QMS Standards
      </Button>,
    );
    display('qmsStandards.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setQmsStandards(data);
  }, [data, isLoading, isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveQmsStandard(undefined);
        display('qmsStandards.viewall.disabled');
        hide('qmsStandards.viewall');
        hide('qmsStandards.add.disabled');
        hide('qmsStandards.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        deleteQmsStandard.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('QMS Standard Deleted', {
              variant: 'success',
            });
            setActiveQmsStandard(undefined);
            display('qmsStandards.viewall.disabled');
            hide('qmsStandards.viewall');
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveQmsStandard(payload);
        setErrors([]);
        display('qmsStandards.viewall');
        hide('qmsStandards.viewall.disabled');
        break;
      case 'save':
        setErrors([]);
        if (payload.id) {
          putQmsStandard.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('QMS Standard Updated', {
                variant: 'success',
              });
              setActiveQmsStandard(undefined);
              display('qmsStandards.viewall.disabled');
              hide('qmsStandards.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postQmsStandard.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('QMS Standard Created', {
                variant: 'success',
              });
              setActiveQmsStandard(undefined);
              display('qmsStandards.viewall.disabled');
              hide('qmsStandards.viewall');
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

  if (activeQmsStandard) {
    return (
      <Card>
        <CardHeader title={`${activeQmsStandard.id ? 'Edit' : 'Add'} QMS Standard`} />
        <CardContent>
          <ChplQmsStandardEdit
            qmsStandard={activeQmsStandard}
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
      <CardHeader title="QMS Standards" />
      <CardContent>
        { (deleteQmsStandard.isLoading || postQmsStandard.isLoading || putQmsStandard.isLoading)
          && (
            <CircularProgress />
          )}
        <ChplQmsStandardsView
          qmsStandards={qmsStandards}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplQmsStandards;

ChplQmsStandards.propTypes = {
};

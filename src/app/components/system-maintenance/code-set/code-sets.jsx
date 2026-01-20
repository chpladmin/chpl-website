import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import { useSnackbar } from 'notistack';

import ChplCodeSetEdit from './code-set-edit';
import ChplCodeSetsView from './code-sets-view';

import {
  useDeleteCodeSet,
  useFetchCriteriaForCodeSets,
  useFetchCodeSets,
  usePostCodeSet,
  usePutCodeSet,
} from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplCodeSets() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchCodeSets();
  const deleteCodeSet = useDeleteCodeSet();
  const postCodeSet = usePostCodeSet();
  const putCodeSet = usePutCodeSet();
  const criterionOptionsQuery = useFetchCriteriaForCodeSets();
  const { enqueueSnackbar } = useSnackbar();
  const [activeCodeSet, setActiveCodeSet] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [codeSets, setCodeSets] = useState([]);
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="codeSets.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Code Sets
      </Button>,
    );
    append(
      <Button
        key="codeSets.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        Code Sets
      </Button>,
    );
    display('codeSets.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setCodeSets(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (criterionOptionsQuery.isLoading || !criterionOptionsQuery.isSuccess) { return; }
    setCriterionOptions(criterionOptionsQuery.data);
  }, [criterionOptionsQuery.data, criterionOptionsQuery.isLoading, criterionOptionsQuery.isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveCodeSet(undefined);
        setIsProcessing(false);
        display('codeSets.viewall.disabled');
        hide('codeSets.viewall');
        hide('codeSets.add.disabled');
        hide('codeSets.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        setIsProcessing(true);
        deleteCodeSet.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('Code Set Deleted', {
              variant: 'success',
            });
            setActiveCodeSet(undefined);
            setIsProcessing(false);
            display('codeSets.viewall.disabled');
            hide('codeSets.viewall');
          },
          onError: (error) => {
            setIsProcessing(false);
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveCodeSet(payload);
        setErrors([]);
        display('codeSets.viewall');
        hide('codeSets.viewall.disabled');
        break;
      case 'save':
        setErrors([]);
        setIsProcessing(true);
        if (payload.id) {
          putCodeSet.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Code Set Updated', {
                variant: 'success',
              });
              setActiveCodeSet(undefined);
              setIsProcessing(false);
              display('codeSets.viewall.disabled');
              hide('codeSets.viewall');
            },
            onError: (error) => {
              setIsProcessing(false);
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postCodeSet.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('Code Set Created', {
                variant: 'success',
              });
              setActiveCodeSet(undefined);
              setIsProcessing(false);
              display('codeSets.viewall.disabled');
              hide('codeSets.viewall');
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

  if (activeCodeSet) {
    return (
      <Card>
        <CardHeader title={(
          <>
            <SettingsEthernetIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`${activeCodeSet.id ? 'Edit' : 'Add'} Code Set`}
          </>
)} />
        <CardContent>
          <ChplCodeSetEdit
            codeSet={activeCodeSet}
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
            Code Sets
            <SettingsEthernetIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </>
)}
      />
      <CardContent>
        <ChplCodeSetsView
          codeSets={codeSets}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplCodeSets;

ChplCodeSets.propTypes = {
};

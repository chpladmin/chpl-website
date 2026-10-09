import {
  createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState,
} from 'react';

// Lets one screen treat several independent formik forms as a single form: the
// owner learns whether any member is showing an error, and can validate all of
// them at once. Members outside a group (the default value) do nothing.
const FormGroupContext = createContext({
  register: () => () => {},
  report: () => {},
});
FormGroupContext.displayName = 'form-group';

// Owner side. Provide `group` through `FormGroupContext.Provider`.
const useFormGroup = () => {
  const members = useRef({});
  const [invalid, setInvalid] = useState({});

  const register = useCallback((id, validate) => {
    members.current[id] = validate;
    return () => {
      delete members.current[id];
      setInvalid(({ [id]: removed, ...rest }) => rest);
    };
  }, []);

  const report = useCallback((id, isInvalid) => {
    setInvalid((prev) => (!!prev[id] === isInvalid ? prev : { ...prev, [id]: isInvalid }));
  }, []);

  // Validates every member and marks its invalid fields touched, so their errors show
  const validateAll = useCallback(async () => {
    const results = await Promise.all(Object.values(members.current).map((validate) => validate()));
    return results.every(Boolean);
  }, []);

  const group = useMemo(() => ({ register, report }), [register, report]);

  return {
    group,
    hasErrors: Object.values(invalid).some(Boolean),
    validateAll,
  };
};

// Member side. A member only counts as invalid once a field showing an error has
// been touched, matching when formik fields display their error text. Pass
// `group` explicitly when the form belongs to the component that owns the group.
const useFormGroupMember = (formik, group) => {
  const context = useContext(FormGroupContext);
  const { register, report } = group ?? context;
  const id = useId();
  const latest = useRef(formik);
  latest.current = formik;

  const hasTouchedError = Object.keys(formik.errors).some((key) => formik.touched[key]);

  useEffect(() => {
    report(id, hasTouchedError);
  }, [id, report, hasTouchedError]);

  useEffect(() => register(id, async () => {
    const errors = await latest.current.validateForm();
    const touched = Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), latest.current.touched);
    await latest.current.setTouched(touched, false);
    return Object.keys(errors).length === 0;
  }), [id, register]);
};

export { FormGroupContext, useFormGroup, useFormGroupMember };

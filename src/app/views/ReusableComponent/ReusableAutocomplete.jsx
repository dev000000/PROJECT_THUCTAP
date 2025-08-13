import { useField, useFormikContext } from "formik";
import { TextField } from "@material-ui/core";
import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ReusableAutocomplete = ({
  name,
  options,
  label,
  displayData,
  isObject,
  size,
  variant,
  value,
  onChange,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const handleChange = (_, value) => {
    if (isObject != null && !isObject) {
      setFieldValue(name, value.value ? value.value : null);
    } else {
      setFieldValue(name, value ? value : null);
    }
  };
  const configAutocomplete = {
    ...field,
    ...otherProps,
    id: name,
    size: size ? size : "medium",
    options: options,
    
    getOptionLabel: (option) =>
      option[displayData ? displayData : "name"]
        ? option[displayData ? displayData : "name"]
        : "",
    getOptionSelected: (option, value) => option?.id === value?.id,
    onChange: onChange ? onChange : handleChange,
    value: field.value || null,
    renderInput: (params) => (
      <TextField
        {...params}
        variant={variant ? variant : "outlined"}
        label={label}
        error={meta && meta.touched && Boolean(meta.error)}
        helperText={meta && meta.touched && meta.error}
      />
    ),
  };

  return <Autocomplete {...configAutocomplete} />;
};

export default ReusableAutocomplete;

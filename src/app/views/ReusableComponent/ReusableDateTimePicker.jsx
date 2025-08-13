
import React from "react";
import { TextField } from "@material-ui/core";
import { useField } from "formik";

const ReusableDateTimePicker = ({
  name,
  size,
  variant,
  value,
  type,
  onChange,
  format,
  ...otherProps
}) => {
  const [field, meta] = useField(name);
  const configDateTimePicker = {
    ...field,
    ...otherProps,
    fullWidth: true,
    type: type ? type : "date",
    InputLabelProps: { shrink: true },
    variant: variant ? variant : "outlined",
    format: format ? format : "MM/dd/yyyy",
    size: size ? size : "medium"
  };
  if (value !== undefined) {
    configDateTimePicker.value = value;
    configDateTimePicker.onChange = onChange || (() => {});
  }
  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }
  return <TextField {...configDateTimePicker} />;
};

export default ReusableDateTimePicker;

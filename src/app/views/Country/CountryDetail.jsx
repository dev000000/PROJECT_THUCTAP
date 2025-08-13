import React, { useEffect, useState } from "react";
import { getCountry } from "./CountryService";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
}));
export default function CountryDetail() {
  const { id } = useParams();
  const [countryData, setCountryData] = useState(null);
  useEffect(() => {
    loadCountry();
    // }, [loadCountry]);
  }, []);

  async function loadCountry() {
    let data = await getCountry(id);
    setCountryData(data.data);
    console.log("data", data.data);
  }
  const classes = useStyles();
  return (
    <>
      <h2>Country detail</h2>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="outlined-basic" label="id" variant="outlined" style={{ margin: 8 }}  InputLabelProps={{ shrink: true }}  fullWidth margin="normal" value={countryData?.id} />
        <TextField id="outlined-basic" label="name" variant="outlined" style={{ margin: 8 }}  InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={countryData?.name}/>
        <TextField id="outlined-basic" label="code" variant="outlined" style={{ margin: 8 }}  InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={countryData?.code}/>
        <TextField id="outlined-basic" label="description" variant="outlined" style={{ margin: 8 }} InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={countryData?.description}/>
      </form>
    </>
  );
}

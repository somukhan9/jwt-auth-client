import React from "react";

// material ui
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const Form = ({ handleSubmit, handleChange, formState, btnType, btnName }) => {
  const classes = useStyles();

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <TextField
          type="email"
          name="email"
          id="email"
          label="Email"
          variant="outlined"
          value={formState.email}
          onChange={handleChange}
        />
        <br />
        <TextField
          type="password"
          name="password"
          id="password"
          label="Password"
          variant="outlined"
          value={formState.password}
          onChange={handleChange}
        />
        <br />
        <Button
          type={btnType}
          disabled={!formState.email || !formState.password}
          variant="contained"
          color="primary"
        >
          {btnName}
        </Button>
      </form>
    </div>
  );
};

export default Form;

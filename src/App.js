import React, { useState, useEffect } from "react";
import "./App.css";
import api from "./axios";
import Modal from "./Modal";
import Form from "./Form";

// material ui
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isSigningUp) {
      try {
        const { email, password } = formState;
        const res = await api.signUp({ email, password });
        const { accessToken, refreshToken } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        // gettting protected data
        api
          .getProtected()
          .then((res) => {
            setUser(res.data.user);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      } catch (error) {
        console.log(error.response.data.message);
        setError(error.response.data.message);
        setFormState({ email: "", password: "" });
      }
    } else {
      try {
        const { email, password } = formState;
        const res = await api.login({ email, password });
        const { accessToken, refreshToken } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        // gettting protected data
        api
          .getProtected()
          .then((res) => {
            setUser(res.data.user);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      } catch (error) {
        console.log(error.response.data.message);
        setError(error.response.data.message);
        setFormState({ email: "", password: "" });
      }
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      await api.logout(refreshToken);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    const getProtectedData = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const res = await api.getProtected();
          // console.log(res.data.user);
          setUser(res.data.user);
          setLoading(false);
        } catch (error) {
          setUser(null);
          console.error(error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    getProtectedData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography
          component="div"
          style={{ backgroundColor: "#cfe8fc", height: "100vh" }}
          className="container"
        >
          {!user &&
            (!isSigningUp ? (
              <Button
                variant="contained"
                style={{ marginBottom: "6px" }}
                onClick={() => setIsSigningUp((prevState) => !prevState)}
              >
                Don't have any account ?
              </Button>
            ) : (
              <Button
                variant="contained"
                style={{ marginBottom: "6px" }}
                onClick={() => setIsSigningUp((prevState) => !prevState)}
              >
                Already have an account ?
              </Button>
            ))}
          {error && <Modal text={error} setError={setError} />}

          {!user &&
            (isSigningUp ? (
              <Form
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                formState={formState}
                btnType="submit"
                btnName="Signup"
              />
            ) : (
              <Form
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                formState={formState}
                btnType="submit"
                btnName="Login"
              />
            ))}
          {user?.email && (
            <>
              <Typography variant="h4" component="h4">
                {user.email}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Typography>
      </Container>
    </div>
  );
}

export default App;

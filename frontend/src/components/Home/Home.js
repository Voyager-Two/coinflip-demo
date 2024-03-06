import React, {useEffect, useState} from "react";
import {Chip, Grid, Container, Grow, Paper, Typography, Button, FormControl, Radio, RadioGroup, FormControlLabel} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { jwtDecode } from "jwt-decode";
import Input from "../Login/Input";
import {styles} from "../Login/styles";
import { useDispatch } from "react-redux";
import * as api from "../../api";
import {WAGER} from "../../constants/actionTypes";
import * as messages from "../../messages";

const formDataInitVal = {
  amount_to_wager: 0,
  heads_or_tails: "heads",
};

const Home = () => {

  const user = localStorage.getItem("profile")
    ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
    : "null";
  const [formData, setFormData] = useState(formDataInitVal);
  // Store wager token state
  const [wagerTokens, setWagerTokens] = useState(0);
  const [pastTenWagers, setPastTenWagers] = useState([]);
  const isSingedIn = user;
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.wager(formData, user);
      setWagerTokens(data.new_balance);
      dispatch({ type: WAGER, data });
      if (data.wager && data.wager.win) {
        messages.success(data.message);
      } else {
        messages.info(data.message);
      }
    } catch (error) {
      messages.error(error.response.data.message);
    }
  };

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Display last 10 wagers
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.currentUserData();
        setWagerTokens(data.wager_tokens);
        setPastTenWagers(data.past_wagers);
        console.log('data', data);
      } catch (error) {
        messages.error(error.response.data.message);
      }
    };
    fetchUserData();
  }, [wagerTokens]);

  return (
    <Grow in>
      <Container component="main" maxWidth="md" sx={{ paddingTop: "10px", paddingBottom: "30px" }}>
        <Paper elevation={3}>
          {isSingedIn !== "null" && isSingedIn !== null ? (
            <div className="space-y-2">
              <Typography variant="h4" align="center" color="primary" sx={{ paddingTop: "30px", paddingBottom: "20px" }}>
                {`Play Coin Toss`}
              </Typography>

              <Typography variant="h6" align="center" color="default" sx={{ paddingTop: "0px", paddingBottom: "30px" }}>
                Tokens: <b>{wagerTokens}</b>
              </Typography>
                <form onSubmit={handleSubmit}>
                <Grid   container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                >
                  <Grid item lg>
                    <Input
                      name="amount_to_wager"
                      label="Wager Amount"
                      type="number"
                      min="0.00" max="10000.00" step="0.01"
                      handleChange={handleChange}
                      autoFocus
                    />
                  </Grid>
                  <Grid item lg sx={{ paddingTop: "15px", paddingBottom: "0px" }}>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="heads_or_tails"
                        onChange={handleChange}
                        defaultValue="heads"
                      >
                        <FormControlLabel value="heads" control={<Radio />} label="Heads" />
                        <FormControlLabel value="tails" control={<Radio />} label="Tails" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item sm>
                    <Button
                      type="submit"
                      sx={styles.submit}
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Play
                    </Button>
                  </Grid>
                </Grid>
              </form>

              {/* Table: past 10 coinflip result */}

              <TableContainer component={Paper} sx={{ paddingTop: "30px", paddingBottom: "0px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Balance</b></TableCell>
                      <TableCell align="right"><b>Game Result</b></TableCell>
                      <TableCell align="right"><b>Amount Wagered</b></TableCell>
                      <TableCell align="right"><b>Flip Result</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pastTenWagers.map((wager) => (
                      <TableRow
                        key={wager._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {wager.balance_after}
                        </TableCell>
                        <TableCell align="right">
                          {wager.multiplier > 2 && (
                            <b style={{ paddingRight: "10px" }}>
                              <Chip
                                size="small"
                                label={`Bonus x${wager.multiplier}`}
                                color="info"
                                variant="outlined"
                              />
                            </b>
                          )}
                          <b>
                            <Chip
                              size="small"
                              label={wager.win ? 'Win' : 'Loss'}
                              color={wager.win ? 'success' : 'error'}
                              variant="outlined"
                            />
                          </b>
                        </TableCell>
                        <TableCell  align="right">
                          {wager.amount_wagered}
                        </TableCell>
                        <TableCell align="right" style={{ textTransform: 'capitalize' }}>{wager.coin_flip_result}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </div>
          ) : (
            <Typography variant="h4" align="center" color="primary">
              Login to Play
            </Typography>
          )}
        </Paper>
      </Container>
    </Grow>
  );
};

export default Home;

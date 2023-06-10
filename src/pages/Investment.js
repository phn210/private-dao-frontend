import { Box, Grid, CircularProgress } from "@mui/material";
import InvestmentItem from "../components/InvestmentItem";
import { useState, useEffect } from "react";
import axios from "axios";
import FundManagerABI from "../common/abis/FundManager.json";
import { addresses, rpcProviders } from "../common/globalConf";
import { ethers } from "ethers";

function Investments() {
  const [daos, setDaos] = useState([]);
  const [activeFundingRound, setActiveFundingRound] = useState(true);
  const sepoliaProvider = rpcProviders.sepolia;
  const fundManager = new ethers.Contract(
    addresses.sepolia.FundManager,
    FundManagerABI,
    sepoliaProvider
  );

  useEffect(() => {
    async function getActiveDaos() {
      const counter = await fundManager.fundingRoundCounter();
      const state = await fundManager.getFundingRoundState(counter - 1);
      console.log("current funding round state: ", state);
      if (state > 3) {
        setActiveFundingRound(false);
      } else {
        setActiveFundingRound(true);
        const daoList = await fundManager.getListDAO(counter - 1);
        const data = await axios
          .get(`http://35.197.144.121:5000/api/daos?addresses=${daoList}`)
          .then((res) => res.data);
        console.log(data.daos);
        setDaos(daoList.map((item) => data.daos[item]));
      }

      // console.log(data.daos);
      // setDaos(data.daos);
    }
    getActiveDaos();
  }, []);

  return (
    <Box>
      <Box py={2} fontSize="32px" color="white">
        Current funding round
      </Box>
      {activeFundingRound ? (
        daos.length === 0 ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {daos.map((item) => (
              <>
                <Grid item xs={4}>
                  <InvestmentItem {...item} />
                </Grid>
              </>
            ))}
          </Grid>
        )
      ) : (
        <Box
          fontSize="20px"
          fontWeight="600"
          color="#FFF"
          display="flex"
          justifyContent="center"
        >
          There is no active funding round!
        </Box>
      )}
    </Box>
  );
}
export default Investments;

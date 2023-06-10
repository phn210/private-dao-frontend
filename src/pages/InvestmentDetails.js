import {
  Box,
  Paper,
  Typography,
  Button,
  Input,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectDescription from "../components/ProjectDetails/ProjectDescription";
import axios from "axios";
import { useState, useEffect } from "react";
import { addresses, rpcProviders } from "../common/globalConf";
import { BigNumber, ethers } from "ethers";
import FundManagerABI from "../common/abis/FundManager.json";
import DKGABI from "../common/abis/DKG.json";
import * as dkgUtils from "distributed-key-generation";

function InvestmentDetails({ address }) {
  const navigate = useNavigate();
  const [daoDetails, setDaoDetails] = useState(null);
  const [balance, setMaxBalance] = useState(0);
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const sepoliaProvider = rpcProviders.sepolia;

  const fundManager = new ethers.Contract(
    addresses.sepolia.FundManager,
    FundManagerABI,
    sepoliaProvider
  );

  const dkg = new ethers.Contract(
    addresses.sepolia.DKG,
    DKGABI,
    sepoliaProvider
  );

  async function handleFunding() {
    setIsLoading(true);
    // get dkg public key
    const fundingRoundCounter = await fundManager.fundingRoundCounter();
    const currentFundingRound = await fundManager.fundingRounds(
      fundingRoundCounter - 1
    );
    const fundingRoundRequest = await fundManager.requests(
      currentFundingRound.requestID
    );
    const pubkey = (
      await dkg.getPublicKey(fundingRoundRequest.distributedKeyID)
    ).map((item) => BigInt(item._hex));

    // get funding round vector
    let daoList = await fundManager.getListDAO(fundingRoundCounter - 1);

    const data = await axios
      .get(`http://35.197.144.121:5000/api/daos?addresses=${daoList}`)
      .then((res) => res.data);
    daoList = daoList.map((item) => BigInt(item));
    console.log("DAO List", daoList);

    const fundingVector = Object.values(data.daos).map((item) => {
      if (item._id == parseInt(location.pathname.split("/").at(-1))) {
        return 1;
      } else return 0;
    });

    console.log("funding vector: ", fundingVector);

    //create funding input
    const valueInWei = BigInt(ethers.utils.parseEther(value.toString()));
    const fundInput = dkgUtils.Voter.getFund(
      pubkey,
      daoList,
      valueInWei,
      fundingVector
    );
    const parsedInput = JSON.parse(
      JSON.stringify(fundInput.circuitInput, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    // generate proof
    let { proof, publicInput } = await window.snarkjs.groth16.fullProve(
      parsedInput,
      "/fund_dim3.wasm",
      "/fund_dim3_final.zkey"
    );
    proof = dkgUtils.Utils.genSolidityProof(proof.pi_a, proof.pi_b, proof.pi_c);

    const txData = await fundManager.populateTransaction
      .fund(
        fundingRoundCounter - 1,
        fundInput.commitment,
        fundInput.Ri,
        fundInput.Mi,
        proof
      )
      .then((tx) => tx.data);
    const address = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((res) => res[0]);
    const params = [
      {
        from: address,
        to: addresses.sepolia.FundManager,
        value: ethers.utils.parseEther(value.toString())._hex,
        data: txData,
      },
    ];
    console.log("params: ", params);
    await window.ethereum
      .request({
        method: "eth_sendTransaction",
        params,
      })
      .then((res) => {
        const note = {
          commitment: fundInput.commitment,
          votingPower: valueInWei,
          nullifier: fundInput.circuitInput.nullifier,
        };
        const parsedNote = JSON.parse(
          JSON.stringify(note, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
        window.localStorage.setItem(
          location.pathname.split("/").at(-1),
          JSON.stringify(parsedNote)
        );
        console.log(res);
      })
      .catch((err) => console.log(err));

    setIsLoading(false);
  }

  useEffect(() => {
    async function getDaoDetails() {
      const data = await axios
        .get(
          `http://35.197.144.121:5000/api/daos/${location.pathname
            .split("/")
            .at(-1)}`
        )
        .then((res) => res.data);
      setDaoDetails(data.dao);
    }
    getDaoDetails();
  }, [location.pathname]);

  useEffect(() => {
    async function getMaxBalance() {
      if (address === "") setMaxBalance(0);
      else
        setMaxBalance(
          (await sepoliaProvider.getBalance(address))
            .div(ethers.utils.parseUnits("1", 16))
            .toNumber()
        );
    }
    getMaxBalance();
  }, [address]);

  function handleChange(event) {
    setValue(event.target.value);
  }

  function ProjectName({ name }) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        pb={5}
        width="100%"
      >
        <Typography
          sx={{
            color: "#FFF",
            fontWeight: "600",
            fontSize: "30px",
            fontFamily: "inherit",
          }}
        >
          {name}
        </Typography>
        <Box
          children={<Paper />}
          sx={{
            background: "#FFF",
            height: "4px",
            width: `${22 * name.length}px`,
          }}
        ></Box>
      </Box>
    );
  }

  function BackButton() {
    return (
      <Button
        disableTouchRipple
        onClick={() => navigate(-1)}
        sx={{
          color: "white",
          textDecoration: "underline",
          fontSize: "15px",
          ":hover": {
            textDecoration: "underline",
          },
        }}
      >
        {" "}
        <ChevronLeftIcon /> Back
      </Button>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      width="100%"
    >
      {daoDetails === null ? (
        <CircularProgress />
      ) : (
        <>
          <ProjectName name={daoDetails.name} />
          <Box alignSelf="flex-start">
            <BackButton />
          </Box>
          <Box width="100%" border="1px solid #737373" borderRadius="15px">
            <ProjectDescription {...daoDetails} />
            <Box pl={5} pb={2} color="#FFF">
              <Box>Your balance is: {balance / 100} ETH</Box>
            </Box>
            <Box pb={5} display="flex" flexDirection="row">
              <Box
                width="20%"
                px={5}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box fontWeight="600" fontSize="20px" color="#FFF">
                  Amount:
                </Box>
                <Input
                  value={value}
                  type="number"
                  disableUnderline
                  color="#FFF"
                  sx={{
                    paddingLeft: "10px",
                    height: "100%",
                    color: "#FFF",
                    fontFamily: "inherit",
                    fontSize: "18px",
                    fontWeight: "500",
                    border: "2px solid #FFF",
                    borderRadius: "10px",
                    width: "65%",
                    "& input[type=number]": {
                      "-moz-appearance": "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                  }}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        disableTouchRipple
                        sx={{
                          width: "5%",
                          fontSize: "10px",
                          fontWeight: "600",
                          textTransform: "none",
                          color: "#FFF",
                          border: "1px solid #F5F5F5",
                          borderRadius: "10px",
                          fontFamily: "inherit",
                          marginRight: "5px",
                        }}
                        onClick={() => {
                          setValue(balance / 100);
                        }}
                      >
                        MAX
                      </Button>
                    </InputAdornment>
                  }
                />
              </Box>
              <Button
                onClick={async () => await handleFunding()}
                disableTouchRipple
                sx={{
                  width: "5%",
                  fontSize: "20px",
                  fontWeight: "600",
                  textTransform: "none",
                  color: "#FFF",
                  border: "1px solid #F5F5F5",
                  borderRadius: "10px",
                  fontFamily: "inherit",
                  marginRight: "2px",
                }}
              >
                {isLoading ? (
                  <CircularProgress
                    sx={{ color: "#FFF", fontSize: "inherit" }}
                  />
                ) : (
                  "Fund"
                )}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default InvestmentDetails;

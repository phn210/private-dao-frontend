import { Box, Typography, Paper, Input, Button } from "@mui/material";
import DAOManagerABI from "../common/abis/DAOManager.json";
import { addresses, rpcProviders } from "../common/globalConf";
import { BigNumber, ethers } from "ethers";
import axios from "axios";

function Apply({ address }) {
  const sepoliaProvider = rpcProviders.sepolia;
  const daoManager = new ethers.Contract(
    addresses.sepolia.DAOManager,
    DAOManagerABI,
    sepoliaProvider
  );

  // const daoConfig = {
  //   pendingPeriod: BigNumber.from("60"),
  //   votingPeriod: BigNumber.from("60"),
  //   tallyingPeriod: BigNumber.from("60"),
  //   timelockPeriod: BigNumber.from("60"),
  //   queueingPeriod: BigNumber.from("60"),
  // };

  async function handleSubmit() {
    const expectedId = Number(await daoManager.daoCounter());
    const txCalldata = await daoManager.populateTransaction
      .createDAO(BigNumber.from(expectedId), [
        BigNumber.from("10"),
        BigNumber.from("120"),
        BigNumber.from("80"),
        BigNumber.from("10"),
        BigNumber.from("10"),
      ])
      .then((tx) => tx.data);
    console.log(txCalldata);
    const params = [
      {
        from: address,
        to: addresses.sepolia.DAOManager,
        value: ethers.utils.parseEther("0")._hex,
        data: txCalldata,
      },
    ];
    console.log(params);
    await window.ethereum
      .request({
        method: "eth_sendTransaction",
        params,
      })
      .then(async (res) => {
        await axios
          .post(`http://35.197.144.121:5000/api/daos`, {
            dao: {
              daoId: expectedId,
              name: `Mock DAO ${expectedId}`,
              description: "This is a mock DAO for test purpose",
              website: "mock.com",
              contact: "contact@mock.com"
            },
          })
          .catch((err) => console.log(err));
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  // console.log(dkgUtils.BabyJub);
  return (
    <Box p={2} border="1px solid #737373" borderRadius="15px">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        pb={5}
      >
        <Typography
          sx={{
            color: "#FFF",
            fontWeight: "600",
            fontSize: "30px",
            fontFamily: "inherit",
          }}
        >
          Apply for a funding round
        </Typography>
        <Box
          children={<Paper />}
          sx={{
            background: "#FFF",
            height: "4px",
            width: `${22 * 25}px`,
          }}
        ></Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Box color="#FFF" width="70%">
          <Box
            my={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Project Name: </Box>
            <Input
              type="text"
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
                width: "80%",
              }}
            ></Input>
          </Box>
          {/* ----------------------- */}
          <Box
            my={3}
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>Description: </Box>
            <Input
              multiline
              rows={10}
              type="text"
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
                width: "80%",
              }}
            ></Input>
          </Box>
          {/* ----------------------- */}
          <Box
            my={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Website: </Box>
            <Input
              type="text"
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
                width: "80%",
              }}
            ></Input>
          </Box>
          {/* ----------------------- */}
          <Box
            my={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Contact: </Box>
            <Input
              type="text"
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
                width: "80%",
              }}
            ></Input>
          </Box>
          {/* ----------------------- */}
          {/* <Box
            my={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Target: </Box>
            <Box display="flex" width="80%" alignItems="center">
              <Input
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
                  width: "10%",
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
              ></Input>
              <Box>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75M5.75 13.5L12 22.25l6.25-8.75L12 17.25L5.75 13.5Z"
                  />
                </svg>
              </Box>
            </Box>
          </Box> */}
          {/* ----------------------- */}

          <Box
            my={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box></Box>
            <Box>
              <Button
                onClick={async () => {
                  await handleSubmit();
                }}
                disableTouchRipple
                sx={{
                  textTransform: "none",
                  color: "#FFF",
                  border: "1px solid #F5F5F5",
                  borderRadius: "10px",
                  fontFamily: "inherit",
                  marginRight: "2px",
                }}
              >
                Continue
              </Button>
            </Box>
          </Box>
          {/* ----------------------- */}
        </Box>
      </Box>
    </Box>
  );
}

export default Apply;

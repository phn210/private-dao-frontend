import { Box, Button, Input, CircularProgress } from "@mui/material";
import DAOManagerABI from "../../common/abis/DAOManager.json";
import DAOABI from "../../common/abis/DAO.json";
import { addresses, rpcProviders } from "../../common/globalConf";
import { ethers } from "ethers";
import { useState } from "react";
import axios from "axios";

function CreateProposalModal({ id }) {
  const sepoliaProvider = rpcProviders.sepolia;
  const daoManager = new ethers.Contract(
    addresses.sepolia.DAOManager,
    DAOManagerABI,
    sepoliaProvider
  );
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [receiver, setReceiver] = useState("");
  const [value, setValue] = useState(0);
  const [signature, setSignature] = useState("");
  const [calldata, setCalldata] = useState("");

  async function handleSubmitProposal() {
    setIsLoading(true);
    const daoAddress = await daoManager.daos(id);
    const dao = new ethers.Contract(daoAddress, DAOABI, sepoliaProvider);
    const address = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((res) => res[0]);
    const txCalldata = await dao.populateTransaction
      .propose(
        [
          [
            receiver,
            ethers.utils.parseEther(value.toString())._hex,
            signature,
            calldata,
          ],
        ],
        ethers.utils.hashMessage(
          await sepoliaProvider.getTransactionCount(address)
        )
      )
      .then((tx) => tx.data);
    const proposalID = (
      await dao.hashProposal(
        [
          [
            receiver,
            ethers.utils.parseEther(value.toString())._hex,
            signature,
            calldata,
          ],
        ],
        ethers.utils.hashMessage(
          await sepoliaProvider.getTransactionCount(address)
        )
      )
    ).toString();
    const params = [
      {
        from: address,
        to: daoAddress,
        value: "0x0",
        data: txCalldata,
      },
    ];

    await window.ethereum
      .request({
        method: "eth_sendTransaction",
        params,
      })
      .then(async (res) => {
        await axios
          .post(`http://35.197.144.121:5000/api/daos/${id}/proposals`, {
            proposal: {
              daoId: id,
              proposalId: proposalID,
              title: name,
              description: description,
            },
          })
          .catch((err) => console.log(err));
        console.log(res);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgb(25,25,25)",
        width: "40%",
        height: "65%",
        borderRadius: "15px",
        overflowY: "scroll",
      }}
      color="#FFF"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
    >
      <Box fontSize="25px" fontWeight="700">
        Create Proposal
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        my={4}
        mx={3}
        width="90%"
      >
        <Box
          mb={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="80%"
        >
          <Box width="100%" display="flex" justifyContent="flex-start" pb={2}>
            Title:
          </Box>
          <Box width="100%" display="flex" justifyContent="flex-start" pb={1}>
            <Input
              value={name}
              required
              type="text"
              disableUnderline
              color="#FFF"
              onChange={(e) => setName(e.target.value)}
              sx={{
                paddingLeft: "10px",
                height: "100%",
                color: "#FFF",
                fontFamily: "inherit",
                fontSize: "18px",
                fontWeight: "500",
                border: "2px solid #FFF",
                borderRadius: "10px",
                width: "100%",
              }}
            ></Input>
          </Box>
        </Box>
        <Box
          mb={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="80%"
        >
          <Box width="100%" display="flex" justifyContent="flex-start" pb={2}>
            Description:{" "}
          </Box>
          <Box width="100%" display="flex" justifyContent="flex-start" pb={1}>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              type="text"
              multiline
              rows={4}
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
                width: "100%",
              }}
            ></Input>
          </Box>
        </Box>
        <Box
          mb={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="80%"
        >
          <Box width="100%" display="flex" justifyContent="flex-start" pb={2}>
            Receiver address:
          </Box>
          <Box width="100%" display="flex" justifyContent="flex-start" pb={1}>
            <Input
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              required
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
                width: "100%",
              }}
            ></Input>
          </Box>
        </Box>
        <Box
          mb={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="80%"
        >
          <Box width="100%" display="flex" justifyContent="flex-start" pb={2}>
            Function Signature:
          </Box>
          <Box width="100%" display="flex" justifyContent="flex-start" pb={1}>
            <Input
              required
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
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
                width: "100%",
              }}
            ></Input>
          </Box>
        </Box>
        <Box
          mb={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="80%"
        >
          <Box width="100%" display="flex" justifyContent="flex-start" pb={2}>
            Calldata:
          </Box>
          <Box width="100%" display="flex" justifyContent="flex-start" pb={1}>
            <Input
              value={calldata}
              onChange={(e) => setCalldata(e.target.value)}
              required
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
                width: "100%",
              }}
            ></Input>
          </Box>
        </Box>
        <Box
          mb={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="80%"
        >
          <Box width="100%" display="flex" justifyContent="flex-start" pb={2}>
            Value:
          </Box>
          <Box width="100%" display="flex" justifyContent="flex-start" pb={1}>
            <Input
              required
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
                width: "100%",
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
          </Box>
        </Box>
      </Box>
      <Box mr={4} alignSelf="flex-end">
        <Button
          onClick={async () => await handleSubmitProposal()}
          sx={{
            textTransform: "none",
            color: "#FFF",
            border: "1px solid #F5F5F5",
            borderRadius: "10px",
            fontFamily: "inherit",
            marginRight: "2px",
            width: "100px",
          }}
        >
          {isLoading ? (
            <CircularProgress sx={{ color: "#FFF" }} size={25} />
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default CreateProposalModal;

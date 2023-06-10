import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DAOABI from "../../common/abis/DAO.json";
import DAOManagerABI from "../../common/abis/DAOManager.json";
import DKGABI from "../../common/abis/DKG.json";
import { addresses, rpcProviders } from "../../common/globalConf";
import { ethers } from "ethers";
import axios from "axios";
import * as dkgUtils from "distributed-key-generation";

const options = ["NAY", "YAY", "ABSTAIN"];
const stateMapping = [
  "Pending",
  "Active",
  "Tallying",
  "Canceled",
  "Failed",
  "Succeeded",
  "Queued",
  "Expired",
  "Executed",
];

const votingVectors = {
  yay: [0, 1, 0],
  nay: [1, 0, 0],
  abstain: [0, 0, 1],
};
function ActiveProposal({
  title,
  proposers,
  state,
  description,
  closeAt,
  proposalId,
  daoId,
}) {
  async function handleVote(option) {
    const sepoliaProvider = rpcProviders.sepolia;
    // load note from local storage
    const note = JSON.parse(window.localStorage.getItem(parseInt(daoId)));

    const daoManager = new ethers.Contract(
      addresses.sepolia.DAOManager,
      DAOManagerABI,
      sepoliaProvider
    );
    const dkg = new ethers.Contract(
      addresses.sepolia.DKG,
      DKGABI,
      sepoliaProvider
    );
    // get dao address
    const daoAddress = await daoManager.daos(daoId);
    console.log(daoAddress);
    const dao = new ethers.Contract(daoAddress, DAOABI, sepoliaProvider);

    // get sender addres
    const sender = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((res) => res[0]);

    // get dkg key
    const proposalRequestId = await dao.getProposalRequestId(
      BigInt(proposalId)
    );
    const pubkey = (await dkg.getPublicKey(proposalRequestId)).map((item) =>
      BigInt(item._hex)
    );

    // mapping votting vector
    const votingVector = votingVectors[option.toLowerCase()];

    // get tree
    const tree = await axios
      .get("http://35.197.144.121:5000/api/merkle-tree")
      .then((res) => res.data.data);
    const voteInput = dkgUtils.Voter.getVote(
      pubkey,
      BigInt(daoId),
      BigInt(proposalId),
      votingVector,
      BigInt(note.votingPower),
      BigInt(note.nullifier),
      tree[note.commitment].pathIndices,
      tree[note.commitment].pathPosition,
      tree[note.commitment].pathRoot
    );
    const parsedInput = JSON.parse(
      JSON.stringify(voteInput.circuitInput, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    let { proof, publicInput } = await window.snarkjs.groth16.fullProve(
      parsedInput,
      "/vote_dim3.wasm",
      "/vote_dim3_final.zkey"
    );

    proof = dkgUtils.Utils.genSolidityProof(proof.pi_a, proof.pi_b, proof.pi_c);

    let voteData = [
      tree[note.commitment].pathRoot,
      voteInput.circuitInput.nullifierHash,
      voteInput.Ri,
      voteInput.Mi,
      proof,
    ];
    const txCalldata = await dao.populateTransaction
      .castVote(BigInt(proposalId), voteData)
      .then((tx) => tx.data);

    const params = [
      {
        from: sender,
        to: daoAddress,
        value: 0,
        data: txCalldata,
      },
    ];

    await window.ethereum
      .request({
        method: "eth_sendTransaction",
        params,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  return (
    <Box my={2} border="1px solid #737373" borderRadius="15px">
      <Box display="flex" justifyContent="space-between" mx={4} mt={2}>
        <Box
          width="6%"
          backgroundColor="#0052CC"
          borderRadius="15px"
          display="flex"
          justifyContent="center"
          py={1}
        >
          {stateMapping[state]}
        </Box>
        <Box>{closeAt}</Box>
      </Box>
      <Accordion
        sx={{
          "& .MuiAccordionSummary-root": {
            margin: 0,
          },
          "&.MuiPaper-root": {
            borderRadius: 4,
            paddingY: 1,
            paddingX: 2,
            color: "white",
            background: "#000",
          },
          "&.MuiAccordion-root:before": {
            position: "relative",
          },
          "&	.MuiSvgIcon-root": {
            fontSize: "4rem",
            color: "#FFF",
            padding: 0,
            margin: 0,
          },
          "& .Mui-expanded .MuiTypography-root": {
            color: "#FFFFFC",
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" flexDirection="column">
            <Box mb={1}>
              {title} by {proposers}
            </Box>
            <Box mb={1}>{description}</Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {state == 1 ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              {options.map((item) => (
                <Button
                  sx={{
                    border: "1px solid #F5F5F5",
                    borderRadius: "15px",
                    width: "90%",
                    margin: "5px 0 5px 0",
                    color: "#FFF",
                    fontWeight: "900",
                    fontSize: "18px",
                  }}
                  onClick={async (item) => await handleVote(item)}
                >
                  {item}
                </Button>
              ))}
            </Box>
          ) : (
            <></>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default ActiveProposal;

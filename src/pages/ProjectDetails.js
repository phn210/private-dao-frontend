import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Modal,
  CircularProgress,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import { closedProposals, activeProposals } from "../mockData";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectDescription from "../components/ProjectDetails/ProjectDescription";
import AddIcon from "@mui/icons-material/Add";
import ClosedProposal from "../components/ProjectDetails/ClosedProposal";
import ActiveProposal from "../components/ProjectDetails/ActiveProposal";
import CreateProposalModal from "../components/modal/CreateProposalModal";
import axios from "axios";

function ProjectDetails() {
  const [openModal, setOpenModal] = useState(false);
  const [daoDetails, setDaoDetails] = useState(null);
  const [activeProposals, setActiveProposals] = useState([]);
  const [closedProposals, setClosedProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function getInitialData() {
      setIsLoading(true);
      const data = await axios
        .get(
          `http://35.197.144.121:5000/api/daos/${location.pathname
            .split("/")
            .at(-1)}`
        )
        .then((res) => res.data);
      console.log(data);
      setDaoDetails(data.dao);
      const proposals = await axios
        .get(
          `http://35.197.144.121:5000/api/daos/${location.pathname
            .split("/")
            .at(-1)}/proposals`
        )
        .then((res) => res.data.proposals);
      setActiveProposals(
        Object.values(proposals).filter(
          (item) => item.state >= 0 && item.state <= 3
        )
      );
      setClosedProposals(
        Object.values(proposals).filter(
          (item) => item.state >= 4 && item.state <= 8
        )
      );
      setIsLoading(false);
    }
    getInitialData();
  }, [location.pathname]);

  const navigate = useNavigate();
  function handleCreateProposal() {
    setOpenModal(true);
  }

  function ProjectName({ name }) {
    return (
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
    >
      {daoDetails == null ? (
        <CircularProgress />
      ) : (
        <>
          <ProjectName {...daoDetails} />
          <Box alignSelf="flex-start">
            <BackButton />
          </Box>
          <Box width="100%" border="1px solid #737373" borderRadius="15px">
            <ProjectDescription {...daoDetails} />
            <Box color="white" p={4}>
              <Box
                display="flex"
                justifyContent="space-between"
                sx={{
                  fontSize: "25px",
                  fontWeight: "600",
                }}
              >
                Proposals
                <Button
                  disableTouchRipple
                  sx={{
                    textTransform: "none",
                    color: "#FFF",
                    border: "1px solid #F5F5F5",
                    borderRadius: "10px",
                    fontFamily: "inherit",
                    marginRight: "2px",
                  }}
                  onClick={() => handleCreateProposal()}
                >
                  <AddIcon /> Create Proposal
                </Button>
              </Box>
              {isLoading ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {activeProposals.length === 0 ? (
                    <></>
                  ) : (
                    activeProposals.map((item) => <ActiveProposal {...item} />)
                  )}
                  {closedProposals.length === 0 ? (
                    <></>
                  ) : (
                    closedProposals.map((item) => <ClosedProposal {...item} />)
                  )}
                </Box>
              )}
            </Box>
          </Box>
          <Modal
            open={openModal}
            onClose={() => {
              setOpenModal(false);
            }}
          >
            <CreateProposalModal id={location.pathname.split("/").at(-1)} />
          </Modal>
        </>
      )}
    </Box>
  );
}

export default ProjectDetails;

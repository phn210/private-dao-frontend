import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
const colorTheme = {
  Pending: "#737373",
  Canceled: "#737373",
  Expired: "#737373",
  Succeeded: "#36B37E",
  Failed: "#DE350B",
};

function ClosedProposal({
  title,
  proposers,
  state,
  description,
  forVotes,
  againstVotes,
  abstainVotes,
  closeAt,
}) {
  return (
    <Box my={2} border="1px solid #737373" borderRadius="15px">
      <Box display="flex" justifyContent="space-between" mx={4} mt={2}>
        <Box
          width="6%"
          backgroundColor={colorTheme[stateMapping[state]]}
          borderRadius="15px"
          display="flex"
          justifyContent="center"
          py={1}
          mb={1}
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
          <Box display="flex" flexDirection="column" width="100%">
            <Box mb={1}>
              {title} by {proposers}
            </Box>

            <Box mb={1} width="100%">
              {description}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box py={1} display="flex" justifyContent="space-between">
            <Box
              sx={{
                backgroundColor: "rgba(149, 149, 149, 0.3)",
                width: `${forVotes}%`,
                height: "30px",
                borderRadius: "5px",
                color: "#FFF",
              }}
              pl={1}
              display="flex"
              alignItems="center"
            >
              YAY
            </Box>
            {forVotes}%
          </Box>
          <Box py={1} display="flex" justifyContent="space-between">
            <Box
              sx={{
                backgroundColor: "rgba(149, 149, 149, 0.3)",
                width: `${againstVotes}%`,
                height: "30px",
                borderRadius: "5px",
                color: "#FFF",
              }}
              pl={1}
              display="flex"
              alignItems="center"
            >
              NAY
            </Box>
            {againstVotes}%
          </Box>
          <Box py={1} display="flex" justifyContent="space-between">
            <Box
              sx={{
                backgroundColor: "rgba(149, 149, 149, 0.3)",
                width: `${abstainVotes}%`,
                height: "30px",
                borderRadius: "5px",
                color: "#FFF",
              }}
              pl={1}
              display="flex"
              alignItems="center"
            >
              ABSTAIN
            </Box>
            {abstainVotes}%
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default ClosedProposal;

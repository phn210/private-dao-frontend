import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TimerIcon from "@mui/icons-material/Timer";

function InvestmentItem({ name, _id, closeAt, fundingExpected }) {
  const navigate = useNavigate();
  function handleNavigation(dest) {
    navigate(`/investments/${dest}`);
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        border: "1px #737373 solid",
        borderRadius: "20px",
        color: "white",
      }}
    >
      <Box
        my={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="90%"
      >
        <Box fontSize="50px" pb={1}>
          👾
        </Box>
        <Box
          py={1}
          sx={{
            fontSize: "32px",
          }}
        >
          {name}
        </Box>
        {/* <Box py={2} display="flex" alignItems="center">
          <TimerIcon />
          <Box
            sx={{
              paddingLeft: "5px",
              color: "#5EC854",
              fontSize: "15px",
              fontWeight: 400,
            }}
          >
            {closeAt}
          </Box>
        </Box> */}
        <Box
          py={1}
          display="flex"
          alignItems="center"
          sx={{
            fontSize: "20px",
          }}
        >
          Expected value funded: {fundingExpected}
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

        <Button
          sx={{
            height: "50px",
            width: "100%",
            color: "#FFF",
            borderRadius: "15px",
            border: "1px solid #242424",
            backgroundColor: "#242424",
            fontWeight: "500",
            fontSize: "18px",
            ":hover": {
              backgroundColor: "#242424",
            },
          }}
          onClick={() => handleNavigation(_id)}
        >
          Details
        </Button>
      </Box>
    </Box>
  );
}

export default InvestmentItem;

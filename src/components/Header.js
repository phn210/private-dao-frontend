import { Box, Button } from "@mui/material";
import { createContext, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const tabList = ["Investments", "Projects", "Apply"];

function Header({ address, setAddress }) {
  const location = useLocation().pathname.slice(1);
  const navigate = useNavigate();
  function handleConnectWallet() {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        setAddress(res[0]);
      });
    }
  }
  function handleNavigate(dest) {
    navigate(`/${dest}`);
  }

  function truncateString(str, num) {
    if (str.length > num || num <= 7) {
      return str.slice(0, num - 7) + "..." + str.slice(-3);
    } else {
      return str;
    }
  }

  return (
    <>
      <Box
        sx={{ color: "#FFF" }}
        height="100px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box alignSelf="flex-start">
          <Button
            disableTouchRipple
            sx={{ fontSize: "40px", fontWeight: "bold", color: "white" }}
          >
            THE PAO
          </Button>
        </Box>
        <Box display="flex" justifyContent="space-evenly" width="45%">
          {tabList.map((item) => (
            <Box alignSelf="center">
              <Button
                disableTouchRipple
                sx={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: `${
                    item.toLowerCase() === location ? "#54b3d6" : "white"
                  }`,
                  textTransform: "none",
                  ":hover": {
                    cursor: "pointer",
                    color: "#54b3d6",
                  },
                }}
                onClick={() => handleNavigate(item.toLowerCase())}
              >
                {item}
              </Button>
            </Box>
          ))}
          <Box>
            <Button
              sx={{
                border: "2px solid #54b3d6 ",
                borderRadius: "10px",
                color: "#54b3d6",
                textOverflow: "elipsis",
                overflow: "hidden",
                whiteSpace: "no-wrap",
              }}
              onClick={() => handleConnectWallet()}
            >
              {address !== "" ? truncateString(address, 18) : "connect wallet"}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Header;

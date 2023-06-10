import { Box, Typography, Link } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import { item } from "../../mockData";
function ProjectDescription({ description, contact, name, website }) {
  return (
    <Box display="flex" width="100%" color="#FFF">
      <Box width="60%" p={4}>
        <Typography sx={{ fontSize: "25px", fontWeight: "700" }}>
          Project Description
        </Typography>
        <Box py={1} />
        {description}
      </Box>
      <Box
        width="30%"
        m={4}
        p={3}
        border="1px solid #737373"
        borderRadius="15px"
      >
        <Box py={1} sx={{ fontSize: "20px", fontWeight: "600" }}>
          Project Data
        </Box>
        <Box color="#737373" py={1}>
          Project Site
        </Box>
        <Link
          color="#54b3d6"
          sx={{
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          {website}
        </Link>
        <Box color="#737373" py={1}>
          Relevant Links
        </Box>
        <Link
          color="#54b3d6"
          sx={{
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          {website}
        </Link>
        <Box color="#737373" py={1}>
          Socials
        </Box>
        <Box>
          <TwitterIcon /> <TelegramIcon />
        </Box>
        <Box color="#737373" py={1}>
          Contacts
        </Box>
        <Box>{contact}</Box>
      </Box>
    </Box>
  );
}

export default ProjectDescription;

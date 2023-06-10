import { Box, Grid, CircularProgress } from "@mui/material";
import ProjectItem from "../components/ProjectItem";
import axios from "axios";
import { useEffect, useState } from "react";

function Project() {
  const [daos, setDaos] = useState([]);
  useEffect(() => {
    async function getDaos() {
      const data = await axios
        .get("http://35.197.144.121:5000/api/funded-daos")
        .then((res) => res.data);
      setDaos(data.daos);
      console.log(data.daos);
      setDaos(Object.values(data.daos));
    }
    getDaos();
  }, []);

  return (
    <Box>
      <Box py={2} fontSize="32px" color="white">
        Funded Projects
      </Box>

      {daos.length === 0 ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {daos.map((item) => (
            <>
              <Grid item xs={4}>
                <ProjectItem {...item} />
              </Grid>
            </>
          ))}
        </Grid>
      )}
    </Box>
  );
}
export default Project;

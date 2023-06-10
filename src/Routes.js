import { BrowserRouter, Routes, Route } from "react-router-dom";
import Project from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Apply from "./pages/Apply";
import Investments from "./pages/Investment";
import InvestmentDetails from "./pages/InvestmentDetails";
import { useState, useContext, createContext } from "react";
import { Box } from "@mui/material";
const AddressContext = createContext(null);
function Router() {
  const [address, setAddress] = useState("");
  return (
    <BrowserRouter>
      <AddressContext.Provider value={address}>
        <Header address={address} setAddress={setAddress} />
        <Box paddingY="50px" />
        <Routes>
          <Route path="/" element={<Project />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/apply" element={<Apply address={address} />} />
          <Route path="/investments" element={<Investments />} />
          <Route
            path="/investments/:id"
            element={<InvestmentDetails address={address} />}
          />
        </Routes>
        <Footer />
      </AddressContext.Provider>
    </BrowserRouter>
  );
}

export default Router;

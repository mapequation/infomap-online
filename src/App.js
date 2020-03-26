import React from "react";
import Documentation from "./components/Documentation";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Infomap from "./components/Infomap";


function App() {
  return (
    <React.Fragment>
      <Header/>
      <Infomap/>
      <Documentation/>
      <Footer/>
    </React.Fragment>
  );
}

export default App;

import React from 'react';
import InfomapOnline from './components/Infomap';
import Header from "./components/Header";
import Documentation from "./components/Documentation";
import Footer from "./components/Footer";

function App() {
  return (
    <React.Fragment>
      <Header />
      <InfomapOnline />
      <Documentation />
      <Footer />
    </React.Fragment>
  );
}

export default App;

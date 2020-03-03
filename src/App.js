import React from 'react';
import InfomapOnline from './components/Infomap';
import Header from "./Header";
import Documentation from "./components/Documentation";
import Footer from "./Footer";

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

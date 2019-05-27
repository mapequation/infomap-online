import React from 'react';
import Infomap from './Infomap';
import Header from "./Header";
import Documentation from "./Documentation";
import Footer from "./Footer";

function App() {
  return (
    <React.Fragment>
      <Header />
      <Infomap />
      <Documentation />
      <Footer />
    </React.Fragment>
  );
}

export default App;

import React from 'react';
import InfomapOnline from './InfomapOnline';
import Header from "./Header";
import Documentation from "./Documentation";
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

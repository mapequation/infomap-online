import React from 'react';
import { Container, Grid, Header, Icon } from 'semantic-ui-react'
import './App.css';
import Infomap from './Infomap';

function App() {
  return (
    <div className="App">
      <Container>
        <Infomap />
        <Grid columns={2} className="documentation">
          <Grid.Column>
          <Header as="h1">Infomap Online</Header>
          <p>
            Infomap Online is a client-side web application that makes it possible for users to run <a href="https://www.mapequation.org/code.html">Infomap</a> without any installation. Everything is run locally on your computer and no data will be uploaded to any server. To support that, Infomap is compiled from C++ to JavaScript with <a href="https://emscripten.org/">Emscripten</a>. Note that this gives a performance penalty compared to the <a href="https://www.mapequation.org/code.html">stand-alone</a> version of Infomap.
          </p>
          </Grid.Column>
          <Grid.Column>
          <Header as="h1">Feedback</Header>
          <p>
            If you have any questions, suggestions or issues regarding the software, please add them to <a href="https://github.com/mapequation/infomap-online/issues"><Icon name="github"></Icon>GitHub issues</a>.
          </p>
          
          <Header as="h1">References</Header>
          <p>
            If you are using the software at mapequation.org in one of your research articles or otherwise want to refer to it, please cite <a href="https://www.mapequation.org/publications.html">relevant publication</a> or use the following format:
          </p>
          <p>
            D. Edler, A. Eriksson and M. Rosvall, The MapEquation software package, available online at <a href="https://www.mapequation.org">mapequation.org</a>.
          </p>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

export default App;

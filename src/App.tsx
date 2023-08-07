import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './graphql';
import SpaceXData from './SpaceXData';
import './App.css';
import background from "./images/clouds-space.jpg";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="Header-content">
        <h1 className="Heading-title">SpaceX Launches</h1>
        <SpaceXData />
      </div>
    </ApolloProvider>
  );
};

export default App;

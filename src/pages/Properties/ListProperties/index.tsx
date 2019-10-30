import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Property from 'components/Property';
import { PropertyModel } from 'models/property-model';

import { PROPERTIES_NAMES_QUERY } from './graphql';

const Properties = () => {
  const { loading, error, data } = useQuery(PROPERTIES_NAMES_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  // @TODO:  update the names since 'properties2' is not a proper name for the example
  const properties = data.properties2.map((property: PropertyModel) => (
    <Property key={`property-${property.id}`} property={property} />
  ));

  return (
    <div className="App">
      <header className="App-header">
        <h1>Properties</h1>
      </header>
      <div> {properties} </div>
    </div>
  );
};

export default Properties;
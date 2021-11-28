import React from 'react';
import RenderDetails from '../components/RenderMovieDetails';

const Details = ({ route, navigation }) => {
  const { id } = route.params;

  return (
    <>
      <RenderDetails navigation={navigation} id={id} />
    </>
  );
};

export default Details;

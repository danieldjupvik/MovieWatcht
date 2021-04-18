import React from 'react';
import RenderSeriesDetails from '../components/RenderSeriesDetails';

const SeriesDetails = ({ route, navigation }) => {
  const { id } = route.params;

  return (
    <>
      <RenderSeriesDetails navigation={navigation} id={id} />
    </>
  );
};

export default SeriesDetails;

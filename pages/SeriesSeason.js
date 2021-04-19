import React from 'react';
import RenderSeason from '../components/RenderSeason';

const SeriesSeason = ({ route, navigation }) => {
  const { id, season } = route.params;

  return (
    <>
      <RenderSeason navigation={navigation} id={id} season={season} />
    </>
  );
};

export default SeriesSeason;

import React, { useState, useEffect } from 'react';
import { detailsMovieUrl, apiKey } from '../settings/api';
import axios from 'axios';
import RenderDetails from '../components/RenderDetails';

const Details = ({ route, navigation }) => {
  const { id } = route.params;

  return (
    <>
      <RenderDetails navigation={navigation} id={id} />
    </>
  );
};

export default Details;

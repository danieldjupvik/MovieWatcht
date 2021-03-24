import React, { useState, useEffect } from 'react';
import { detailsMovieUrl, apiKey } from '../settings/api';
import axios from 'axios';
import RenderDetails from '../components/RenderDetails';

const Details = ({ route }) => {
  const [loader, setLoader] = useState(true);
  const { id } = route.params;

  const [movie, setMovie] = useState([]);
  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await axios.get(
          `${
            detailsMovieUrl +
            id +
            apiKey +
            '&append_to_response=credits,recommendations'
          }`
        );
        setMovie(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setTimeout(() => {
          setLoader(false);
        }, 500);
      }
    };
    getMovie();
  }, []);

  return (
    <>
      <RenderDetails movie={movie} loader={loader} />
    </>
  );
};

export default Details;

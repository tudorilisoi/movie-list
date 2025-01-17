import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/lazy";

//Components
import Video from "./Video";

import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

//Material-ui
import { makeStyles, Typography, Grid, useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  bgContainer: {},
}));

export default function MovieDetails({
  match: {
    params: { type: mediaType, id },
  },
}) {
  const classes = useStyles();
  const [movieInfo, setMovieInfo] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  // Media query
  const matches = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useEffect(() => {
    const loader = async () => {
      let movieResults, tvResults, videoResults;
      try {
        if (mediaType === "movie") {
          movieResults = await axios({
            method: "get",
            url: `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}`,
          });
          setMovieInfo(movieResults.data);
        }

        if (mediaType === "tv") {
          tvResults = await axios({
            method: "get",
            url: `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}`,
          });
          setMovieInfo(tvResults.data);
        }

        videoResults = await axios({
          method: "get",
          url: `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}`,
        });
        console.log(`🚀 ~ loader ~ videoResults`, videoResults);
        setVideos(videoResults.data.results);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    loader();
  }, [mediaType, id]);
  if (error) {
    return <p>Please retry</p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  console.log(`🚀 ~ movieInfo`, movieInfo);

  const {
    // id,
    original_title,
    overview,
    poster_path,
    backdrop_path,
    release_data,
    runtime,
    vote_average,
  } = movieInfo;

  const title = movieInfo.title || movieInfo.name;
  const movieBg = `https://image.tmdb.org/t/p/original/${backdrop_path}`;

  function makeVideoUrlArr() {
    let videosURL = [];
    videos.forEach((video) => {
      if (video.type === "Trailer" || video.type === "Teaser")
        return videosURL.push([`https://www.youtube.com/watch?v=${video.key}`]);
    });

    // console.log("Vide url: ", videosURL);
    return videosURL;
  }
  // console.log("Videos url: ", videos);

  return (
    <div>
      {/* Background container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -5,
        }}
      >
        {/* Background image */}
        <img
          src={movieBg}
          alt={`${title} poster`}
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            objectPosition: "50% 50%",
          }}
        />

        {/* Background overlay */}
        <div
          style={{
            position: "inherit",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background:
              "radial-gradient(circle, rgba(0,54,77,.8) 10% , rgba(0,11,15,0.98) 70%)",
          }}
        ></div>
      </div>
      {/* End background container */}

      <Grid
        container
        alignContent={"center"}
        style={
          matches
            ? {
                width: "100vw",
                height: "100vh",
                padding: "0 2.5rem",
              }
            : { width: "81.5vw", height: "100vh" }
        }
      >
        <Grid item lg={9} md={9} sm={12}>
          <Typography variant="h1">{title}</Typography>
        </Grid>
        {/* {videos.length > 1 ? (
        videos.map((video, index) => {
          <ReactPlayer
            key={index}
            url={`https://www.youtube.com/watch?v=${video.key}`}
          />;
        })
      ) : (
        <ReactPlayer url={`https://www.youtube.com/watch?v=${videos[0].key}`} />
      )} */}
        {/* {videos.map((video, index) => {
        console.log("one video: ", video.key);
        // debugger;
        <Video
          key={index}
          url={`https://www.youtube.com/watch?v=${video.key}`}
        />;
      })} */}
        {/* <ReactPlayer url={makeVideoUrlArr()} controls={true} playing={false} /> */}

        <Grid item lg={3} md={3} sm={12}>
          {makeVideoUrlArr().map((url, index) => (
            <ReactPlayer
              controls={true}
              width={350}
              height={200}
              key={index}
              url={url}
            />
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

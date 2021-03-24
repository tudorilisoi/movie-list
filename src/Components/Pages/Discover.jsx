import React, { useState, useEffect } from "react";

// Utils
import useSWR from "swr";

// Components
import MoviePagination from "../MoviePagination";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Discover() {
  const [pageIndex, setPageIndex] = useState(1);

  const { data, error } = useSWR(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&&page=${pageIndex}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log(data);

  return (
    <>
      <h2>Discover Page</h2>
      {/* <MoviePagination data={data} /> */}
    </>
  );
}

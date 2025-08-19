import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const counterValue = useSelector((state) => state.counter);
  console.log("This is the State : ", counterValue);

  return <div className="text-3xl font-bold underline ">Home</div>;
};

export default Home;

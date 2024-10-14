import React from "react";
import CardCarousel from "./CardCarousel";

const Cards = () => {
  return (
    <section className="text-gray-600 bg-white mt-2 ml-4  rounded-lg body-font">
      <div className=" px-6 py-4 mx-auto">
        <div className="flex flex-wrap w-full mb-4">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              All courses
            </h1>
            <div className="h-1 w-20 bg-orange-500 rounded"></div>
          </div>
        </div>
        <div className="flex flex-wrap ">
          <CardCarousel />
        </div>
      </div>
    </section>
  );
};

export default Cards;

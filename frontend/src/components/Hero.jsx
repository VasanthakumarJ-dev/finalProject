import React from "react";
import "./hero.css";
import frontend from "../assets/images/frontend.png";
const Hero = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 ">
            Learning meets technology
            <br className="hidden lg:inline-block" />
            <svg
              width="100%"
              height="20"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              className="mt-0"
            >
              <path
                d="M0,15 C30,5 70,5 100,15"
                stroke="#F97316"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            Learn from Experts
          </h1>

          <p className="mb-8 leading-relaxed">
            Our Online Learning Platform offers expert-led courses to master new
            skills, Join us now to achieve your goals through interactive
            methods, flexible schedule and community support.
          </p>
          <div className="flex justify-center">
            <a href="register">
              <button className="inline-flex text-white bg-orange-500 border-0 py-2 px-6 focus:outline-none hover:bg-orange-600 rounded text-lg">
                Signup
              </button>
            </a>
            <a href="login">
              <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                Login
              </button>
            </a>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img
            className="object-cover object-center rounded"
            alt="hero"
            src={frontend}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

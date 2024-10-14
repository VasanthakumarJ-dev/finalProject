import React, { useEffect, useState } from "react";
import Card from "./Card";
import { getCourses } from "../features/getCourses";

const CourseGrid = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(8); // default to 8

  useEffect(() => {
    getCourses("all").then((res) => {
      setCourses(res);
    });
  }, []);

  // Update the number of courses per page based on the screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCoursesPerPage(2); // 2 cards on small screens
      } else if (window.innerWidth < 768) {
        setCoursesPerPage(4); // 4 cards on medium screens
      } else {
        setCoursesPerPage(8); // 8 cards on large screens (2 rows of 4)
      }
    };

    handleResize(); // Call on initial load
    window.addEventListener("resize", handleResize); // Update on resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup
    };
  }, []);

  // Calculate the indices for the courses to display on the current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Calculate total pages
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  return (
    <div className="container mx-auto ">
      {/* Responsive grid layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {currentCourses.map((course, index) => (
          <Card data={course} key={index} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between mt-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseGrid;

// import React, { useEffect, useState } from "react";
// import {
//   CarouselProvider,
//   Slider,
//   Slide,
//   ButtonBack,
//   ButtonNext,
// } from "pure-react-carousel";
// import "pure-react-carousel/dist/react-carousel.es.css";
// import Card from "./Card";
// import useWindowDimensions from "../CustomHooks/useWindowDimensions";
// import { getCourses } from "../features/getCourses";

// const CardCarousel = () => {
//   const { height, width } = useWindowDimensions();

//   const [visbleSlides, setVisibleSlides] = useState(3);

//   const [dimensions, setDimensions] = useState({
//     h: 700,
//     w: 700,
//   });

//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     if (width > 1300) {
//       setVisibleSlides(4);
//       setDimensions({
//         h: 1500,
//         w: 700,
//       });
//     } else if (width < 1300 && width > 1024) {
//       setVisibleSlides(3);
//       setDimensions({
//         h: 850,
//         w: 400,
//       });
//     } else if (width < 1024 && width > 768) {
//       setVisibleSlides(2);
//       setDimensions({
//         h: 700,
//         w: 400,
//       });
//     } else {
//       setVisibleSlides(1);
//       setDimensions({
//         h: 450,
//         w: 400,
//       });
//     }
//   }, [height, width]);

//   useEffect(() => {
//     getCourses("all").then((res) => {
//       setCourses(res);
//     });
//   }, []);

//   const rows = [];
//   for (let i = 0; i < courses.length; i += 4) {
//     rows.push(courses.slice(i, i + 4));
//   }

//   // Create pairs of rows for each slide (2 rows per slide)
//   const slides = [];
//   for (let i = 0; i < rows.length; i += 2) {
//     slides.push(rows.slice(i, i + 2)); // Push pairs of rows
//   }
//   return (
//     <div className="container mx-auto p-5">
//       <CarouselProvider
//         naturalSlideWidth={dimensions.w}
//         naturalSlideHeight={dimensions.h}
//         infinite
//         step={1}
//         totalSlides={5}
//         visibleSlides={visbleSlides}
//       >
//         <Slider className="mb-2">
//           {slides.map((slide, slideIndex) => (
//             <Slide index={slideIndex} key={slideIndex}>
//               <div className="flex flex-col space-y-4">
//                 {" "}
//                 {/* Space between rows */}
//                 {slide.map((row, rowIndex) => (
//                   <div className="flex justify-between" key={rowIndex}>
//                     {row.map((course, idx) => (
//                       <Card data={course} key={idx} />
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </Slide>
//           ))}
//         </Slider>
//         <div className="flex ">
//           <div className=" mx-auto mt-2">
//             <ButtonBack className="  text-gray-900 bg-gray-100 border-0 py-2 px-8 focus:outline-none hover:bg-gray-400 rounded text-lg">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 width="24px"
//                 height="24px"
//               >
//                 <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
//               </svg>
//             </ButtonBack>
//             <ButtonNext className="  text-gray-900 bg-gray-100 border-0 py-2 px-8 focus:outline-none hover:bg-gray-400 rounded text-lg">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 width="24px"
//                 height="24px"
//               >
//                 <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
//               </svg>
//             </ButtonNext>
//           </div>
//         </div>
//       </CarouselProvider>
//     </div>
//   );
// };

// export default CardCarousel;

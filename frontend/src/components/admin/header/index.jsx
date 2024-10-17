import React, { useContext } from "react";
import { Bell } from "phosphor-react";
import { AuthContext } from "../../../CustomHooks/authContext";
const Header = () => {
  const { name } = useContext(AuthContext);
  console.log(name);
  // Get the current date and day
  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);

  return (
    <header className="flex justify-between mt-3 ml-4 h-16 rounded-lg items-center p-4 bg-white text-black">
      <div className="flex flex-col">
        <span className="text-lg text-gray-600">{formattedDate}</span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative">
          <Bell className="h-6 w-6 text-black" weight="bold" />

          {/* <span className="absolute top-0 right-0 bg-red-500 text-black rounded-full text-xs px-1">
            .
          </span> */}
        </button>
        <div className="h-8 w-px bg-gray-400" />
        <div className="flex flex-col items-end">
          <span className="text-lg">{name}</span>
          {/* <span className="text-xs text-black-400">ID: {employeeId}</span> */}
        </div>
      </div>
    </header>
  );
};

export default Header;

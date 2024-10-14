import React from "react";
import Sidebar from "../../components/employee/sidebar";
import "./index.css";
import Header from "../../components/employee/header";
const privateLayout = ({ children }) => {
  return (
    <div className="flex private-layout h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header employeeName={"vasanthakumar"} employeeId={"JMD364"} />
        <main className="w-full h-screen"> {children}</main>
      </div>
    </div>
  );
};

export default privateLayout;

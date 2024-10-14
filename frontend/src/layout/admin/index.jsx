import React from "react";
import Sidebar from "../../components/admin/sidebar";
import Header from "../../components/admin/header";
import "./index.css";
const AdminLayout = ({ children }) => {
  return (
    <div className="flex admin-layout  h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header employeeName={"vasanthakumar"} employeeId={"JMD364"} />
        <main className="w-full h-screen"> {children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

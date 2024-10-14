// AddCourseModal.js
import React from "react";
import { Modal, Button } from "antd";
import CourseManagement from "../addCourses";

const AddCourseModal = ({ showModal, setShowModal }) => {
  return (
    <Modal
      title="Add New Course"
      open={showModal}
      onCancel={() => setShowModal(false)}
      width={800}
      // footer={[
      //   <Button key="back" onClick={() => setShowModal(false)}>
      //     Cancel
      //   </Button>,
      //   <Button
      //     key="submit"
      //     type="primary"
      //     form="addCourseForm"
      //     htmlType="submit"
      //   >
      //     Submit
      //   </Button>,
      // ]}
    >
      <CourseManagement setShowModal={setShowModal} />
    </Modal>
  );
};

export default AddCourseModal;

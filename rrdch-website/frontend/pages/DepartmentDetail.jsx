import React from 'react';
import { useParams } from 'react-router-dom';

const DepartmentDetail = () => {
  const { id } = useParams();
  return (
    <div className="page department-detail-page">
      <h1>Department Details</h1>
      <p>Viewing specialization details for department ID: {id}</p>
    </div>
  );
};

export default DepartmentDetail;

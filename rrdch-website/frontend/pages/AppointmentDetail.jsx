import React from 'react';
import { useParams } from 'react-router-dom';

const AppointmentDetail = () => {
  const { id } = useParams();
  return (
    <div className="page appointment-detail-page">
      <h1>Appointment Details</h1>
      <p>Viewing details for appointment ID: {id}</p>
    </div>
  );
};

export default AppointmentDetail;

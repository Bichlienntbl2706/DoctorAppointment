// import React, { useEffect, useState } from "react";
// import AdminLayout from "../AdminLayout/AdminLayout";
// import "./Appointments.css";
// import axios from "axios";
// import userImg from "../../../images/avatar.jpg";

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get("http://localhost:5050/api/v1/appointment");
//         if (response.status === 200 && response.data.success) {
//           const appointmentsData = response.data.data;
//           console.log("Appointments Data:", appointmentsData); // Log dữ liệu appointmentsData để kiểm tra
//           setAppointments(appointmentsData);
//         } else {
//           console.error("Error fetching appointments:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   // Hàm để chỉ lấy ngày từ chuỗi ngày giờ
//   const formatDate = (datetime) => {
//     const date = new Date(datetime);
//     return date.toLocaleDateString(); // Trả về chỉ ngày
//   };

//   // Hàm để chỉ lấy giờ từ chuỗi ngày giờ
//   const formatTime = (datetime) => {
//     const date = new Date(datetime);
//     return date.toLocaleTimeString(); // Trả về chỉ giờ
//   };

//   return (
//     <>
//       <AdminLayout>
//         <div className="row">
//           <div className="col-md-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="table-responsive">
//                   <table className="datatable table table-hover table-center mb-0">
//                     <thead>
//                       <tr>
//                         <th>Doctor Name</th>
//                         <th>Speciality</th>
//                         <th>Patient Name</th>
//                         <th>Appointment Time</th>
//                         <th>Status</th>
//                         <th className="text-right">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {appointments.map((appointment) => (
//                         <tr key={appointment._id}>
//                           <td>
//                             <h2 className="align-middle table-avatar">
//                               <a
//                                 href="profile.html"
//                                 className="align-middle avatar avatar-sm mr-2"
//                               >
//                                 <img
//                                   className="align-middle avatar-img rounded-circle"
//                                   src={appointment.doctorId.img}
//                                   alt=""
//                                 />
//                               </a>
//                               <a className="align-middle" href="profile.html">{`${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}</a>
//                             </h2>
//                           </td>
//                           <td className="align-middle">{appointment.doctorId.specialization}</td>
//                           <td>
//                             <h2 className="align-middle table-avatar">
//                               <a
//                                 href="profile.html"
//                                 className="align-middle avatar avatar-sm mr-2"
//                               >
//                                 <img
//                                   className="align-middle avatar-img rounded-circle"
//                                   src={appointment.img ? appointment.img : userImg}
//                                   alt=""
//                                 />
//                               </a>
//                               <a className="align-middle">{`${appointment.firstName} ${appointment.lastName}`}</a>
//                             </h2>
//                           </td>
//                           <td className="align-middle">
//                             <span>{formatDate(appointment.scheduleDate)}</span>
//                             <span className="text-primary d-block">
//                               {appointment.scheduleTime}
//                             </span>
//                           </td>
//                           <td className="align-middle">{appointment.paymentStatus}</td>
//                           <td className="align-middle text-right">{appointment.paymentId.totalAmount}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </AdminLayout>
//     </>
//   );
// };

// export default AdminAppointments;



import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import "./Appointments.css";
import axios from "axios";
import userImg from "../../../images/avatar.jpg";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/v1/appointment");
        if (response.status === 200 && response.data.success) {
          const appointmentsData = response.data.data;
          console.log("Appointments Data:", appointmentsData); // Log dữ liệu appointmentsData để kiểm tra
          setAppointments(appointmentsData);
          // setLoading(false);
        } else {
          console.error("Error fetching appointments:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <AdminLayout>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="datatable table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Speciality</th>
                        <th>Patient Name</th>
                        <th>Apointment Time</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td>
                            <h2 className="table-avatar">
                              <a href="#" className="avatar avatar-sm mr-2">
                                <img
                                  className="avatar-img rounded-circle"
                                  src={appointment.doctorId.img}
                                  alt=""
                                />
                              </a>
                              <a href="#">{`${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}</a>
                            </h2>
                          </td>
                          <td>{appointment.doctorId.specialization}</td>
                          <td>
                            <h2 className="table-avatar">
                              <a href="profile.html" className="avatar avatar-sm mr-2">
                                <img
                                  className="avatar-img rounded-circle"
                                  src={appointment.patientId.img ? appointment.patientId.img : userImg}
                                  alt=""
                                />
                              </a>
                              <a>{`${appointment.firstName} ${appointment.lastName}`}</a>
                            </h2>
                          </td>
                          <td>
                            {appointment.scheduleDate}
                            <span className="text-primary d-block">
                              {appointment.scheduleTime}
                            </span>
                          </td>
                          <td>{appointment.paymentStatus}</td>
                          <td>{appointment.paymentId ? appointment.paymentId.paymentMethod : 'N/A'}</td>
                          <td className="text-right">
                            ${appointment.paymentId ? appointment.paymentId.totalAmount : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminAppointments;


//seState([]);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get("http://localhost:5050/api/v1/appointment");
//         if (response.status === 200 && response.data.success) {
//           const appointmentsData = response.data.data;
//           console.log("Appointments Data:", appointmentsData); // Log dữ liệu appointmentsData để kiểm tra
//           setAppointments(appointmentsData);
//           // setLoading(false);
//         } else {
//           console.error("Error fetching appointments:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };
    

//     fetchAppointments();
//   }, []);

//   return (
//     <>
//       <AdminLayout>
//         <div className="row">
//           <div className="col-md-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="table-responsive">
//                   <table className="datatable table table-hover table-center mb-0">
//                     <thead>
//                       <tr>
//                         <th>Doctor Name</th>
//                         <th>Speciality</th>
//                         <th>Patient Name</th>
//                         <th>Apointment Time</th>
//                         <th>Status</th>
//                         <th>Method</th>
//                         <th className="text-right">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                     {appointments.map((appointment) => (
//                       <tr>
                      
//                       <td>
//                         <h2 className="table-avatar">
//                           <a
//                             href="#"
//                             className="avatar avatar-sm mr-2"
                          
//                           >
//                             <img
//                               className="avatar-img rounded-circle"
//                               src={appointment.doctorId.img}
//                               alt=""
//                             />
//                           </a>
//                           <a href="#">{`${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}</a>
//                         </h2>
//                       </td>
//                       <td >{appointment.doctorId.specialization}</td>
//                       <td>
//                         <h2 className="table-avatar">
//                           <a
//                             href="profile.html"
//                             className="avatar avatar-sm mr-2"
//                           >
//                             <img
//                               className="avatar-img rounded-circle"
//                               src={appointment.patientId.img ? appointment.patientId.img : userImg}
//                               alt=""
//                             />
//                           </a>
//                           <a>{`${appointment.firstName} ${appointment.lastName}`}</a>
//                         </h2>
//                       </td>
//                       <td>
//                         {appointment.scheduleDate}
//                         <span className="text-primary d-block">
//                         {appointment.scheduleTime}
//                         </span>
//                       </td>
//                       <td>{appointment.paymentStatus}</td>
//                       <td>{appointment.paymentId.paymentMethod}</td>
//                       <td className="text-right">${appointment.paymentId.totalAmount}</td>
//                     </tr>
//                     ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </AdminLayout>
//     </>
//   );
// };
// export default AdminAppointments;

// import React, { useEffect, useState } from "react";
// import AdminLayout from "../AdminLayout/AdminLayout";
// import "./Appointments.css";
// import axios from "axios";
// import userImg from "../../../images/avatar.jpg";

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get("http://localhost:5050/api/v1/appointment");
//         if (response.status === 200 && response.data.success) {
//           const appointmentsData = response.data.data;
//           console.log("Appointments Data:", appointmentsData); // Log dữ liệu appointmentsData để kiểm tra
//           setAppointments(appointmentsData);
//           // setLoading(false);
//         } else {
//           console.error("Error fetching appointments:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };
    

//     fetchAppointments();
//   }, []);

//   return (
//     <>
//       <AdminLayout>
//         <div className="row">
//           <div className="col-md-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="table-responsive">
//                   <table className="datatable table table-hover table-center mb-0">
//                     <thead>
//                       <tr>
//                         <th>Doctor Name</th>
//                         <th>Speciality</th>
//                         <th>Patient Name</th>
//                         <th>Apointment Time</th>
//                         <th>Status</th>
//                         <th className="text-right">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                     {appointments.map((appointment) => (
//                       <tr>
                      
//                       <td>
//                         <h2 className="table-avatar">
//                           <a
//                             href="profile.html"
//                             className="avatar avatar-sm mr-2"
//                           >
//                             <img
//                               className="avatar-img rounded-circle"
//                               src="assets/img/doctors/doctor-thumb-01.jpg"
//                               alt=""
//                             />
//                           </a>
//                           <a href="profile.html">Dr. Ruby Perrin</a>
//                         </h2>
//                       </td>
//                       <td>Dental</td>
//                       <td>
//                         <h2 className="table-avatar">
//                           <a
//                             href="profile.html"
//                             className="avatar avatar-sm mr-2"
//                           >
//                             <img
//                               className="avatar-img rounded-circle"
//                               src={appointment.img ? appointment.img : userImg}
//                               alt=""
//                             />
//                           </a>
//                           <a>{`${appointment.firstName} ${appointment.lastName}`}</a>
//                         </h2>
//                       </td>
//                       <td>
//                         {appointment.scheduleDate}
//                         <span className="text-primary d-block">
//                         {appointment.scheduleTime}
//                         </span>
//                       </td>
//                       <td>{appointment.paymentStatus}</td>
//                       <td className="text-right">{appointment.paymentId.totalAmount}</td>
//                     </tr>
//                     ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </AdminLayout>
//     </>
//   );
// };
// export default AdminAppointments;



// import React, { useEffect, useState } from "react";
// import AdminLayout from "../AdminLayout/AdminLayout";
// import "./Appointments.css";
// import axios from "axios";
// import userImg from "../../../images/avatar.jpg";

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get("http://localhost:5050/api/v1/appointment");
//         if (response.status === 200 && response.data.success) {
//           const appointmentsData = response.data.data;
//           console.log("Appointments Data:", appointmentsData); // Log dữ liệu appointmentsData để kiểm tra
//           setAppointments(appointmentsData);
//           // setLoading(false);
//         } else {
//           console.error("Error fetching appointments:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };
    

//     fetchAppointments();
//   }, []);

//   return (
//     <>
//       <AdminLayout>
//         <div className="row">
//           <div className="col-md-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="table-responsive">
//                   <table className="datatable table table-hover table-center mb-0">
//                     <thead>
//                       <tr>
//                         <th>Doctor Name</th>
//                         <th>Speciality</th>
//                         <th>Patient Name</th>
//                         <th>Apointment Time</th>
//                         <th>Status</th>
//                         <th className="text-right">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                     {appointments.map((appointment) => (
//                       <tr>
                      
//                       <td>
//                         <h2 className="table-avatar">
//                           <a
//                             href="profile.html"
//                             className="avatar avatar-sm mr-2"
                          
//                           >
//                             <img
//                               className="avatar-img rounded-circle"
//                               src={appointment.doctorId.img}
//                               alt=""
//                             />
//                           </a>
//                           <a href="profile.html">{`${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}</a>
//                         </h2>
//                       </td>
//                       <td >{appointment.doctorId.specialization}</td>
//                       <td>
//                         <h2 className="table-avatar">
//                           <a
//                             href="profile.html"
//                             className="avatar avatar-sm mr-2"
//                           >
//                             <img
//                               className="avatar-img rounded-circle"
//                               src={appointment.img ? appointment.img : userImg}
//                               alt=""
//                             />
//                           </a>
//                           <a>{`${appointment.firstName} ${appointment.lastName}`}</a>
//                         </h2>
//                       </td>
//                       <td>
//                         {appointment.scheduleDate}
//                         <span className="text-primary d-block">
//                         {appointment.scheduleTime}
//                         </span>
//                       </td>
//                       <td>{appointment.paymentStatus}</td>
//                       <td className="text-right">{appointment.paymentId.totalAmount}</td>
//                     </tr>
//                     ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </AdminLayout>
//     </>
//   );
// };
// export default AdminAppointments;
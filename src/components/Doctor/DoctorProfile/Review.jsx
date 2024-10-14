import React, { useEffect, useState } from "react";
import img from "../../../images/doc/doctor 3.jpg";
import { FaRegThumbsUp } from "react-icons/fa";
import moment from "moment";
import StarRatings from "react-star-ratings";
import { useCreateReviewMutation, useGetDoctorReviewsQuery, useUpdateReviewMutation } from "../../../redux/api/reviewsApi";
import { useGetPatientAppointmentsQuery } from "../../../redux/api/appointmentApi";
import { Button, Radio, message, Space, Rate, Empty } from "antd";
import { useForm } from "react-hook-form";
import useAuthCheck from "../../../redux/hooks/useAuthCheck";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const Review = ({ doctorId }) => {
    const { data: userData } = useAuthCheck();
    const { register, handleSubmit, reset, setValue: setFormValue } = useForm();
    const [value, setValue] = useState(null);
    const [recommend, setRecommend] = useState(null);
    const [showError, setShowError] = useState(false);
    const [existingReview, setExistingReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [hasUpdated, setHasUpdated] = useState(false); // Track if review has been updated
    const [reviewedAppointmentIds, setReviewedAppointmentIds] = useState([]);

    const { data: reviewsData, isError, isLoading, refetch } = useGetDoctorReviewsQuery(doctorId);
    const { data: appointmentsData, isLoading: isAppointmentsLoading } = useGetPatientAppointmentsQuery();

    const [createReview, { isSuccess: createIsSuccess, isError: createTsError, error: createError, isLoading: createIsLoading }] = useCreateReviewMutation();
    const [updateReview, { isSuccess: updateIsSuccess, isError: updateTsError, error: updateError, isLoading: updateIsLoading }] = useUpdateReviewMutation();

    const appointmentIdFromUrl = new URLSearchParams(window.location.search).get('appointmentId');

    useEffect(() => {
        if (recommend !== null && value !== null) {
            setShowError(true);
        } else {
            setShowError(false);
        }
    }, [recommend, value]);

    useEffect(() => {
        if (reviewsData && userData) {
            const reviews = reviewsData.filter(
                (review) => review.patientId._id === userData._id
            );
            const appointmentIds = reviews.map(review => review.appointmentId);

            const existingReviewForUrlAppointment = reviews.find(
                (review) => review.appointmentId === appointmentIdFromUrl
            );

            if (existingReviewForUrlAppointment) {
                setExistingReview(existingReviewForUrlAppointment);
                setFormValue("description", existingReviewForUrlAppointment.description);
                setValue(parseInt(existingReviewForUrlAppointment.star));
                setRecommend(existingReviewForUrlAppointment.isRecommended ? 1 : 2);
                setIsEditing(true);
                setHasUpdated(existingReviewForUrlAppointment.isUpdated);
            } else {
                setExistingReview(null);
                setIsEditing(false);
            }
        }
    }, [reviewsData, userData, appointmentIdFromUrl, setFormValue]);

    const onChange = (e) => setRecommend(e.target.value);

    const onSubmit = (data) => {
        const completedAppointment = appointmentsData.find(
            (appointment) => appointment._id === appointmentIdFromUrl && appointment.status === 'Completed'
        );

        if (!completedAppointment) {
            message.error("No completed appointment found for this doctor.");
            return;
        }

        const obj = {
            isRecommended: recommend === 1 ? true : recommend === 2 ? false : null,
            description: data.description,
            star: value && value.toString(),
            doctorId: doctorId,
            appointmentId: completedAppointment._id
        };

        if (existingReview) {
            if (hasUpdated) {
                message.error("You have already updated your review.");
                return;
            }
            updateReview({ id: existingReview._id, data: obj })
                .unwrap()
                .then(() => {
                    message.success("Successfully Updated Review!");
                    setExistingReview((prev) => ({
                        ...prev,
                        ...obj,
                        isUpdated: true
                    }));
                    setHasUpdated(true);
                    setReviewedAppointmentIds(prev => [...prev, completedAppointment._id]);
                })
                .catch((error) => {
                    console.error("Failed to update review", error);
                    message.error("Failed to update review. Please try again later.");
                });
        } else {
            if (reviewedAppointmentIds.includes(completedAppointment._id)) {
                message.error("You have already reviewed this appointment.");
                return;
            }
            createReview({ data: obj })
                .unwrap()
                .then(() => {
                    message.success("Successfully Submitted Review!");
                    reset();
                    setReviewedAppointmentIds(prev => [...prev, completedAppointment._id]);
                })
                .catch((error) => {
                    console.error("Failed to submit review", error);
                    message.error("Failed to submit review. Please try again later.");
                });
        }
    };

    useEffect(() => {
        if (!createIsLoading && createTsError) {
            message.error(createError?.data?.message || "Failed to submit review.");
        }
        if (!updateIsLoading && updateTsError) {
            message.error(updateError?.data?.message || "Failed to update review.");
        }
    }, [
        createIsLoading,
        createTsError,
        createError,
        updateIsLoading,
        updateTsError,
        updateError,
    ]);

    let content = null;
    if (isLoading) {
        content = <Empty />;
    } else if (isError) {
        content = <div>Something Went Wrong!</div>;
    } else if (reviewsData?.length === 0) {
        content = <div>No reviews available.</div>;
    } else {
        content = (
            <>
                {reviewsData.map((item, key) => (
                    <div className="mb-4" key={item._id}>
                        <div className="d-flex gap-3 justify-content-between">
                            <div className="d-flex gap-4">
                                <div className="review-img">
                                    <img className="" alt="" src={item?.patientId?.img || img} />
                                </div>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <h6 className="text-nowrap">
                                            {item?.patientId?.firstName +
                                                " " +
                                                item?.patientId?.lastName}
                                        </h6>
                                        {item.patientId._id === userData._id && (
                                            <Button
                                                type="link"
                                                onClick={() => {
                                                    setIsEditing(true);
                                                    setExistingReview(item);
                                                    setFormValue("description", item.description);
                                                    setValue(parseInt(item.star));
                                                    setRecommend(item.isRecommended ? 1 : 2);
                                                }}
                                            >
                                                
                                            </Button>
                                        )}
                                        <p className="text-success">
                                            <FaRegThumbsUp />{" "}
                                            {item?.isRecommended
                                                ? "I recommend the doctor"
                                                : "I do not recommend the doctor"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-end">
                                <div>
                                    <StarRatings
                                        rating={parseInt(item.star)}
                                        starRatedColor="#f4c150"
                                        numberOfStars={5}
                                        name="rating"
                                        starDimension="15px"
                                        starSpacing="2px"
                                    />
                                </div>
                                <div className="">
                                    Reviewed {moment(item?.createdAt).startOf("hours").fromNow()}
                                </div>
                            </div>
                        </div>
                        <div className="mx-5 form-text text-black">
                            <div className="fs-6 mb-3">{item?.description}</div>
                            {item?.response && (
                                <div className="doctor-reply mt-2">
                                    <div className="reply-header gap-4 d-flex align-items-center">
                                        <img
                                            className="review-img"
                                            alt=""
                                            src={item?.doctorId?.img || img}
                                        />
                                        <h6 className="text-nowrap">
                                            {item?.doctorId?.firstName +
                                                " " +
                                                item?.doctorId?.lastName}
                                        </h6>

                                        <div className="fs-6 mb-2">{item?.response}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </>
        );
    }

    const hasCompletedAppointment = appointmentsData?.some(
        (appointment) => 
            appointment._id === appointmentIdFromUrl &&
            appointment.status === 'Completed' &&
            !reviewedAppointmentIds.includes(appointment._id)
    );

    return (
        <>
            <div>
                <div
                    className="w-100 mb-3 rounded py-3 px-2"
                    style={{ background: "#f8f9fa" }}
                >
                    {content}
                </div>

                
                {hasCompletedAppointment && !hasUpdated && (
                    <div className="mt-5">
                        <h4>
                            {existingReview && isEditing ? "Update your review.." : "Write a review.."}
                        </h4>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-3">
                                <div className="d-flex flex-column">
                                    <label className="form-label">
                                        Your Review{" "}
                                        {value ? <strong>{desc[value - 1]}</strong> : ""}
                                    </label>
                                    <Space>
                                        <Rate tooltips={desc} onChange={setValue} value={value} />
                                    </Space>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <Radio.Group onChange={onChange} value={recommend}>
                                    <Space direction="vertical">
                                        <Radio value={1}>Recommend Doctor</Radio>
                                        <Radio value={2}>Not Recommend Doctor</Radio>
                                    </Space>
                                </Radio.Group>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Your review</label>
                                <textarea
                                    className="form-control"
                                    {...register("description")}
                                    placeholder="Description..."
                                    rows={8}
                                />
                            </div>
                            <hr />
                            <div className="submit-section">
                                <Button
                                    htmlType="submit"
                                    size="medium"
                                    type="primary"
                                    disabled={!showError || hasUpdated} // Vô hiệu hóa nếu review đã được cập nhật
                                >
                                    {existingReview && isEditing ? "Update Review" : "Add Review"}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {!hasCompletedAppointment && (
                    <div className="mt-5">
                        <p>You can only write a review after completing an appointment with this doctor.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Review;






// import React, { useEffect, useState } from "react";
// import img from "../../../images/doc/doctor 3.jpg";
// import { FaRegThumbsUp } from "react-icons/fa";
// import moment from "moment";
// import StarRatings from "react-star-ratings";
// import {
//   useCreateReviewMutation,
//   useGetDoctorReviewsQuery,
//   useUpdateReviewMutation,
// } from "../../../redux/api/reviewsApi";
// import { useGetPatientAppointmentsQuery } from "../../../redux/api/appointmentApi";
// import { Button, Radio, message, Space, Rate, Empty } from "antd";
// import { useForm } from "react-hook-form";
// import useAuthCheck from "../../../redux/hooks/useAuthCheck"; 

// const desc = ["terrible", "bad", "normal", "good", "wonderful"];

// const Review = ({ doctorId }) => {
//   const { data: userData } = useAuthCheck();
//   const { register, handleSubmit, reset, setValue: setFormValue } = useForm();
//   const [value, setValue] = useState(null);
//   const [recommend, setRecommend] = useState(null);
//   const [showError, setShowError] = useState(false);
//   const [existingReview, setExistingReview] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const {
//     data: reviewsData,
//     isError,
//     isLoading,
//     refetch,
//   } = useGetDoctorReviewsQuery(doctorId);

//   const { data: appointmentsData, isLoading: isAppointmentsLoading } =
//     useGetPatientAppointmentsQuery();

//   const [
//     createReview,
//     {
//       isSuccess: createIsSuccess,
//       isError: createTsError,
//       error: createError,
//       isLoading: createIsLoading,
//     },
//   ] = useCreateReviewMutation();

//   const [
//     updateReview,
//     {
//       isSuccess: updateIsSuccess,
//       isError: updateTsError,
//       error: updateError,
//       isLoading: updateIsLoading,
//     },
//   ] = useUpdateReviewMutation();

//   const onChange = (e) => setRecommend(e.target.value);

//   useEffect(() => {
//     if (recommend !== null && value !== null) {
//       setShowError(true);
//     } else {
//       setShowError(false);
//     }
//   }, [recommend, value]);

//   useEffect(() => {
//     if (reviewsData && userData) {
//       const review = reviewsData.find(
//         (review) => review.patientId._id === userData._id
//       );
//       if (review) {
//         setExistingReview(review);
//         setFormValue("description", review.description);
//         setValue(parseInt(review.star));
//         setRecommend(review.isRecommended ? 1 : 2);
//         setIsEditing(true);
//       }
//     }
//   }, [reviewsData, userData, setFormValue]);

//   const onSubmit = (data) => {
//     const obj = {
//       isRecommended: recommend === 1 ? true : recommend === 2 ? false : null,
//       description: data.description,
//       star: value && value.toString(),
//       doctorId: doctorId,
//     };

//     if (obj.description.trim() === "") {
//       message.error("Please Add Review Text !!");
//       return;
//     }

//     if (existingReview) {
//       // Update the existing review
//       updateReview({ id: existingReview._id, data: obj })
//         .unwrap()
//         .then(() => {
//           message.success("Successfully Updated Review!");
//           // No reset or refetch needed, just update the local state
//           setExistingReview((prev) => ({
//             ...prev,
//             ...obj,
//           }));
//         })
//         .catch((error) => {
//           console.error("Failed to update review", error);
//           message.error("Failed to update review. Please try again later.");
//         });
//     } else {
//       // Create a new review
//       createReview({ data: obj })
//         .unwrap()
//         .then(() => {
//           message.success("Successfully Submitted Review!");
//           reset();
//           // refetch(); // Refresh reviews after submission
//         })
//         .catch((error) => {
//           console.error("Failed to submit review", error);
//           message.error("Failed to submit review. Please try again later.");
//         });
//     }
//   };

//   useEffect(() => {
//     if (!createIsLoading && createTsError) {
//       message.error(createError?.data?.message || "Failed to submit review.");
//     }
//     if (!updateIsLoading && updateTsError) {
//       message.error(updateError?.data?.message || "Failed to update review.");
//     }
//   }, [
//     createIsLoading,
//     createTsError,
//     createError,
//     updateIsLoading,
//     updateTsError,
//     updateError,
//   ]);

//   let content = null;
//   if (isLoading) {
//     content = <Empty />;
//   } else if (isError) {
//     content = <div>Something Went Wrong!</div>;
//   } else if (reviewsData?.length === 0) {
//     content = <div>No reviews available.</div>;
//   } else {
//     content = (
//       <>
//         {reviewsData.map((item, key) => (
//           <div className="mb-4" key={item._id}>
//             <div className="d-flex gap-3 justify-content-between">
//               <div className="d-flex gap-4">
//                 <div className="review-img">
//                   <img className="" alt="" src={item?.patientId?.img || img} />
//                 </div>
//                 <div className="d-flex align-items-center">
//                   <div>
//                     <h6 className="text-nowrap">
//                       {item?.patientId?.firstName +
//                         " " +
//                         item?.patientId?.lastName}
//                     </h6>
//                     {item.patientId._id === userData._id && (
//                       <Button
//                         type="link"
//                         onClick={() => {
//                           setIsEditing(true);
//                           setExistingReview(item);
//                           setFormValue("description", item.description);
//                           setValue(parseInt(item.star));
//                           setRecommend(item.isRecommended ? 1 : 2);
//                         }}
//                       >
//                         Edit
//                       </Button>
//                     )}
//                     <p className="text-success">
//                       <FaRegThumbsUp />{" "}
//                       {item?.isRecommended
//                         ? "I recommend the doctor"
//                         : "I do not recommend the doctor"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="text-end">
//                 <div>
//                   <StarRatings
//                     rating={parseInt(item.star)}
//                     starRatedColor="#f4c150"
//                     numberOfStars={5}
//                     name="rating"
//                     starDimension="15px"
//                     starSpacing="2px"
//                   />
//                 </div>
//                 <div className="">
//                   Reviewed {moment(item?.createdAt).startOf("hours").fromNow()}
//                 </div>
//               </div>
//             </div>
//             <div className="mx-5 form-text text-black">
//               <div className="fs-6 mb-3">{item?.description}</div>
//               {item?.response && (
//                 <div className="doctor-reply mt-2">
//                   <div className="reply-header gap-4 d-flex align-items-center">
//                     <img
//                       className="review-img"
//                       alt=""
//                       src={item?.doctorId?.img || img}
//                     />
//                     <h6 className="text-nowrap">
//                       {item?.doctorId?.firstName +
//                         " " +
//                         item?.doctorId?.lastName}
//                     </h6>

//                     <div className="fs-6 mb-2">{item?.response}</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </>
//     );
//   }

//   const hasCompletedAppointment = appointmentsData?.some(
//     (appointment) => appointment._id
//   );

//   return (
//     <>
//       <div>
//         <div
//           className="w-100 mb-3 rounded py-3 px-2"
//           style={{ background: "#f8f9fa" }}
//         >
//           {content}
//         </div>

//         {hasCompletedAppointment && (
//           <div className="mt-5">
//             <h4>
//               {existingReview && isEditing
//                 ? "Update your review.."
//                 : "Write a review.."}
//             </h4>

//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="form-group mb-3">
//                 <div className="d-flex flex-column">
//                   <label className="form-label">
//                     Your Review{" "}
//                     {value ? <strong>{desc[value - 1]}</strong> : ""}
//                   </label>
//                   <Space>
//                     <Rate tooltips={desc} onChange={setValue} value={value} />
//                   </Space>
//                 </div>
//               </div>
//               <div className="form-group mb-3">
//                 <Radio.Group onChange={onChange} value={recommend}>
//                   <Space direction="vertical">
//                     <Radio value={1}>Recommend Doctor</Radio>
//                     <Radio value={2}>Not Recommend Doctor</Radio>
//                   </Space>
//                 </Radio.Group>
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Your review</label>
//                 <textarea
//                   className="form-control"
//                   {...register("description")}
//                   placeholder="Description..."
//                   rows={8}
//                 />
//               </div>
//               <hr />
//               <div className="submit-section">
//                 <Button
//                   htmlType="submit"
//                   size="medium"
//                   type="primary"
//                   disabled={!showError}
//                 >
//                   {existingReview && isEditing ? "Update Review" : "Add Review"}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Review;

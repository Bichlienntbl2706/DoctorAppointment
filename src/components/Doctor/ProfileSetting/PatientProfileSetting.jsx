import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { bloodGrupOptions } from '../../../constant/global';
import { useUpdatePatientMutation } from '../../../redux/api/patientApi';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import { message } from 'antd';
import ImageUpload from '../../UI/form/ImageUpload';
import pImage from '../../../images/avatar.jpg';
import { DatePicker } from 'antd';

const PatientProfileSetting = () => {
    const { data } = useAuthCheck();
    const { register, handleSubmit, setValue, watch } = useForm({});
    const [userId, setUserId] = useState('');
    const [selectBloodGroup, setSelectBloodGroup] = useState('');
    const [selectValue, setSelectValue] = useState({})
    const [updatePatient, { isSuccess, isError, error, isLoading }] = useUpdatePatientMutation();
    const [date, setDate] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (data) {
            const { _id, services } = data
            setUserId(_id)
            setSelectedItems(typeof services === 'string' ? services.split(',') : []);

            // Initialize form values
            setValue("firstName", data.firstName)
            setValue("lastName", data.lastName)
            setValue("email", data.email)
            setValue("phone", data.phone)
            setValue("gender", data.gender)
            setValue("address", data.address)
            setValue("city", data.city)
            setValue("state", data.state)
            setValue("country", data.country)
            setValue("postalCode", data.postalCode)
            setSelectBloodGroup(data?.bloodGroup);

            if (data.dateOfBirth) {
                setDate(moment(data.dateOfBirth));
            }
        }
    }, [data]);

    const handleChange = (e) => {
        setValue({ ...selectValue, [e.target.name]: e.target.value });
        if (e.target.name === 'bloodGroup') {
            setSelectBloodGroup(e.target.value);
        }
    }

    const onChange = (date, dateString) => { 
        // setDate(moment(dateString).format());
        setDate(moment(dateString).format());
    };

    
    const disabledDate = (current) => {
        // Disable future dates
        return current && current > moment().endOf('day');
    };

    useEffect(() => {
        if (!isLoading && isError) {
            message.error(error?.data?.message)
        }
        if (isSuccess) {
            message.success('Successfully Profile Updated')
        }
    }, [isLoading, isError, error, isSuccess])

    

    const onSubmit = (data) => {
        const obj = data;
        const newObj = { ...obj, ...selectValue };
        // if (date) {
        //     newObj['dateOfBirth'] = date.format('YYYY-MM-DD');
        // }
        // date && (newObj['dateOfBirth'] = date);
        if (date) newObj['dateOfBirth'] = date;
        const changedValue = Object.fromEntries(Object.entries(newObj).filter(([key, value]) => value !== ''));
        const formData = new FormData();
        selectedImage && formData.append('file', file);
        const changeData = JSON.stringify(changedValue);
        formData.append('data', changeData)
        updatePatient({ data: formData, id: userId })
    };


    return (
        <div style={{ marginBottom: '10rem' }}>
            <div className="w-100 mb-3 rounded mb-5 p-2" style={{ background: '#f8f9fa' }}>
                <h5 className="text-title mb-2 mt-3">Update Your Information</h5>
                <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className='change-avatar d-flex gap-2 align-items-center'>
                                <Link to={'/'} className="my-3 patient-img">
                                    <img src={selectedImage ? selectedImage : data?.img || pImage} alt="" />
                                </Link>
                                <div className="mt-3">
                                    <ImageUpload setSelectedImage={setSelectedImage} setFile={setFile}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>First Name <span className="text-danger">*</span></label>
                            <input defaultValue={data?.firstName} {...register("firstName")} className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Last Name <span className="text-danger">*</span></label>
                            <input defaultValue={data?.lastName} {...register("lastName")} className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Email <span className="text-danger">*</span></label>
                            <input defaultValue={data?.email} disabled className="form-control" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Date of Birth {data?.dateOfBirth && moment(data?.dateOfBirth).format('LL')}</label>
                            <DatePicker  onChange={onChange} value={date ? moment(date) : null} format={"YYYY-MM-DD"} style={{ width: '100%', padding: '6px' }} disabledDate={disabledDate} />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Phone Number</label>
                            <input defaultValue={data?.mobile} {...register("mobile")} className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Gender</label>
                            <select className="form-control select" onChange={handleChange} name='gender'  {...register("gender")} value={watch('gender') || ''}>
                                <option value={''}>Select</option>
                                <option className='text-capitalize'>Male</option>
                                <option className='text-capitalize'>Female</option>
                                <option className='text-capitalize'>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-6 row pr-4">
                        <div className="form-group mb-2 col-md-6 card-label">
                            <label className='form-label'>Blood Group</label>
                            <select className="form-control select"
                                onChange={handleChange}
                                name='bloodGroup'
                                value={selectBloodGroup}
                            >
                                {
                                    bloodGrupOptions.map((option, index) => (
                                        <option key={index} value={option.value} className='text-capitalize'>{option.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group mb-2 col-md-6 card-label" >
                            <label className='form-label'>Weight</label>
                            <input style={{width:"107%"}} defaultValue={data?.weight} {...register("weight")} className="form-control" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label" style={{marginBottom: "0.5rem", marginLeft:"24px", width: "100%"}}>
                            <label className='form-label'>City</label>
                            <input defaultValue={data?.city} {...register("city")} className="form-control" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>State</label>
                            <input defaultValue={data?.state} {...register("state")} className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Zip Code</label>
                            <input defaultValue={data?.zipCode} {...register("zipCode")} className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Country</label>
                            <input defaultValue={data?.country} {...register("country")} className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Address</label>
                            <input defaultValue={data?.address} {...register("address")} className="form-control" />
                        </div>
                    </div>
                    <div className='text-center'>
                        <button type="submit" className="btn btn-primary my-3" disabled={isLoading ? true : false}>{isLoading ? 'Updating..' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PatientProfileSetting


// import React, { useEffect, useRef, useState } from 'react'
// import moment from 'moment';
// import { useForm } from 'react-hook-form';
// import { Link } from 'react-router-dom';
// import { bloodGrupOptions } from '../../../constant/global';
// import { useUpdatePatientMutation } from '../../../redux/api/patientApi';
// import useAuthCheck from '../../../redux/hooks/useAuthCheck';
// import { message } from 'antd';
// import ImageUpload from '../../UI/form/ImageUpload';
// import pImage from '../../../images/avatar.jpg';
// import { DatePicker } from 'antd';

// const PatientProfileSetting = () => {
//     const { data } = useAuthCheck();
//     const { register, handleSubmit } = useForm({});
//     const [userId, setUserId] = useState('');
//     const [selectBloodGroup, setSelectBloodGroup] = useState('');
//     const [selectValue, setSelectValue] = useState({})
//     const [updatePatient, { isSuccess, isError, error, isLoading }] = useUpdatePatientMutation();
//     const [date, setDate] = useState(null);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [file, setFile] = useState(null);

//     const onChange = (date, dateString) => { 
//         setDate(moment(dateString).format());
//     };

//     useEffect(() => {
//         if (data) {
//             setUserId(data._id)
//             setSelectBloodGroup(data?.bloodGroup)
//         }
//     }, [data]);

//     useEffect(() => {
//         if (!isLoading && isError) {
//             message.error(error?.data?.message)
//         }
//         if (isSuccess) {
//             message.success('Successfully Profile Updated')
//         }
//     }, [isLoading, isError, error, isSuccess])

//     const handleChange = (e) => {
//         setSelectValue({ ...selectValue, [e.target.name]: e.target.value })
//         if (e.target.name === 'bloodGroup') {
//             setSelectBloodGroup(e.target.value);
//         }
//     }
//     const disabledDate = (current) => {
//         // Disable future dates
//         return current && current > moment().endOf('day');
//     };
//     const onSubmit = (data) => {
//         const obj = data;
//         const newObj = { ...obj, ...selectValue };
//         date && (newObj['dateOfBirth'] = date);
//         const changedValue = Object.fromEntries(Object.entries(newObj).filter(([key, value]) => value !== ''));
//         const formData = new FormData();
//         selectedImage && formData.append('file', file);
//         const changeData = JSON.stringify(changedValue);
//         formData.append('data', changeData)
//         updatePatient({ data: formData, id: userId })
//     };


//     return (
//         <div style={{ marginBottom: '10rem' }}>
//             <div className="w-100 mb-3 rounded mb-5 p-2" style={{ background: '#f8f9fa' }}>
//                 <h5 className="text-title mb-2 mt-3">Update Your Information</h5>
//                 <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
//                     <div className="col-md-12">
//                         <div className="form-group">
//                             <div className='change-avatar d-flex gap-2 align-items-center'>
//                                 <Link to={'/'} className="my-3 patient-img">
//                                     <img src={selectedImage ? selectedImage : data?.img || pImage} alt="" />
//                                 </Link>
//                                 <div className="mt-3">
//                                     <ImageUpload setSelectedImage={setSelectedImage} setFile={setFile}/>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>First Name <span className="text-danger">*</span></label>
//                             <input defaultValue={data?.firstName} {...register("firstName")} className="form-control" />
//                         </div>
//                     </div>
//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>Last Name <span className="text-danger">*</span></label>
//                             <input defaultValue={data?.lastName} {...register("lastName")} className="form-control" />
//                         </div>
//                     </div>
//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>Email <span className="text-danger">*</span></label>
//                             <input defaultValue={data?.email} disabled className="form-control" />
//                         </div>
//                     </div>

//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>Date of Birth {moment(data?.dateOfBirth).format('LL')}</label>
//                             <DatePicker  onChange={onChange} format={"YYYY-MM-DD"} style={{ width: '100%', padding: '6px' }} disabledDate={disabledDate} />
//                         </div>
//                     </div>

//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>Phone Number</label>
//                             <input defaultValue={data?.mobile} {...register("mobile")} className="form-control" />
//                         </div>
//                     </div>
//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>Gender</label>
//                             <select className="form-control select" onChange={handleChange} name='gender'>
//                                 <option value={''}>Select</option>
//                                 <option className='text-capitalize'>Male</option>
//                                 <option className='text-capitalize'>Female</option>
//                                 <option className='text-capitalize'>Other</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div className="col-md-6 row pr-4">
//                         <div className="form-group mb-2 col-md-6  card-label">
//                             <label>Blood Group</label>
//                             <select className="form-control select"
//                                 onChange={handleChange}
//                                 name='bloodGroup'
//                                 value={selectBloodGroup}
//                             >
//                                 {
//                                     bloodGrupOptions.map((option, index) => (
//                                         <option key={index} value={option.value} className='text-capitalize'>{option.label}</option>
//                                     ))
//                                 }
//                             </select>
//                         </div>
//                         <div className="form-group mb-2 col-md-6  card-label">
//                             <label >Weight</label>
//                             <input style={{width:"269px"}} defaultValue={data?.weight} {...register("weight")} className="form-control" />
//                         </div>
//                     </div>

//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label" style={{marginBottom:"0.5rem", marginLeft:"24px", width:"538px"}}>
//                             <label >City</label>
//                             <input defaultValue={data?.city} {...register("city")} className="form-control" />
//                         </div>
//                     </div>

//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>State</label>
//                             <input defaultValue={data?.state} {...register("state")} className="form-control" />
//                         </div>
//                     </div>
//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>Zip Code</label>
//                             <input defaultValue={data?.zipCode} {...register("zipCode")} className="form-control" />
//                         </div>
//                     </div>
//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>Country</label>
//                             <input defaultValue={data?.country} {...register("country")} className="form-control" />
//                         </div>
//                     </div>
//                     <div className="col-md-6">
//                         <div className="form-group mb-2 card-label">
//                             <label>Address</label>
//                             <input defaultValue={data?.address} {...register("address")} className="form-control" />
//                         </div>
//                     </div>
//                     <div className='text-center'>
//                         <button type="submit" className="btn btn-primary my-3" disabled={isLoading ? true : false}>{isLoading ? 'Updating..' : 'Save Changes'}</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default PatientProfileSetting
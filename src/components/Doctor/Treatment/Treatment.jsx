import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { Button, DatePicker, Space, message } from "antd";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { DatePickerSinglePresets, DiagnosisOptions, DiseaseOptions, DosageOptions, FrequencyOptions, MedicalCheckupOptions, PatientStatus, appointemntStatusOption } from "../../../constant/global";
import SelectForm from "../../UI/form/SelectForm";
import TextArea from "antd/es/input/TextArea";
import InputAutoCompleteForm from "../../UI/form/InputAutoCompleteForm";
import { useForm } from "react-hook-form";
import SelectFormForMedicine from "../../UI/form/SelectFormForMedicine";
import MedicineRangePickerForm from "../../UI/form/MedicineRangePickerForm";
import { useCreatePrescriptionMutation } from "../../../redux/api/prescriptionApi";
import { useGetSingleAppointmentQuery } from "../../../redux/api/appointmentApi";
import TreatmentOverview from "./TreatmentOverview";

const Treatment = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, refetch } = useGetSingleAppointmentQuery(id)
    const { handleSubmit } = useForm();
    const [isDisable, setIsDisable] = useState(true);
    const [selectAppointmentStatus, setSelectAppointmentStatus] = useState('');
    const [patientStatus, setPatientStatus] = useState('');
    const [diagnosis, setDaignosis] = useState([]);
    const [disease, setDisease] = useState([]);
    const [medicalCheckup, setMedicalCheckup] = useState([]);
    const [instruction, setInstruction] = useState('');
    const [followUpDate, setFollowUpdate] = useState('');
    const [medicineList, setMedicineList] = useState([{ id: 1 }]);

    useEffect(() => {
        const isInputEmpty = !selectAppointmentStatus || !patientStatus  || !diagnosis.length === 0 ||  !medicalCheckup.length === 0;
        setIsDisable(isInputEmpty);
    }, [selectAppointmentStatus, patientStatus, diagnosis, medicalCheckup]);

    const [createPrescription, { isSuccess, isLoading, isError, error }] = useCreatePrescriptionMutation();

    // const addField = (e) => {
    //     e.preventDefault();
    //     setMedicineList([...medicineList, { id: medicineList.length + 1 }])
    // }

    // const removeFromAddTimeSlot = (id) => {
    //     setMedicineList(medicineList.filter((item) => item.id !== id))
    // }

    // const handleFollowUpChange = (date) => {
    //     if (date) {
    //         setFollowUpdate(dayjs(date).format());
    //     }
    // };
console.log("data treatment view: ", data)
    const onSubmit = (data) => {
        const obj = {};
        obj.status = selectAppointmentStatus;
        obj.patientType = patientStatus;

        diagnosis.length && (obj["diagnosis"] = diagnosis.join(','))
        // disease.length && (obj["disease"] = disease.join(','))
        medicalCheckup.length && (obj["test"] = medicalCheckup.join(','))
        // obj.followUpdate = followUpDate;
        // obj.instruction = instruction;
        // obj.medicine = medicineList;
        obj.appointmentId = id;

        createPrescription({ data: obj });
    }

    useEffect(() => {
        if (!isLoading && isError) {
            message.error(error?.data?.message);
        }
        if (isSuccess) {
            message.success('Successfully Changed Saved !');
            refetch();
            setSelectAppointmentStatus("");
            setPatientStatus("");
            setDaignosis([]);
            // setDisease([]);
            setMedicalCheckup([]);
            // setInstruction('');
            // setFollowUpdate('');
            // setMedicineList([{ id: 1 }]);
            navigate(`/dashboard`)
            // navigate(`/dashboard/treatment/view/${data?._id}`) 
        }
    }, [isLoading, isError, error, isSuccess])

    return (
        <DashboardLayout>
            <TreatmentOverview data={data} />
            <div className="w-100 mb-3 rounded p-3 bg-gray-g">
                <div className="text-center mb-2 d-flex justify-content-center">
                    <h5 className="border-success border-bottom w-25 pb-2 border-5">Start Treatment</h5>
                </div>

                <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-md-6">
                        <div className="form-group mb-4">
                            <div className="mb-2">
                                <h6 className="card-title text-secondary">Change Appointment Status</h6>
                            </div>
                            <SelectForm
                                showSearch={true}
                                options={appointemntStatusOption}
                                setSelectData={setSelectAppointmentStatus}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-4">
                            <div className="mb-2">
                                <h6 className="card-title text-secondary">Change Patient Status</h6>
                            </div>
                            <SelectForm
                                showSearch={true}
                                options={PatientStatus}
                                setSelectData={setPatientStatus}
                            />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="card p-3 mb-3">
                            <h6 className="card-title text-secondary">Identify Disease & Symtomps</h6>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group mb-3">
                                        <div>
                                            <label>Daignosis</label>
                                        </div>
                                        <SelectForm
                                            mode={true}
                                            options={DiagnosisOptions}
                                            setSelectData={setDaignosis}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-12 mb-3">
                        <div className="card mb-2 p-3 mt-2">
                            <h6 className="card-title text-secondary">Medical Checkup</h6>
                            <div className="row form-row">
                                <div className="form-group mb-2 card-label">
                                    <label>Medical Checkup</label>
                                    <SelectForm
                                        mode={true}
                                        setSelectData={setMedicalCheckup}
                                        options={MedicalCheckupOptions}
                                    />
                                    <small className="form-text text-muted">Note : Type & Press enter to add new services</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='text-center my-3'>
                        <Button htmlType='submit' type="primary" size='large' disabled={isDisable} loading={isLoading}>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default Treatment;
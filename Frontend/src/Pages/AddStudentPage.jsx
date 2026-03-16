// Pages/AddStudentPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE, STUDENTS } from "../Constants/apiRoutes.js";

import PageHeader from "../Components/AddStudent/PageHeader";
import FormCard from "../Components/AddStudent/FormCard";
import StudentForm from "../Components/AddStudent/StudentForm";

const BASE_URL = BASE.ROUTE;

const initialForm = {
    name:        "",
    phone:       "",
    parentPhone: "",
    grade:       "",
};

export default function AddStudentPage() {
    const [form,    setForm]    = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const setField = (field) => (value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async () => {
        if (!form.name.trim())  return toast.error("Student name is required");
        if (!form.phone.trim()) return toast.error("Phone number is required");
        if (!/^\d{10}$/.test(form.phone)) return toast.error("Enter a valid 10-digit phone number");
        if (form.parentPhone && !/^\d{10}$/.test(form.parentPhone))
            return toast.error("Enter a valid 10-digit parent phone number");
        if (!form.grade) return toast.error("Please select a class");

        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}${STUDENTS.ADD}`, {
                name:        form.name.trim(),
                phone:       "+91" + form.phone.trim(),
                parentPhone: form.parentPhone ? "+91" + form.parentPhone.trim() : undefined,
                role:        "student",
                grade:       form.grade,
            });

            if (res.data.success) {
                toast.success("Student added successfully!");
                setForm(initialForm);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add student");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setForm(initialForm);
        toast.info("Form cleared");
    };

    return (
        <>
            <div className="min-h-screen bg-slate-100 flex flex-col items-center sm:justify-center sm:py-8">
                <div className="w-full max-w-[430px] bg-slate-100 min-h-screen sm:min-h-0 sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl sm:shadow-slate-300/60 flex flex-col">

                    <PageHeader onBack={() => navigate(-1)} />

                    <div className="flex flex-col gap-3.5 px-4 py-4 flex-1">
                        <FormCard
                            icon="👤"
                            title="Student Information"
                            desc="Enter the basic details of the new student."
                        >
                            <StudentForm
                                form={form}
                                setField={setField}
                                loading={loading}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                            />
                        </FormCard>
                    </div>

                </div>
            </div>

            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                toastStyle={{
                    borderRadius: "12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                }}
            />
        </>
    );
}
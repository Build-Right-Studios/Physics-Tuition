// Pages/CreateSubTopic.jsx

import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PageHeader from "../Components/SubTopic/PageHeader";
import SubTopicForm from "../Components/SubTopic/SubTopicForm";

export default function CreateSubTopic() {
    const navigate = useNavigate();

    return (
        <>
            {/* Full-page background */}
            <div className="min-h-screen bg-slate-100 flex flex-col items-center sm:justify-center sm:py-8">

                {/* Mobile-first card shell */}
                <div className="w-full max-w-[430px] bg-slate-100 min-h-screen sm:min-h-0 sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl sm:shadow-slate-300/60 flex flex-col">

                    <PageHeader onBack={() => navigate(-1)} />

                    <SubTopicForm
                        onSuccess={() => navigate("/dashboard")}
                        onCancel={() => navigate(-1)}
                    />
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
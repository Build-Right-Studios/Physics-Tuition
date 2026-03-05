// Pages/AddChapterPage.jsx
import { useNavigate } from "react-router-dom";
import AddChapterForm from "../Components/Chapters/AddChapterForm.jsx";
import PageHeader from "../Components/Chapters/PageHeader.jsx";

export default function AddChapterPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader onBack={() => navigate(-1)}/>
      <AddChapterForm />
    </>
  );
}
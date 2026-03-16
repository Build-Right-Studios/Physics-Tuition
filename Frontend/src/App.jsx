import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage.jsx";
import DashboardPage from "./Pages/DashboardPage.jsx";
import QuestionsPage from "./Pages/Questionspage.jsx";
import ProtectedLayout from "./Components/Layout/ProtectedLayout.jsx";
import AddChapterPage from "./Pages/AddChapterPage.jsx";
import CreateSubTopic from "./Pages/CreateSubTopic.jsx";
import AddStudentPage from "./Pages/AddStudentPage.jsx";
import AddQuestionPage from "./Pages/AddQuestionPage.jsx";
import SimilarityResultPage from "./Pages/SimilarityResultPage.jsx";
import EditQuestionPage from "./Pages/EditQuestionPage.jsx";
import QuestionDetailPage from "./Pages/QuestionDetailPage.jsx";
import GenerateAssignmentPage from "./Pages/GenerateAssignmentPage.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes — all share the global navbar via ProtectedLayout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard"         element={<DashboardPage />} />
          <Route path="/questions/:exam"   element={<QuestionsPage />} />
          <Route path="/chapters/add"      element={<AddChapterPage />} />
          <Route path="/subtopics/add"      element={<CreateSubTopic />} />
          <Route path="/students/add"      element={<AddStudentPage />} />
          <Route path="/questions/add"                element={<AddQuestionPage />} />          
          <Route path="/questions/similarity-result"  element={<SimilarityResultPage />} />
          <Route path="/questions/edit/:id"          element={<EditQuestionPage />} />
          <Route path="/questions/detail/:id" element={<QuestionDetailPage />} />
          <Route path="/assignments/generate"  element={<GenerateAssignmentPage />} />

          {/* 🔧 Add new routes here as pages are built */}
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
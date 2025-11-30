import { Navigate, useParams } from "react-router-dom";

export default function ProtectedWinnerRoute({ targetDate, children }) {
  const { id } = useParams();

  if (new Date() < targetDate) {
    return <Navigate to={`/nominees/${id}`} replace />;
  }

  return children;
}
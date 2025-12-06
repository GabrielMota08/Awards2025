import { Navigate, useParams } from "react-router-dom";

export default function ProtectedWinnerRoute({ isVotingEnded, children }) {
  const { token, id } = useParams();

  if (!isVotingEnded) {
    return <Navigate to={`/nominees/${token || 1}/${id || 0}`} replace />;
  }

  return children;
}
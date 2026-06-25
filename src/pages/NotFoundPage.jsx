import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <p className="text-9xl font-display font-bold text-primary-100">404</p>
        <h1 className="text-3xl font-display font-bold text-dark-900 -mt-4 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate(-1)} className="btn-outline">Go Back</button>
          <button onClick={() => navigate("/")} className="btn-primary">Back to Home</button>
        </div>
      </div>
    </div>
  );
}

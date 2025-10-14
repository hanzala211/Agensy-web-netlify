import React from "react";
import { IMAGES } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";
import { Navigate, Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  const { userData } = useAuthContext();

  if (userData) return <Navigate to={`/`} />;

  return (
    <React.Fragment>
      <div className="min-h-screen w-full flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2 bg-primaryColor items-center justify-center p-8">
          <div className="max-w-md text-center">
            <img
              src={IMAGES.logo}
              alt="Logo"
              className="w-48 h-20 mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-white mb-4">
              Welcome to Agensy
            </h1>
            <p className="text-white text-lg">
              Your trusted platform for managing client relationships
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-lightGray h-screen min-h-screen overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-basicWhite rounded-xl shadow-lg md:p-8 p-6 w-full max-w-xl">
              <div className="md:hidden flex justify-center mb-6">
                <img src={IMAGES.logo} alt="Logo" className="w-16 h-16" />
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      ;
    </React.Fragment>
  );
};

export default AuthLayout;

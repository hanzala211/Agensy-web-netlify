import React from "react";
import { AppointmentCard, Card } from "@agensy/components";
import { ICONS, ROUTES, DASHBOARD_DUMMY_APPOINTMENTS } from "@agensy/constants";
import { useNavigate } from "react-router-dom";

export const AppointmentsDashboardCard: React.FC = () => {
  const navigate = useNavigate();
  const appointments = DASHBOARD_DUMMY_APPOINTMENTS;

  return (
    <Card
      title="Appointments"
      buttonText={<ICONS.eyeOn />}
      ariaLabel="View all appointments"
      onButtonClick={() => navigate(ROUTES.appointments)}
      className="border-gray-300"
    >
      <div className="flex flex-col h-full  ">
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-center">No appointments found</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppointmentsDashboardCard;

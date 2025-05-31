import {
  HealthCareCard,
  PersonalInfoCard,
  ContactInfoCard,
  ClientNoteCard,
  MedicalInfoCard,
} from "@agensy/components";

export const ClientOverview: React.FC = () => {
  return (
    <div className="grid grid-rows-[auto,auto,auto] gap-8 max-w-7xl mx-auto md:p-6 bg-gradient-to-br from-gray-50/50 to-basicWhite/80 rounded-2xl">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
        <PersonalInfoCard />
        <ContactInfoCard />
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
        <MedicalInfoCard />
        <HealthCareCard />
      </div>
      <ClientNoteCard />
    </div>
  );
};

export default ClientOverview;

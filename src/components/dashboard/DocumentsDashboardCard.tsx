import React from "react";
import { Card, DocumentCard } from "@agensy/components";
import { ICONS, ROUTES, DASHBOARD_DUMMY_DOCUMENTS } from "@agensy/constants";
import { useNavigate } from "react-router-dom";

export const DocumentsDashboardCard: React.FC = () => {
  const navigate = useNavigate();
  const documents = DASHBOARD_DUMMY_DOCUMENTS;

  return (
    <Card
      title="Documents"
      buttonText={<ICONS.eyeOn className="w-4 h-4" />}
      ariaLabel="View all documents"
      className="border-gray-300"
      onButtonClick={() => navigate(ROUTES.documents)}
    >
      <div className="flex flex-col h-full">
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                doc={document}
                onPreview={() => navigate(`${ROUTES.documents}/${document.id}`)}
                showLabel={true}
                showClientName={document.client_id ? true : false}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-center">No documents found</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DocumentsDashboardCard;

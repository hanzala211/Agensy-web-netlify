import { PageHeader, TabLink } from "@agensy/components";
import { ROUTES } from "@agensy/constants";
import type React from "react";
import { Outlet, useParams } from "react-router-dom";

export const Templates: React.FC = () => {
  const params = useParams();

  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full px-4 py-6">
      <PageHeader
        title="Templates"
        showBackButton={params.templateId ? true : false}
        showButton={false}
      />
      <div className="border-[1px] border-mediumGray px-2 sm:px-5 rounded-xl mt-4">
        {!params.templateId && (
          <div className="flex flex-wrap md:flex-nowrap border-b border-mediumGray w-full">
            <TabLink to={ROUTES.templates} end>
              List
            </TabLink>
            <TabLink to={ROUTES.completedTemplates}>Completed</TabLink>
          </div>
        )}
      </div>
      <main className="mt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Templates;

import { BrowserRouter } from "react-router-dom";
import "./index.css";
import {
  AppointmentsProvider,
  AuthProvider,
  ClientProvider,
  DocumentProvider,
  ReactQueryProvider,
} from "@agensy/context";
import Routes from "./routes";

const App: React.FC = () => {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <ClientProvider>
            <DocumentProvider>
              <AppointmentsProvider>
                <Routes />
              </AppointmentsProvider>
            </DocumentProvider>
          </ClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  );
};

export default App;

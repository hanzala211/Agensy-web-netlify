import { BrowserRouter } from "react-router-dom";
import "./index.css";
import {
  AppointmentsProvider,
  AuthProvider,
  ClientProvider,
  DocumentProvider,
  MessagesProvider,
  ReactQueryProvider,
  SocketProvider,
} from "@agensy/context";
import Routes from "./routes";

const App: React.FC = () => {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <SocketProvider>
          <AuthProvider>
            <ClientProvider>
              <DocumentProvider>
                <AppointmentsProvider>
                  <MessagesProvider>
                    <Routes />
                  </MessagesProvider>
                </AppointmentsProvider>
              </DocumentProvider>
            </ClientProvider>
          </AuthProvider>
        </SocketProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  );
};

export default App;

import { ReactNode } from "react";

import { DialogContextProvider } from "@edge-effect/react-abstract-dialog";
import Confirm from "../component/popup/confirm";
import Alert from "../component/popup/alert";
import Toast from "../component/popup/toast";
import { Outlet } from "react-router-dom";

const AppContent = () => {
    return (
        <>
            <DialogContextProvider
                experimental_withHistory={true}
                ToastContainer={({ children }: { children: ReactNode }) => {
                    return <div className="toast-container">{children}</div>;
                }}
                Confirm={Confirm}
                Alert={Alert}
                Toast={Toast}>
                <Outlet />
            </DialogContextProvider>
        </>
    );
};

export default AppContent;

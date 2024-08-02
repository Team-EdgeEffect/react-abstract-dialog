import React, { useEffect } from "react";
import { DialogActionContext, DialogActionContextProviderActions } from "../context/dialog-action-context-provider";

interface UseDialogActionContextConfig {
    hideDuration?: number;
}

export function useDialogActionContext<DialogResult = void>(config?: UseDialogActionContextConfig) {
    const c = React.useContext(DialogActionContext);

    useEffect(() => {
        if (config?.hideDuration !== undefined) {
            if (config?.hideDuration > 0) {
                c.hideAfter(config?.hideDuration);
            } else {
                c.hide();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config?.hideDuration, c.dialog?.hash]);

    return c as DialogActionContextProviderActions<DialogResult>;
}

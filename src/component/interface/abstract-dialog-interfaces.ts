import { ReactNode } from "react";
import { ToastProps } from "./toast-interfaces";

export const DIALOG_TYPE_CONFIRM = "confirm";
export const DIALOG_TYPE_ALERT = "alert";
export const DIALOG_TYPE_TOAST = "toast";
export const DIALOG_TYPE_CUSTOM = "custom";
export type DialogType = typeof DIALOG_TYPE_CONFIRM | typeof DIALOG_TYPE_ALERT | typeof DIALOG_TYPE_TOAST | typeof DIALOG_TYPE_CUSTOM;

export interface ControlOptions {
    ignoreHistory?: boolean; // default false
}
export interface DialogOptions extends ControlOptions {
    unique?: string; // unique 를 할당하면, 해당 unique 로 2개 이상(visible) 표시 되지 않도록 합니다.
    dialogType?: DialogType;
    onDismiss?: () => void;
}

export interface Dialog<DialogResult = unknown> {
    id: number;
    element: ReactNode;
    visible: boolean;
    resolve: (value: ShowDialogResult<DialogResult> | PromiseLike<ShowDialogResult<DialogResult>>) => void;
    options?: DialogOptions;
    hash?: number;
    order: number;
}

export interface ShowToastProps extends ToastProps {
    unique?: string;
}

export interface ShowDialogResult<DialogResult = unknown> {
    id: number;
    result: DialogResult | undefined;
}

export type UpdateDialog = Partial<Pick<Dialog, "visible" | "options">>;

export interface NavigateOptions {
    keepVisibleDialog?: boolean; // default false if withHistory
}

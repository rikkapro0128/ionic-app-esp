import { SnackbarContent } from "notistack";
import { forwardRef } from "react";

import { IconLogoThisApp } from "../../icons";

interface SnackProps {
  id: string;
  message: string;
  title?: string;
  onClose: () => void;
}

export const SnackBar = forwardRef<HTMLDivElement, SnackProps>(
  (props, ref) => {
    const {
      // You have access to notistack props and options 👇🏼
      id,
      message,
      title = 'Thông báo',
      // as well as your own custom props
      onClose,
      ...other
    } = props;

    return (
      <SnackbarContent ref={ref} role="alert" {...other}>
        <div
          className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <IconLogoThisApp className="h-8 w-8" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={onClose}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none active:opacity-70"
            >
              Đóng
            </button>
          </div>
        </div>
      </SnackbarContent>
    );
  }
);

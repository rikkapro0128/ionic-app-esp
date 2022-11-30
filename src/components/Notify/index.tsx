import { memo } from "react";
import toast from 'react-hot-toast';

import { IconLogoThisApp } from '../../icons';

interface PropsType {
  state: {
    id: any,
    visible: boolean,
  },
  title: string,
  body: string,
}

function Notify({ state, title, body }: PropsType) {
  return (
    <div
      className={`${
        state.visible ? 'animate-in slide-in-from-top' : 'animate-out fade-out slide-out-to-top fill-mode-forwards'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <IconLogoThisApp className="h-10 w-10 rounded-full" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              { title }
            </p>
            <p className="mt-1 text-sm text-gray-500">
              { body }
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(state.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}

export default memo(Notify);

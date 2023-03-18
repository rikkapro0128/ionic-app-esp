import { memo } from "react";
import { IconGhost } from '../../../icons';

function NotFound () {
  return (
    <div className="flex flex-nowrap">
      <span className="italic ">Thiết bị này không hợp lệ hoặc đang trong quá trình phát triển</span>
      <IconGhost className='w-8 h-8 fill-slate-700' />
    </div>
  )
}

export default memo(NotFound);

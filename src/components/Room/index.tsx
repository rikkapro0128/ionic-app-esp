import { memo } from "react";

import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RouterIcon from '@mui/icons-material/Router';

import { IconRoom } from '../../icons';

export interface RoomInfo {
  idRoom: string,
  name: string,
  sub?: string,
  numberOfDevice?: number,
}

interface PropType {
  room: RoomInfo,
}

const Room = ({ room }: PropType) => {
  return (
    <div className="border-2 active:scale-[99%] transition-transform rounded-md text-sm bg-gradient-to-r from-indigo-400 to-indigo-500 text-slate-50 shadow-md shadow-indigo-400 p-4">
      <p className="flex items-center">
        <IconRoom className="w-10 h-10 fill-slate-50" />
        <span className="ml-2 text-lg font-semibold">{ room.name }</span>
      </p>
      <p className="mt-1 text-sm">
        <span>Mô tả: </span>
        <span className="italic">{ room.sub ? room.sub : 'Chưa được môt tả' }</span>
      </p>
      <p className="mt-4">
        <span>Thiết bị hiện có : </span>
        <span>{ room.numberOfDevice ? room.numberOfDevice : 0 }</span>
      </p>
    </div>
  );
}

export default memo(Room);

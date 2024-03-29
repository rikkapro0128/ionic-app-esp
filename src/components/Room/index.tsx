import { memo, useEffect } from "react";

import { useTheme } from "@mui/material/styles";

import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RouterIcon from "@mui/icons-material/Router";

import { IconRoom } from "../../icons";
import WaveBall from "../../assets/gif/wave-ball.gif";
import StarMuti from "../../assets/gif/star-1.gif";

import { RoomType } from '../../store/slices/roomsSlice';
import { ColorMode } from '../../ConfigGlobal';

interface PropType {
  room: RoomType;
  className: string;
}

const Room = ({ room, className }: PropType) => {
  const theme = useTheme();

  return (
    <div
      className={`active:scale-[99%] transition-transform rounded-md text-sm bg-gradient-to-r shadow-md ${ theme.palette.mode === ColorMode.LIGHT ? 'from-indigo-400 to-indigo-500 shadow-indigo-400' : `from-slate-700 to-slate-900` } ${className}`}
    >
      <div className="relative overflow-hidden p-4">
        <img
          style={{
            rotate: `${Math.floor(Math.random() * (0 - 180) + 0)}deg`,
          }}
          className={`absolute h-full object-contain opacity-50 -top-1/2 -right-5`}
          src={WaveBall}
          alt="wave-ball"
        />
        <img
          className={`absolute h-full object-contain scale-[0.2] top-0 right-0`}
          src={StarMuti}
          alt="star-muti"
        />
        <p className="flex items-center">
          <IconRoom className="w-10 h-10 fill-slate-50" />
          <span className="ml-2 text-lg font-semibold">{room.name}</span>
        </p>
        <p className="mt-1 text-sm">
          <span>Mô tả: </span>
          <span className="italic">
            {room.sub ? room.sub : "Chưa được môt tả"}
          </span>
        </p>
        <div className="flex justify-between items-end text-sm">
          <p className="mt-4">
            <span>Thiết bị hiện có : </span>
            <span>{room.devicesOwn ? room.devicesOwn.length : 0}</span>
          </p>
          <p>
            <span>Ngày tạo: </span>
            <span>{room.createAt ? room.createAt : "không xác định."}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(Room);

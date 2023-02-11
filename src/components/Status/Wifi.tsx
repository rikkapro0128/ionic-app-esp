import { memo, useState } from "react";
import { WifiPresent , WifiInfo} from "../../pages/Connect";
import { IconNode } from "../../icons/index";

interface PropsType {
  end: boolean;
  payload: WifiInfo;
  present?: WifiPresent;
  onClick: (wifi: WifiInfo) => void;
  onConfig?: (wifi: WifiInfo) => void;
}

const StatusWifi = ({
  payload,
  onClick,
  end,
  present,
  onConfig,
}: PropsType) => {
  const [idTimeOut, setIdTimeOut] = useState<NodeJS.Timeout>();

  const onMouseUp = () => {
    // console.log('Press Up');
    console.log('clear', idTimeOut);
    
    clearTimeout(idTimeOut);
  };
  const onMouseDown = () => {
      // console.log('Press Down');
    const id = setTimeout(() => {
      if(typeof onConfig === 'function' && present?.BSSID === payload.BSSID) { onConfig(payload); }
    }, 1000);
    setIdTimeOut(id);
  };

  return (
    <div
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
      onClick={() => {
        onClick(payload);
      }}
      className={`py-4 active:bg-slate-200 transition-colors grid grid-cols-6 ${
        end ? "" : "border-t-[1px]"
      }`}
    >
      <div className="col-span-3 flex mr-4">
        <IconNode className="fill-slate-700 w-4 h-4 mr-4" />
        <span className="flex-1 max-w-[150px] overflow-x-scroll whitespace-nowrap text-ellipsis">
          {payload.SSID || "NaN"}
        </span>
      </div>
      <div className="col-span-3 flex justify-between items-center">
        <span>
          {payload.frequency ? (payload.frequency > 2000 && payload.frequency < 3000 ? "2.4" : "5") : "NaN"}Ghz
        </span>
        {present?.BSSID === payload.BSSID ? (
          <span className="border-[1px] border-green-600 text-green-600 py-1 px-2 rounded-full text-xs">
            connected
          </span>
        ) : null}
        <span>{Math.min(Math.max(2 * (payload.level + 100), 0), 100) || 0}%</span>
      </div>
    </div>
  );
};

export default memo(StatusWifi);

import { memo } from "react";
import { WifiPresent } from '../../pages/Connect';
import { IconNode } from '../../icons/index';

interface PropsType {
  end: boolean,
  bssid: string,
  ssid: string,
  type: number,
  quality: number,
  present?: WifiPresent,
  onClick: (ssid: string, bssid: string) => void,
}

const StatusWifi = ({ bssid, quality, onClick, ssid, type, end, present }: PropsType) => {
  return (
    <div onClick={() => { onClick(ssid, bssid) }} className={`py-4 active:bg-slate-200 transition-colors grid grid-cols-6 ${end ? '' : 'border-t-[1px]'}`}>
      <div className="col-span-3 flex mr-4">
        <IconNode className='fill-slate-700 w-4 h-4 mr-4' />
        <span className="flex-1 max-w-[150px] overflow-x-scroll whitespace-nowrap text-ellipsis">{ ssid || 'NaN' }</span>
      </div>
      <div className="col-span-3 flex justify-between items-center">
        <span>{ type ? type > 2000 && type < 3000 ? '2.4' : '5' : 'NaN' }Ghz</span>
        {
          present?.BSSID === bssid  ? <span className="border-[1px] border-green-600 text-green-600 py-1 px-2 rounded-full text-xs">connected</span> : null
        }
        <span>{ Math.min(Math.max(2 * (quality + 100), 0), 100) || 0 }%</span>
      </div>
    </div>
  );
};

export default memo(StatusWifi);

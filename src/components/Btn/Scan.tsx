import { memo } from "react";

interface PropsType {
  title?: string,
  second?: string,
  isScan: boolean,
  size?: number,
  fontSizePrimary?: number,
  fontSizeSecond?: number,
  onCLick?: React.MouseEventHandler | undefined,
}

const BtnScan = ({ onCLick, isScan, title, second, size, fontSizePrimary, fontSizeSecond }: PropsType) => {
  return (
    <div style={{
      height: size + 'px',
      width: size + 'px',
    }} className={`h-full aspect-square m-auto relative py-5`}>
      <div
        className={`h-full aspect-square mx-auto bg-slate-300 rounded-full ${
          isScan ? "animate-ping" : ""
        }`}
      ></div>
      <div
        className={`absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-400 m-auto rounded-full shadow-md transition-transform ${
          isScan ? "scale-100" : "scale-125"
        }`}
      ></div>
      <div
        onClick={onCLick}
        className={`absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#494d5f] m-auto rounded-full shadow-md flex justify-center items-center flex-col`}
      >
        <span style={{ fontSize: fontSizePrimary + 'px' ?? 'auto' }} className="uppercase text-2xl">{ title || 'quét'}</span>
        <span style={{ fontSize: fontSizeSecond + 'px' ?? 'auto' }} className="uppercase text-xs mt-1">{ second ? second : '(chạm quét)' }</span>
      </div>
    </div>
  );
};

export default memo(BtnScan);

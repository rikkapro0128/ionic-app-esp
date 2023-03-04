import { memo } from "react";

interface PropsType {
  isScan: boolean;
  onCLick?: React.MouseEventHandler | undefined;
}

const BtnScan = ({ onCLick, isScan }: PropsType) => {
  return (
    <div className={`w-52 h-52 m-auto relative my-5`}>
      <div
        className={`w-full h-full bg-slate-300 rounded-full ${
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
        <span className="uppercase text-2xl">quét wifi</span>
        <span className="uppercase text-xs mt-1">(chạm là quét)</span>
      </div>
    </div>
  );
};

export default memo(BtnScan);

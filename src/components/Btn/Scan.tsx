import { memo } from "react"

interface PropsType {
  onCLick?: React.MouseEventHandler | undefined,
}

const BtnScan = ({ onCLick }: PropsType) => {
  return <div onClick={onCLick} className="w-52 h-52 bg-slate-400 m-auto rounded-full shadow-md my-5 flex justify-center items-center">
    <div className="w-3/4 h-3/4 bg-[#494d5f] m-auto rounded-full shadow-md my-5 flex justify-center items-center flex-col">
      <span className="uppercase text-2xl">quét wifi</span>
      <span className="uppercase text-xs mt-1">(click me)</span>
    </div>
  </div>;
}

export default memo(BtnScan);


import { memo, useState, useRef, useEffect } from "react";
import { WidgetType } from "../../Widget/type";
import { TypeLogicControl } from "../OptionType/Logic";

import { ref, remove } from "firebase/database";
import { database } from "../../../firebase/db";

import { useSnackbar, PropsSnack } from "../../../hooks/SnackBar";

interface PropsType {
  timeParser: string;
  dateParser: string;
  className: string;
  pathUpdate: string;
  type?: WidgetType;
  value: number;
}

const TimerView = ({
  dateParser,
  timeParser,
  className,
  type,
  value,
  pathUpdate,
}: PropsType) => {
  const [activeSnack, closeSnack] = useSnackbar();
  const [expand, setExpand] = useState(false);
  const [autoWidth, setAutoWidth] = useState(0);

  const timerBtnElement = useRef<HTMLDivElement>(null);

  const onClick = (event: React.MouseEvent) => {
    setExpand(!expand);
  };

  const onClickEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  const onClickRemove = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const dbRef = ref(database, pathUpdate);
      await remove(dbRef);
      activeSnack({
        title: "Xoá rồi",
        message: `Đã xoá thành công timer - ${timeParser} - ${dateParser}`,
      } as PropsSnack & string);
    } catch (error) {
      activeSnack({
        title: "Lỗi rồi",
        message: `Không thể xoá timer - ${timeParser} - ${dateParser}`,
      } as PropsSnack & string);
    }
  };

  useEffect(() => {
    if (timerBtnElement.current) {
      setAutoWidth(timerBtnElement.current.offsetWidth);
    }
  }, [timerBtnElement.current]);

  return (
    <div
      // style={{
      //   height: expand ? autoWidth + 40 : autoWidth,
      // }}
      onClick={onClick}
      className={`relative items-center border-[1px] border-slate-700 rounded-md ${className} transition-all min-h-[113px] overflow-hidden`}
    >
      <div className="flex justify-between transition-transform p-4">
        <div className="flex flex-col items-center">
          <span className="pb-2">Thời gian</span>
          <span className="text-3xl uppercase">{timeParser}</span>
          <span className="text-sm">{dateParser}</span>
        </div>
        <div
          style={{
            transform: `translateX(${expand ? `-${autoWidth}px` : "0"})`,
          }}
          className="flex flex-col items-center transition-transform"
        >
          <span className="pb-2">Điều khiển</span>
          <span className="text-3xl">
            {type === WidgetType.LOGIC
              ? TypeLogicControl[
                  value as unknown as keyof typeof TypeLogicControl
                ]
              : null}
          </span>
        </div>
      </div>
      <div
        ref={timerBtnElement}
        style={{
          transform: `translateX(${expand ? "0%" : "100%"})`,
        }}
        className="absolute right-0 top-0 flex transition-transform h-full"
        aria-label="flex"
      >
        <button
          onClick={onClickRemove}
          className="flex-1 px-5 bg-red-400 text-slate-50 active:opacity-50"
        >
          Xoá
        </button>
      </div>
    </div>
  );
};

export default memo(TimerView);

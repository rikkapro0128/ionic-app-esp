import { memo } from "react"

import Toggle from "./toggle";

import { WidgetType } from "../../Widget/type";

export interface PropsType {
  type: WidgetType,
  onExcuteChange?: (value: any, type: WidgetType) => void,
}

const WrapExcute = ({ type, onExcuteChange }: PropsType) => {
  if(type === WidgetType.LOGIC) {
    return <Toggle type={type} onChange={ typeof onExcuteChange === 'function' ? onExcuteChange : null }/>;
  }else {
    return null;
  }
}

export default memo(WrapExcute);

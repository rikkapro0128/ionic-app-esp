import { memo } from "react"

import Toggle from "./toggle";

import { WidgetType } from "../../Widget/type";

export interface PropsType {
  type: WidgetType,
  onConditionChange?: (value: any, type: WidgetType) => void,
}

const WrapCondition = ({ type, onConditionChange }: PropsType) => {
  if(type === WidgetType.LOGIC) {
    return <Toggle type={type} onChange={ typeof onConditionChange === 'function' ? onConditionChange : null }/>;
  }else {
    return null;
  }
}

export default memo(WrapCondition);

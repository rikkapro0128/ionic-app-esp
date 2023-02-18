import { memo, useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { WidgetType } from '../../Widget/type';

interface PropType {
  type: WidgetType | undefined,
  onChange: (value: any) => void;
}

export enum TypeSelect {
  CANCEL = 0,
  TURN_ON = 1,
  TURN_OFF = 2,
  REVERSE = 3,
}

export const TypeLogicControl = {
  1: 'Bật',
  2: 'Tắt',
  3: 'Đổi trạng thái',
}

const Option = ({ type, onChange }: PropType) => {
  const [menuLogic, setMenuLogic] = useState<Array<{ title: string, value: TypeSelect }>>([
    {
      title: "Bật",
      value: 1,
    },
    {
      title: "Tắt",
      value: 2,
    },
    {
      title: "Tự động",
      value: 3,
    },
  ]);
  const [presentPicker, setPresentPicker] = useState<TypeSelect>(menuLogic[0].value);

  const changeState = (event: SelectChangeEvent) => {
    setPresentPicker(parseInt(event.target.value));
    onChange(event.target.value);
  }

  return (
    <FormControl fullWidth variant="standard" sx={{ marginTop: 2 }}>
      <InputLabel id="demo-simple-select-filled-label">Loại điều khiển</InputLabel>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={presentPicker.toString()}
        onChange={changeState}
      >
        {
          menuLogic.map((menuItem) => (
            <MenuItem key={menuItem.title} value={menuItem.value}>{ menuItem.title }</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};

export default memo(Option);

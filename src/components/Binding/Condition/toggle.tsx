import { memo, ChangeEvent, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { WidgetType } from "../../Widget/type";

interface PropsType {
  type: WidgetType,
  onChange?: ((value: boolean, type: WidgetType) => void) | null,
}

const ConditionToggle = ({ type, onChange }: PropsType) => {
  const [value, setValue] = useState(false);

  const hanldeChange = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    const val = value === 'true' ? true : false;
    setValue(val);
    if(typeof onChange === 'function') {
      onChange(val, type);
    }
  }

  return (
    <RadioGroup
      row
      aria-labelledby="demo-row-radio-buttons-group-label"
      name="row-radio-buttons-group"
      className="flex-1"
      onChange={hanldeChange}
      value={value}
    >
      <FormControlLabel
        value={true}
        control={<Radio size="small" />}
        label="Bật"
      />
      <FormControlLabel
        value={false}
        control={<Radio size="small" />}
        label="Tắt"
      />
    </RadioGroup>
  );
};

export default memo(ConditionToggle);

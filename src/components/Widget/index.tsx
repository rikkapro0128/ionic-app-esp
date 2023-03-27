import { IconLight, IconAir, IconFan, IconSensor, IconColor, IconRGB } from '../../icons';

import WidgetToggle from "./Toggle";
import WidgetSlider from "./Slider";
import WidgetColor from "./Rgb";
import WidgetNotFound from "./NotFound";

import  { WidgetType, DeviceType } from './type';

interface ModeOfflineType {
  isOffline: boolean,
  host: string,
}

const icon = {
  air: <IconAir className='w-6 h-6 fill-inherit transition-colors' />,
  COLOR: <IconRGB className='w-6 h-6 fill-inherit transition-colors' />,
  fan: <IconFan className='w-6 h-6 fill-inherit transition-colors' />,
  TOGGLE: <IconLight className='w-6 h-6 fill-inherit transition-colors' />,
  sensor: <IconSensor className='w-6 h-6 fill-inherit transition-colors' />,
}

export const getTypeWidget = (device: DeviceType, idUser?: string | undefined, modeOffline?: ModeOfflineType) => {
  if (device.type === WidgetType.LOGIC) {
    return <WidgetToggle device={device} hostOffline={modeOffline?.host} isOffline={modeOffline?.isOffline} idUser={idUser} />;
  }
  // else if (device.type === "progress") {
  //   return <WidgetProgress device={device} idUser={idUser} />;
  // }
  else if (device.type === WidgetType.TRANSFORM) {
    return <WidgetSlider device={device} hostOffline={modeOffline?.host} isOffline={modeOffline?.isOffline} idUser={idUser} />;
  } else if (device.type === WidgetType.COLOR) {
    return <WidgetColor device={device} hostOffline={modeOffline?.host} isOffline={modeOffline?.isOffline} idUser={idUser} />;
  } else {
    return <WidgetNotFound />;
  }
};

export default icon;


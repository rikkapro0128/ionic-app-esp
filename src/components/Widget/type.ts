export enum WidgetType {
  LOGIC = "LOGIC",
  COLOR = "COLOR",
  TRANSFORM = "TRANSFORM",
}

export interface ColorType {
  r: number;
  g: number;
  b: number;
  contrast: number;
}

export interface DeviceType {
  id: string;
  name?: string;
  num?: number;
  pin?: number;
  sub?: string;
  value?: number | ColorType;
  state?: boolean;
  icon: string;
  type: WidgetType;
  uint?: string;
  node_id: string;
  room?: {
    id: string,
    name: string,
    pickAt?: number, 
  };
  [key: string]: any;
}

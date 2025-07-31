export interface AppSettings {
  menuMode?: 'horizontal' | 'popup' | 'overlay' |'static';
  dir?: 'ltr' | 'rtl';
  language?: string;
  menuActive?: boolean;
  topbarMenuActive?: boolean;
  hotlicensekey?: string;
}

export const defaults: AppSettings = {
  menuMode : 'horizontal',
  menuActive : true,
  topbarMenuActive: false,
  hotlicensekey: 'non-commercial-and-evaluation'
};

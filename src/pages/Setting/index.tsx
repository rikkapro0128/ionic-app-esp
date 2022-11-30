import Button from '@mui/material/Button';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import toast from 'react-hot-toast';

import Notify from '../../components/Notify';

const notify = () => toast.custom((t) => (
  <Notify title={'Thông báo'} body={'Push notìy thành công!'} state={t} />
), {
  duration: 3000,
});

function Setting() {

  const checkPermisstion = async () => {
    const isPass = await LocalNotifications.checkPermissions();
    if(isPass) {
      return true;
    }else {
      return await LocalNotifications.requestPermissions();
    }
  }

  const pushNotify = async () => {
    // const check = await checkPermisstion();
    // const notify: LocalNotificationSchema = {
    //   id: 1,
    //   title: 'Đăng xuất thành công',
    //   body: 'Bạn vừa mới đăng xuất tài khoản ... khỏi ứng dụng.',
    //   smallIcon: 'ic_stat_internet_of_things',
    //   largeIcon: 'ic_stat_internet_of_things',
    // }
    // if(check) {
    //   LocalNotifications.schedule({
    //     notifications: [
    //       notify,
    //     ]
    //   })
    // }
    notify();
  }

  return (
    <Button onClick={pushNotify} variant="contained">Push Notify!</Button>
  )
}

export default Setting;
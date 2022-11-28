import { memo } from "react";
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup
} from 'firebase/auth';

import {
  IonIcon,
} from '@ionic/react';

import { IconGoogle } from '../../icons';
import { chevronForwardCircleOutline } from 'ionicons/icons';

import app from '../../firebase';

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

function Sign() {

  const signInWithGoogle = async () => {
    try {
      const auth = getAuth(app);
      // console.log(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <div className='w-full h-full bg-[#edf1f5] p-8'>
      <div className='m-auto rounded-full'>
        <div className='bg-white w-28 h-28 m-auto rounded-full flex justify-center items-center' style={{ boxShadow: '0 14px 30px rgba(103,132,187,.1),0 4px 4px rgba(103,132,187,.04)' }}>
          <img className='w-full h-full scale-75 translate-x-[5px]' src="https://cdn-icons-png.flaticon.com/512/6119/6119533.png" alt="logo" />
        </div>
        <span className='text-center mt-4 text-slate-500 block'>Chào mừng bạn đến với ứng dụng</span>
      </div>
      <div className='flex flex-col'>
        <label className='font-semibold text-[rgb(81,97,112)] py-[10px] text-[1.5rem] capitalize' htmlFor='form-email'>email</label>
        <input className='rounded-md px-[16px] py-[11px] outline-none bg-white' placeholder='vd: abc@gmail.com' style={{ boxShadow: '0 14px 30px rgba(103,132,187,.1),0 4px 4px rgba(103,132,187,.04)' }} type="text" name="email" id="form-email" />
      </div>
      <div className='flex flex-col mt-1'>
        <label className='font-semibold text-[rgb(81,97,112)] py-[10px] text-[1.5rem] capitalize' htmlFor='form-email'>password</label>
        <input className='rounded-md px-[16px] py-[11px] outline-none bg-white' placeholder='Mật khẩu của bạn sẽ bị ẩn vd: ***' style={{ boxShadow: '0 14px 30px rgba(103,132,187,.1),0 4px 4px rgba(103,132,187,.04)' }} type="text" name="email" id="form-email" />
      </div>
      <button className='bg-indigo-500 group active:opacity-95 active:scale-[0.99] transition-colors shadow-lg flex rounded-full outline-none items-center p-4 relative justify-center mt-6 w-full'>
        <span className='uppercase text-white font-semibold'>đăng nhập</span>
        <IonIcon className='text-[#d9e6ff] absolute right-1 text-[3.2rem]' icon={chevronForwardCircleOutline}></IonIcon>
      </button>
      {/* Divider */}
      <div className='flex flex-nowrap items-center my-5'>
        <span className='flex-1 bg-slate-400 h-[1px]'></span>
        <span className='text-slate-600 font-semibold mx-2'>kết nối với</span>
        <span className='flex-1 bg-slate-400 h-[1px]'></span>
      </div>
      <button onClick={signInWithGoogle} className='flex flex-nowrap px-4 py-3 rounded-md items-center justify-around w-full bg-white active:opacity-95 active:scale-[0.99]' style={{ boxShadow: '0 14px 30px rgba(103,132,187,.1),0 4px 4px rgba(103,132,187,.04)' }}>
        <IconGoogle className='text-2xl' />
        <span className='text-slate-500'>Đăng nhập với Google</span>
      </button>
    </div>
  )
}

export default memo(Sign);

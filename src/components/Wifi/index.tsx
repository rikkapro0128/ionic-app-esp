import { memo, useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function AuthWifi() {
  const [loading, setLoading] = useState(false);

  return (
    loading
    ?
    <div>
      ứng dụng đang chế độ offline vui lòng kết nối internet để sử dụng ứng dùng này
    </div>
    :
    <Outlet />
  )
} 

export default AuthWifi;

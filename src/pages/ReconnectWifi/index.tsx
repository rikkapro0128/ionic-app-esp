import { memo, useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';

function Reconnect () {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-opacity-80 bg-black">
      <Dialog sx={{ '& .MuiPaper-root': {
        backgroundColor: 'transparent',
        boxShadow: 'none'
      } }} open={true}>
        <CircularProgress sx={{ color: 'white', margin: '0 auto' }} />
        <Typography className="text-white pt-5" variant="subtitle1" gutterBottom>
          Đang khởi động lại kết nối mạng!
        </Typography>
      </Dialog>
    </div>
  )
}

export default memo(Reconnect);
import { memo } from 'react';

import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function CheckUser() {

  return (
    <Dialog sx={{ '& .MuiPaper-root': {
      backgroundColor: 'transparent',
      boxShadow: 'none'
    } }} open={true}>
      <CircularProgress sx={{ color: 'white', margin: '0 auto' }} />
      <Typography className="text-white pt-5" variant="subtitle1" gutterBottom>
        Đang kiểm tra đăng nhập!
      </Typography>
    </Dialog>
  )
}

export default memo(CheckUser);

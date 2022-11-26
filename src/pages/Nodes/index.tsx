import { memo, useState } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grow from '@mui/material/Grow';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { IconNode } from '../../icons';

function Nodes() {
  const [nodes, setNodes] = useState([
    {
      id: 1,
      name: 'esp8266-jhw7i65a2a',
      state: 'online',
    },
    {
      id: 2,
      name: 'esp8266-j2w3i6sa2a',
      state: 'online',
    },
    {
      id: 3,
      name: 'esp8266-jsw1i65a4a',
      state: 'offline',
    },
    {
      id: 4,
      name: 'esp8266-jhw0i6sa2a',
      state: 'offline',
    },
  ]);

  return (
  <Grow in={true}>
    <Box className="grid grid-cols-2 gap-3 p-3">
      {
        nodes.map(node => (
          <Box key={node.id} className="flex flex-col p-3 items-center rounded-2xl border-indigo-600 border-2 shadow-md">
            <Box className='flex flex-nowrap justify-between items-center w-full'>
              <Box className={`w-4 h-4 ml-3 rounded-full shadow-sm ${ node.state === 'online' ? 'shadow-green-400 bg-green-400' : 'bg-gray-400 shadow-gray-400' }`} />
              <IconButton aria-label="delete">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Box>
              <IconNode className='w-12 h-12 my-3 fill-slate-600' />
            </Box>
            <Typography className='text-slate-600' variant="subtitle1">{ node.name }</Typography>
          </Box>
        ))
      }
    </Box>
  </Grow>
  )
}

export default memo(Nodes)
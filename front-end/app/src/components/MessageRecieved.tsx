import { Avatar, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import avatar2 from '../assets/avatar2.png'

interface MessageProps {
  msg: string
}
const MessageRecieved = ({ msg }: MessageProps) => {
  return (
    <div>
      <Stack
        spacing={0}
        sx={{
          width: '335px',
        }}>
        <Box
          sx={{
            backgroundColor: '#2E3256',
            width: '300px',
            padding: '0.7em',
            borderRadius: '14px',
            marginLeft: '10%',
          }}>
          <Typography
            sx={{
              fontFamily: 'Lexend',
              fontStyle: 'normal',
              fontWeight: '500',
              fontSize: '15px',
              lineHeight: '140%',
            }}>
            {msg}
          </Typography>
        </Box>
        <Avatar
          sx={{
            height: '47px',
            width: '47px',
            backgroundColor: "#FFF",
            padding: "3px",
          }}
          alt="Lion" src={avatar2} imgProps={{ style: { width: 'auto' } }} />
      </Stack>
    </div>
  )
}

export default MessageRecieved
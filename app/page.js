import { Box, Button, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={30}
      py={15}
      sx={{
        backgroundImage: "url('/bg-image.png')",
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat", 
      }}
      >
        <Box
          height="100%"
          width="100%"
          bgcolor="white"
          border="3px solid black"
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            boxShadow: '10px 10px 0px 0px rgba(0, 0, 0, 1)',
          }}>
            <Typography
              variant="h2"
              pt={3}
              sx={{
                fontWeight: 'bold'
              }}>
              15 Or Less
            </Typography>

            <Typography
              variant="h5"
              py={8}>
              8 Words, 15 Chances. Can You Guess It?
            </Typography>

            <Button 
              href="/sign-in"
              variant="contained" 
              disableRipple
              sx={{
                py: 2,
                width: '50%',
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'black',
                background: 'white', 
                border: '3px solid black',
                borderRadius: '3',
                cursor: 'pointer',
                textTransform: 'none',
                boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                '&:hover': {
                  boxShadow: '7px 7px 0px 0px rgba(0, 0, 0, 1)',
                }, 
                '&:active': {
                  boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                }
              }}>
                Log In
            </Button>

            <Button 
              variant="contained" 
              disableRipple
              sx={{
                mt: 3,
                py: 2,
                width: '50%',
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white',
                background: '#E867EA', 
                border: '3px solid black',
                borderRadius: '3',
                cursor: 'pointer',
                textTransform: 'none',
                boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                '&:hover': {
                  boxShadow: '7px 7px 0px 0px rgba(0, 0, 0, 1)',
                }, 
                '&:active': {
                  boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                }
              }}>
                Start Playing
            </Button>
        </Box>
    </Box>
  );
}

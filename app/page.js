
'use client'

import { Box, Button, Modal, Typography, List, ListItem } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton, SignOutButton } from '@clerk/nextjs'
import { Alfa_Slab_One } from "next/font/google";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from "react";

const alfaSlabOne = Alfa_Slab_One({
  weight: '400', 
  subsets: ['latin'], 
  display: 'swap',
});

export default function Home() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>
      
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={2}
        py={2}
        sx={{
          backgroundImage: "url('/bg-image.png')",
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat", 
        }}
      >
        <Box
          height="auto"
          width="90%"
          maxWidth="600px"
          bgcolor="white"
          border="3px solid black"
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            boxShadow: '10px 10px 0px 0px rgba(0, 0, 0, 1)',
            borderRadius: 1,
            p: {xs: 4, sm: 8, md: 10, lg: 10},
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: alfaSlabOne.style.fontFamily,
              textAlign: 'center',
              fontSize: { xs: 'h4.fontSize', sm: 'h3.fontSize' },
            }}
          >
            15 Or Less
          </Typography>

            
            
          <Typography
            variant="h6"
            sx={{ 
              textAlign: 'center',
              py: 2,
              fontSize: { xs: 'body1.fontSize', sm: 'h6.fontSize' },
            }}
          >
            8 Words, 15 Chances. Can You Guess It?
          </Typography>

          <Button 
            href="/game"
            variant="contained" 
            disableRipple
            sx={{
              mb: 2,
              py: 1.5,
              width: '80%',
              fontSize: { xs: '16px', sm: '20px' },
              color: 'black',
              background: '#BCD4B4', 
              border: '3px solid black',
              borderRadius: 1,
              cursor: 'pointer',
              textTransform: 'none',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
              '&:hover': {
                boxShadow: '7px 7px 0px 0px rgba(0, 0, 0, 1)',
              }, 
              '&:active': {
                boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
              }, 
              fontFamily: alfaSlabOne.style.fontFamily,
            }}
          >
            Start Playing
          </Button>

          <SignedOut>
            <Button 
              href="/sign-in"
              variant="contained" 
              disableRipple
              sx={{
                mb: 3,
                py: 1.5,
                width: '80%',
                fontSize: { xs: '16px', sm: '20px' },
                color: 'black',
                background: 'white', 
                border: '3px solid black',
                borderRadius: 1,
                cursor: 'pointer',
                textTransform: 'none',
                boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                '&:hover': {
                  boxShadow: '7px 7px 0px 0px rgba(0, 0, 0, 1)',
                }, 
                '&:active': {
                  boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                }, 
                fontFamily: alfaSlabOne.style.fontFamily,
              }}
            >
              Log In
            </Button>
            
          </SignedOut>

        <SignedIn>
          <SignOutButton>
            <Button
              variant="contained" 
              disableRipple
              sx={{
                mb: 3,
                py: 1.5,
                width: '80%',
                fontSize: { xs: '16px', sm: '20px' },
                color: 'black',
                background: 'white', 
                border: '3px solid black',
                borderRadius: 1,
                cursor: 'pointer',
                textTransform: 'none',
                boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                '&:hover': {
                  boxShadow: '7px 7px 0px 0px rgba(0, 0, 0, 1)',
                }, 
                '&:active': {
                  boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                }, 
                fontFamily: alfaSlabOne.style.fontFamily,
              }}
            >
              Sign Out
            </Button>
          </SignOutButton>
        </SignedIn>

          <Box onClick={handleOpen} sx={{ 
            cursor: 'pointer', 
            '&:hover': {
              '& .MuiSvgIcon-root': {
                color: 'black', 
                transform: 'scale(1.1)', 
              },
            } 
          }}>
            <HelpOutlineIcon style={{ fontSize: 40 }}/>
          </Box>
          
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="how-to-play-title"
        aria-describedby="how-to-play-description"
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width="90%"
          maxWidth="500px"
          bgcolor="white"
          boxShadow="5px 5px 0px 0px rgba(0, 0, 0, 1)"
          p={3}
          sx={{
            transform: "translate(-50%, -50%)", 
            border: "3px solid black",
            outline: "none",
            borderRadius: 1,
          }}
        >
          <Typography id="how-to-play-title" variant="h5" component="h2" sx={{ fontFamily: alfaSlabOne.style.fontFamily }}>
            How to Play
          </Typography>

          <Typography id="how-to-play-description" variant="h6" sx={{ mt: 1 }}>
            Guess all <span style={{fontWeight: 'bold'}}>8 words</span> within <span style={{ fontWeight: 'bold' }}>15 tries or less</span>.
          </Typography>
          
          <Typography sx={{ mt: 1, mb: 4, pl: 2 }}>
            <ul>
              <li>Each guess must be singular.</li>
              <li>Every wrong guess will provide you with another clue.</li>
              <li>Make connections with the clues given to you for your guesses.</li>
            </ul>
          </Typography>
          

          <Typography>
            A new puzzle will be released daily after midnight.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

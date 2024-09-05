'use client'
import React, { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alfa_Slab_One } from "next/font/google";
import Head from 'next/head';

const alfaSlabOne = Alfa_Slab_One({
  weight: '400', 
  subsets: ['latin'], 
  display: 'swap',
});

export default function SignInPage() {

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
            sx={{
                backgroundImage: "url('/bg-image.png')",
                backgroundSize: "cover", 
                backgroundPosition: "center", 
                backgroundRepeat: "no-repeat", 
                padding: 2,
            }}
        >
            
            <Box
                width={{ xs: '90%', sm: '80%', md: '60%', lg: '50%' }}
                maxWidth="600px"  
                height="auto"
                bgcolor="white"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                border="3px solid black"
                sx={{
                    boxShadow: '10px 10px 0px 0px rgba(0, 0, 0, 1)',
                    p: { xs: 2, sm: 3 },
                    position: 'relative',
                    '.cl-internal-1dauvpw': {
                        display: 'none', 
                      },
                      
                }}
            >
                <a href="/" style={{ textDecoration: 'none', cursor: 'pointer', marginBottom: '16px' }}>
                    <ArrowBackIcon style={{ fontSize: '24px' }} />
                </a>

                <SignIn
                    signUpUrl='/sign-up'
                    appearance={{
                        elements: {
                            formButtonPrimary: {
                                fontSize: { xs: '16px', sm: '18px' },
                                padding: { xs: '10px', sm: '12px' },
                            },
                            cardBox:{
                                border: "none",
                                boxShadow: "none", 
                                width: "100%"
                            }, 
                            card:{
                                border: "none", 
                                boxShadow: "none"
                            }, 
                            headerTitle:{
                                fontSize: { xs: '24px', sm: '30px' },
                            },
                            footerActionText:{
                                fontSize: 13
                            },
                            footerActionLink:{
                                fontSize: 13
                            },
                            socialButtonsBlockButtonText:{
                                fontSize: 11
                            }
                            
                        },
                        variables: {
                            fontFamily: alfaSlabOne.style.fontFamily,
                        }
                    }}
                />
            </Box>
        </Box>
        </>
    )
}
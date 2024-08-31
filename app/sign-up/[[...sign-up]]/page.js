import React from 'react'
import { Box } from '@mui/material'
import { SignUp } from '@clerk/nextjs'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function SignUpPage() {
    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            sx={{
                backgroundImage: "url('/bg-image.png')",
                backgroundSize: "cover", 
                backgroundPosition: "center", 
                backgroundRepeat: "no-repeat", 
            }}
        >
            <Box
                ml="50%"
                width="50%"
                height="100%"
                bgcolor="white"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                
            >
                <a href="/" style={{ textDecoration: 'none', cursor: 'pointer', marginBottom: '16px'  }}>
                    <ArrowBackIcon />
                </a>
                
                <SignUp
                    signInUrl='/sign-in'
                    appearance={{
                        elements: {
                            //footer: { display: "none" },
                            
                            formButtonPrimary: {
                                fontSize: 24,
                            },
                            cardBox:{
                                border: "none",
                                boxShadow: "none"
                            }, 
                            card:{
                                border: "none", 
                                boxShadow: "none"
                            }, 
                            headerTitle:{
                                fontSize: 40,
                            },
                            
                        },
                        
                    }}
                />
            </Box>
        </Box>
    )
}
import React from 'react';
import { Box, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 4,
        mt: 'auto'
      }}
    >
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3 }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={4}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
        >
          {/* Brand Section */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              sx={{ 
                background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              BlogPlatform
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Share your stories with the world
            </Typography>
          </Box>

          {/* Links */}
          <Stack direction="row" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">Company</Typography>
              <Link href="#" variant="body2" color="text.secondary">About</Link>
              <Link href="#" variant="body2" color="text.secondary">Careers</Link>
              <Link href="#" variant="body2" color="text.secondary">Contact</Link>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">Legal</Typography>
              <Link href="#" variant="body2" color="text.secondary">Privacy</Link>
              <Link href="#" variant="body2" color="text.secondary">Terms</Link>
              <Link href="#" variant="body2" color="text.secondary">Cookie Policy</Link>
            </Stack>
          </Stack>
        </Stack>

        {/* Copyright */}
        <Box sx={{ 
          borderTop: '1px solid', 
          borderColor: 'divider', 
          mt: 4, 
          pt: 3,
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 BlogPlatform. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
import * as React from 'react';
import { FC } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
import { fontSize } from '@mui/system';
import Box from '@mui/material/Box';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string | string[];
  subtitle: string;
}

const CustomDialog: FC<CustomDialogProps> = ({ open, onClose, title, content, subtitle }) => {
  return (
    <BootstrapDialog onClose={onClose} aria-labelledby="custom-dialog-title" open={open}>
      <DialogTitle
        variant="h4"
        color="primary.main"
        sx={{
          m: 0,
          p: 2,
          mt: { xs: 2, sm: 0, md: 0 },
          mx: { xs: 2, sm: 0, md: 0 },
        }}
        id="custom-dialog-title"
        textAlign="center"
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Iconify icon="material-symbols:close-rounded" width={24} color="primary.main" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          color: 'gray',
          textAlign: 'center',
          fontSize: '16px',
          my: '-8px',
        }}
      >
        {subtitle}
      </DialogContent>
      <DialogContent dividers>
        {Array.isArray(content) ? (
          <Box
            component="ol"
            sx={{
              paddingLeft: { xs: 6, sm: 8, md: 8, lg: 8 },
              paddingRight: { xs: 4, sm: 6, md: 6, lg: 6 },
            }}
          >
            {content.map((item, index) => (
              <li key={index} style={{ fontSize: '14px' }}>
                <Typography textAlign="justify" variant="body2">
                  {item}
                </Typography>
              </li>
            ))}
          </Box>
        ) : (
          <Typography>{content}</Typography>
        )}
      </DialogContent>
    </BootstrapDialog>
  );
};

export default CustomDialog;

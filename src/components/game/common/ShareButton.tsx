import React, { useState } from 'react';
import {
  IconButton,
  makeStyles,
  Typography,
  DialogTitle,
  Dialog,
  DialogContent,
} from '@material-ui/core';
import { Share, Close } from '@material-ui/icons';
import { ReactComponent as Whatsapp } from '../../../svg/whatsapp-brands.svg';
import { ReactComponent as Telegram } from '../../../svg/telegram-brands.svg';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  icon: {
    width: '50px',
    height: '50px',
  },
}));

const defaultText = encodeURIComponent("Let's play Hoot Dat!");

const ShareButton: React.FC<{ gameCode: string }> = ({ gameCode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();
  const url = `${window.location.origin}/?gameCode=${gameCode}`;

  const WhatsappIcon = () => (
    <Whatsapp color="#4AC959" className={classes.icon} />
  );

  const link = encodeURIComponent(url);
  const handleWhatsapp = () => {
    const apiLink = `https://api.whatsapp.com/send?text=${defaultText}%20${link}`;
    window.open(apiLink, '_blank');
  };

  const TelegramIcon = () => (
    <Telegram color="#0088cc" className={classes.icon} />
  );

  const handleTelegram = () => {
    const apiLink = `https://telegram.me/share/url?url=${url}&text=${defaultText}`;
    window.open(apiLink, '_blank');
  };

  const handleClick = () => {
    if ((navigator as any).share !== undefined) {
      (navigator as any).share({
        title: "Let's play Hoot Dat!",
        url: url,
      });
    } else {
      console.log('opened dialog');
      setIsOpen(true);
    }
  };

  const handleClose = () => setIsOpen(false);

  // TODO show snackbar after copy link success
  const ShareDialog = () => (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <DialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">Share</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <IconButton onClick={handleWhatsapp}>
          <WhatsappIcon />
        </IconButton>

        <IconButton onClick={handleTelegram}>
          <TelegramIcon />
        </IconButton>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {!(navigator as any).share && <ShareDialog />}
      <IconButton onClick={handleClick}>
        <Share />
      </IconButton>
    </>
  );
};

export default ShareButton;

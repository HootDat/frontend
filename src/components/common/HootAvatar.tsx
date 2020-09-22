import React from 'react';
import hoot0 from '../../svg/hootimages/darkgreenhoot.svg';
import hoot1 from '../../svg/hootimages/bluehoot.svg';
import hoot2 from '../../svg/hootimages/yellowhoot.svg';
import hoot3 from '../../svg/hootimages/brownhoot.svg';
import hoot4 from '../../svg/hootimages/redhoot.svg';
import hoot5 from '../../svg/hootimages/olivehoot.svg';
import hoot6 from '../../svg/hootimages/pinkhoot.svg';
import hoot7 from '../../svg/hootimages/lightpurplehoot.svg';
import hoot8 from '../../svg/hootimages/leafhoot.svg';
import hoot9 from '../../svg/hootimages/darkredhoot.svg';
import hoot10 from '../../svg/hootimages/lightbluehoot.svg';
import hoot11 from '../../svg/hootimages/purplehoot.svg';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  normal: {
    height: '50px',
    width: '50px',
  },
  small: {
    height: '20px',
    width: '20px',
  },
  disabled: {
    mixBlendMode: 'luminosity',
    opacity: 0.4,
  },
});

const HootAvatar: React.FC<{
  number: number;
  size?: 'small' | 'normal';
  disabled?: boolean;
  onClick?: () => void;
}> = ({ number, size = 'normal', disabled, onClick = () => {} }) => {
  const classes = useStyles();

  function whichHoot() {
    switch (number) {
      case 0:
        return hoot0;
      case 1:
        return hoot1;
      case 2:
        return hoot2;
      case 3:
        return hoot3;
      case 4:
        return hoot4;
      case 5:
        return hoot5;
      case 6:
        return hoot6;
      case 7:
        return hoot7;
      case 8:
        return hoot8;
      case 9:
        return hoot9;
      case 10:
        return hoot10;
      case 11:
        return hoot11;
    }
  }

  return (
    <img
      src={whichHoot()}
      alt={`hoot${number} avatar`}
      className={`${size === 'small' ? classes.small : classes.normal} ${
        disabled ? classes.disabled : ''
      }`}
      onClick={disabled ? undefined : onClick}
    />
  );
};

export default HootAvatar;

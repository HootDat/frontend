import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';

type Props = ButtonProps & {
  handleBack: () => void;
};

const BackButton: React.FC<Props> = ({ handleBack, ...props }) => {
  return (
    <Button color="primary" onClick={handleBack} {...props}>
      Back
    </Button>
  );
};

export default BackButton;

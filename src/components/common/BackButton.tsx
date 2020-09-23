import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';

type Props = ButtonProps & {
  handleBack: () => void;
  text?: string;
};

const BackButton: React.FC<Props> = ({
  handleBack,
  text = 'Back',
  ...props
}) => {
  return (
    <Button color="primary" onClick={handleBack} {...props}>
      {text}
    </Button>
  );
};

export default BackButton;

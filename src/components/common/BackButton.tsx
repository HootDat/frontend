import React from 'react';
import { Button } from '@material-ui/core';

const BackButton: React.FC<{ handleBack: () => void }> = ({ handleBack }) => {
  return (
    <Button color="primary" onClick={handleBack}>
      Back
    </Button>
  );
};

export default BackButton;

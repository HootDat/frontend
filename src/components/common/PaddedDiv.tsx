import React from 'react';
import { Box, BoxProps } from '@material-ui/core';

const PaddedDiv: React.FC<BoxProps> = props => (
  <Box height="100%" padding={2} {...props} />
);

export default PaddedDiv;

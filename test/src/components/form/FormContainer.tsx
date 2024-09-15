import React from "react";
import { Box, Container, Typography } from "@mui/material";

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  children,
}) => {
  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Box component="form" sx={{ width: "100%" }}>
          {children}
        </Box>
      </Box>
    </Container>
  );
};

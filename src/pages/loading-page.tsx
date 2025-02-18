import { Box, CircularProgress, Container } from "@mui/material";
import { JSX } from "react";

export const LoadingPage = ({ size }: { size?: number }): JSX.Element => (
  <Container>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <CircularProgress size={size || 20} />
    </Box>
  </Container>
);

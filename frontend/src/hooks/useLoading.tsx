import { Box, CircularProgress, Typography } from "@mui/material";

export const useLoading = (loading: boolean, error: string | null) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    console.log("error :", error);
  }

  return null;
};

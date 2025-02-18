import { JSX } from "react";
import { Container, Typography, Box } from "@mui/material";
import { fetchUserDetailsErrorMessageAtom } from "@/jotai/atoms";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useGetUserDetails } from "@/utils/use-get-user-details";
import { LoadingPage } from "./loading-page";
import { useAtom } from "jotai";

const HomePage = (): JSX.Element => {
  const { data: userDetails, status, isFetching, error } = useGetUserDetails();

  const [fetchUserDetailsError, setFetchUserDetailsError] = useAtom(
    fetchUserDetailsErrorMessageAtom
  );
  const navigate = useNavigate();

  const errorComponent = (msg: string): JSX.Element => (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "red",
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          ERROR OCCURED
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {msg}
        </Typography>
      </Box>
    </Container>
  );

  if (error || userDetails?.accessToken === "") {
    setFetchUserDetailsError(error?.message || "Error fetching user details");
    setTimeout(() => {
      navigate(ROUTES.LOGIN);
    }, 3000);
    return errorComponent(fetchUserDetailsError);
  } else if (status === "pending" || isFetching) return <LoadingPage />;

  return (
    <Container sx={{ m: 0, p: 0 }}>
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
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Collaborative Code Editor
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          A real-time collaborative platform for coding together
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Start coding with your team in real-time. Create or join a session to
          begin collaborating.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;

import { JSX, useEffect } from "react";

const AuthRedirectPage = (): JSX.Element => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // implement try-catch here
      fetch("http://localhost:3000/auth/github/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('data: ', data);
        });
    }
  }, []);

  return <div>Processing GitHub login...</div>;
};

export default AuthRedirectPage;

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

function LoginButton() {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      console.log(response);
      // You can send the token to your backend for further processing
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: response.access_token,
          }),
        },
      );

      const data = await res.json();

      console.log(data);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return <button onClick={() => login()}>Login with Google</button>;
}

export default LoginButton;

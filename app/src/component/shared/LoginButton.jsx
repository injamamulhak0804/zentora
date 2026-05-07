import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

function LoginButton({
  navigate,
  buttonText = "Login with Google",
  onError,
  setUserData,
}) {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/auth/google",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: response.access_token,
          }),
        },
      );

      const data = await res.json();
      console.log("data: ", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setUserData(data.data);
        navigate("/");
      } else {
        onError?.(data.message || "Something went wrong");
      }
    },
    onError: () => {
      onError?.("Google login failed. Please try again.");
    },
  });

  return (
    <button
      className="mt-3 w-full cursor-pointer rounded-md border-2 border-gray-300 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
      onClick={() => login()}
    >
      <FcGoogle size={20} />
      {buttonText}
    </button>
  );
}

export default LoginButton;

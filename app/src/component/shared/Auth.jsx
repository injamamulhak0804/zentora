import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AuthAside = () => {
  return (
    <aside className="hidden md:flex md:w-[44%] flex-col justify-between rounded-l-2xl bg-slate-900 p-8 text-white relative overflow-hidden">
      <div>
        <div className="h-10 w-10 rounded-full border border-white/40" />
        <h2 className="mt-8 text-3xl font-medium leading-tight">
          Getting Started
          <br />
          is easy with UI Builder
        </h2>
      </div>

      <div className="relative h-44">
        <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-teal-200/30 blur-sm" />
        <div className="absolute left-12 top-4 h-40 w-40 rounded-full border border-white/40 bg-linear-to-br from-sky-200/80 to-blue-300/40" />
        <div className="absolute right-10 bottom-0 h-14 w-14 rounded-full bg-white/30" />
      </div>
    </aside>
  );
};

const AuthHeader = ({ isSignup }) => {
  return (
    <div>
      <p className="text-right text-xs text-slate-500">English (UK)</p>
      <h3 className="mt-8 text-2xl font-semibold text-slate-800 text-center">
        {isSignup ? "Create Account" : "Welcome Back"}
      </h3>
    </div>
  );
};

const AuthFields = ({ isSignup, form, handleChange }) => {
  return (
    <div className="flex flex-col gap-4 mt-6">
      {isSignup && (
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="input"
          required
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="input"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="input"
        required
      />
    </div>
  );
};

const Auth = ({ setUserData }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        backendUrl + `/api/v1/user/${isSignup ? "signup" : "signin"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userData", JSON.stringify(data.data));
        setUserData(data.data);
        navigate("/");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 px-4 py-8 sm:px-6 lg:px-10 flex items-center justify-center">
      <div className="w-full max-w-5xl rounded-2xl bg-white/10 p-2 shadow-2xl">
        <div className="flex min-h-155 rounded-2xl bg-white overflow-hidden">
          <AuthAside />

          <section className="w-full md:w-[56%] px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
            <AuthHeader isSignup={isSignup} />

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 w-full max-w-md"
            >
              <LoginButton
                navigate={navigate}
                buttonText={
                  isSignup ? "Sign up with Google" : "Sign in with Google"
                }
                onError={setError}
                setUserData={setUserData}
              />

              <div className="my-6 flex items-center gap-3">
                <span className="h-px w-full bg-slate-200" />
                <span className="text-xs text-slate-400">OR</span>
                <span className="h-px w-full bg-slate-200" />
              </div>

              <AuthFields
                isSignup={isSignup}
                form={form}
                handleChange={handleChange}
              />

              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

              <button
                type="submit"
                className="mt-6 w-full cursor-pointer rounded-md bg-slate-800 py-2.5 text-white hover:bg-slate-700"
              >
                {isSignup ? "Create Account" : "Sign In"}
              </button>

              <p className="flex justify-center mt-5 text-sm text-slate-600">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-1 font-semibold text-slate-800"
                >
                  {isSignup ? "Log In" : "Sign Up"}
                </button>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Auth;

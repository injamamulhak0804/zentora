import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
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

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch("http://localhost:8000/api/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col rounded-md bg-white border p-6 shadow-md">
        <h4 className="text-xl font-medium text-slate-800">
          {isSignup ? "Sign Up" : "Sign In"}
        </h4>
        <p className="text-slate-500 font-light">
          {isSignup
            ? "Enter your details to register."
            : "Welcome back! Please login."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 w-80 sm:w-96">
          <div className="flex flex-col gap-4">
            {isSignup && (
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="input"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="input"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={form.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-slate-800 py-2 text-white hover:bg-slate-700"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <button
            type="button"
            className="mt-3 w-full rounded-md border-2 border-gray-300 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="flex justify-center mt-4 text-sm text-slate-600">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="ml-1 font-semibold underline"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;

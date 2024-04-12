import { useEffect, useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSignup = async () => {
    // Basic input validation
    if (!firstName || !lastName || !username || !password) {
      alert("Please fill out all fields");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        username,
        firstName,
        lastName,
        password,
      };

      const config = {
        headers: {
          "Content-Length": JSON.stringify(requestData).length,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/user/signup`,
        requestData,
        config
      );

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Invalid input. Please check your details and try again.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          <InputBox
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            label={"First Name"}
          />
          <InputBox
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            label={"Last Name"}
          />
          <InputBox
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Email"
            label={"Email"}
          />
          <InputBox
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={handleSignup}
              label={loading ? "Signing up..." : "Sign up"}
              disabled={loading}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

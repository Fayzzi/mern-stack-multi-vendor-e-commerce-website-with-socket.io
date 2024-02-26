import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ActivationPage() {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const activateEmail = async () => {
      try {
        const res = await axios.post(`/api/v2/user/activation`, {
          activation_token,
        });
        console.log(res.data.message);
      } catch (error) {
        console.log(error.response.data.message);
        setError(true);
      }
    };

    if (activation_token) {
      activateEmail(); // Call the activation function here
    }
  }, [activation_token]);
  console.log(error);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your Token is expired!</p>
      ) : (
        <p>Your Account has been Activated Successfully!!</p>
      )}
    </div>
  );
}

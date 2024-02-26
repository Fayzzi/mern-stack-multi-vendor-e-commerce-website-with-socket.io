// ShopActivationPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ShopActivationPage() {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .post("/api/v2/shop/seller/activation", {
        activation_token: activation_token,
      })
      .then(() => {
        console.log("activation successfull");
      })
      .catch((e) => {
        setError(true);
      });
  }, [activation_token]);

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

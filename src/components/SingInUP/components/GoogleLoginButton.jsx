import { GoogleLogin } from "@react-oauth/google";
import { googleLogin, googleSignup } from "../../../api/endpoints";
import { toast } from "react-hot-toast";

const GoogleLoginButton = ({ mode = "login" }) => {

    const handleGoogleSuccess = async (credentialResponse) => {

        let response;

        if (mode === "login") {
            response = await googleLogin(credentialResponse.credential);
        } else {
            response = await googleSignup(credentialResponse.credential);
        }

        if (!response) {
            toast.error("Unable to continue.");
            return;
        }

        if (response.success) {
            window.location.href = "/dashboard";
            toast.success(`Welcome ${response.user.username}`);
        } else {
            toast.error(response.message);
        }
    };

    return (
        <GoogleLogin
            theme="outline"
            size="large"
            text={mode === "login" ? "continue_with" : "signup_with"}
            shape="pill"
            width="350"
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Authentication Failed")}
        />
    );
};

export default GoogleLoginButton;
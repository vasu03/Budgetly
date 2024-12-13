// Importing required modules
import { SignUp } from "@clerk/nextjs";

// Creating our SignUp page
const page = () => {
    // TSX to render the page
    return (
        <SignUp forceRedirectUrl={"/wizrad"}/>
    );
};

// Exporting the Signup page
export default page;
// Importing required modules
import { SignIn } from "@clerk/nextjs";

// Creating our SignIn page
const page = () => {
    // TSX to render the page
    return (
        <SignIn forceRedirectUrl="/" />
    );
};

// Exporting the SignIn page
export default page;
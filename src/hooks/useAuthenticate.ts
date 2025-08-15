
import axios from "axios";
import { useRouter } from "next/navigation";

const useAuthenticate = async () => {
  const router = useRouter();
  try {
    const response = await axios.post("/api/authenticateAdmin", {
      method: "GET",
      credentials: "include",
    });
    const redirectURL = response.data.redirectURL;
    if(redirectURL !== "/login") router.replace(redirectURL);  
  } catch (error) {
    console.log(error);
  }
};

export default useAuthenticate;
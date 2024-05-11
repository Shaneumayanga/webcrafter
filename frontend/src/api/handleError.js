import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const handleError = (error) => {
  console.log("error.response", error.response);
  if (error.response) {
    try {
      alert(error.response.data);
    } catch (error) {
      console.log("toasterror", error);
    }
  }
};

export { handleError };

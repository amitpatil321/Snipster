import { ToastContainer, Zoom } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export const ToastProvider = () => {
  return (
    <ToastContainer
      transition={Zoom}
      position="top-right"
      draggable
      hideProgressBar
      theme={"colored"}
    />
  );
};

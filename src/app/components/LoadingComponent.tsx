import React from "react";
import { Spinner } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";

const LoadingComponent = ({ onClose,loadMessage ,message}: any) => {
  React.useEffect(() => {

    setTimeout(() => {
      onClose();
      toast.dismiss();
        if (message) {
                toast.success(`${message}`, {
                  autoClose: 3000, // Avtomatik yopilish vaqti (ms)
                });
        }

    }, 2000);
  }, []);
  return (
    <>
      <Spinner
        label={`${loadMessage} ...`}
        color="success"
        labelColor="success"
      />
    </>
  );
};

export default LoadingComponent;

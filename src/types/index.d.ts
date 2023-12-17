import { ModalProps } from "@nextui-org/react";

interface Users {

  name: string;
  username: string;
  contact: string;
  roleName: string;
  email: string;
  address: string;
}

interface ModelPropsType  {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: () => void;
}

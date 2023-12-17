import { ModalProps } from "@nextui-org/react";

interface Users {
  id: number;
  name: string;
  username: string;
  contact: string;
  roleName: string;
  email: string;
  address: string;
  createdAt: string;
  modifiedAt: string;
}

interface ModelPropsType  {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: () => void;
}

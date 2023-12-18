import { ModalProps } from "@nextui-org/react";
import { QueryClientProvider, QueryClientConfig } from '@tanstack/react-query';

interface Users {
 id:number
  name: string;
  username: string;
  contact: string;
  roleName: string;
  email: string;
  address: string;
}

interface UsersHandle {
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



// O'z turini yaratamiz
interface CustomQueryClientOptions extends QueryClientConfig {
  defaultOptions: {
    queries: {
      cacheTime: number;
    };
  };
}


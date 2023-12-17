import { Users } from "@/src/types";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Chip
} from "@nextui-org/react";
export const UserModalComponent = ({
  isOpen,
  onOpenChange,
  onOpen,
  self,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen: () => void;
  self: Users | undefined;
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        size="full"
        onOpenChange={onOpenChange}
        placement="auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col ">User info</ModalHeader>
              <ModalBody className="gap-2">
                <h2 className="UserName-title text-center text-[40px] items-center mb-6">
                  {self?.name}
                </h2>
                <div className="text-3xl info-box text-orange-600 mt-4 mr-auto ml-auto justify-center	items-center	">
                  <h2 className="mt-2">
                    <Chip size="lg" color="warning" variant="shadow">
                      Username
                    </Chip>
                    <Chip
                      variant="shadow"
                      size="lg"
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black text-white",
                      }}
                    >
                      {self?.username}
                    </Chip>
                  </h2>
                  <h2 className="mt-2">
                    <Chip size="lg" color="warning" variant="shadow">
                      Role
                    </Chip>
                    <Chip
                      variant="shadow"
                      size="lg"
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black text-white",
                      }}
                    >
                      {self?.roleName}
                    </Chip>
                  </h2>
                  <h2 className="mt-2">
                    <Chip size="lg" color="warning" variant="shadow">
                      Email
                    </Chip>
                    <Chip
                      variant="shadow"
                      size="lg"
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black text-white",
                      }}
                    >
                      {self?.email}
                    </Chip>
                  </h2>
                  <h2 className="mt-2">
                    <Chip size="lg" color="warning" variant="shadow">
                      Address
                    </Chip>
                    <Chip
                      variant="shadow"
                      size="lg"
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black text-white",
                      }}
                    >
                      {self?.address}
                    </Chip>
                  </h2>
                  <h2 className="mt-2">
                    <Chip size="lg" color="warning" variant="shadow">
                      Contact
                    </Chip>
                    <Chip
                      variant="shadow"
                      size="lg"
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black text-white",
                      }}
                    >
                      {self?.contact}
                    </Chip>
                  </h2>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Back</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  ModalProps,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Roles } from "@/src/utils/data";
import { MailIcon } from "./Icons";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { Users } from "@/src/types";
import LoadingComponent from "./LoadingComponent";

const validationSchema = yup.object().shape({
  name: yup.string().required("Iltimos ! Xodimni ismini kiriting !"),
  username: yup.string().required("Iltimos ! Xodimni usernamesini kiriting !"),
  email: yup
    .string()
    .email("")
    .required("Iltimos ! Xodimni Email manzilingizni kiriting !"),
  address: yup
    .string()
    .required("Iltimos ! Xodimni yashash manzilingizni kiriting !"),
  roleName: yup.string().required("Iltimos ! Xodimni roleni kiriting !"),
  contact: yup.string().required("Iltimos ! Xodimni mobil raqamini kiriting !"),
});
export default function CreateModal({
  isOpen,
  onOpenChange,
  onOpen
}: {
  isOpen: boolean,
  onOpenChange: () => void,
  onOpen:()=>void
}) {
  const queryClient = useQueryClient();
  const [Loading, setLoading] = React.useState(false);

  const CreateMutation = useMutation({
    mutationFn: (data: Users) => {
      return fetch("https://655ef5e2879575426b443c29.mockapi.io/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          queryClient.invalidateQueries("users");
          if (data) {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, 2000);
          }
        });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: Users):void => {
    // Data joylash
    CreateMutation.mutate(data);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        size="3xl"
        onOpenChange={onOpenChange}
        placement="auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col ">Add to staff</ModalHeader>
              <ModalBody className="gap-2">
                {Loading ? (
                  <LoadingComponent
                    loadMessage={"Creating new staff"}
                    onClose={onClose}
                  />
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="gap-2">
                    <Input
                      autoFocus
                      {...register("name")}
                      autoComplete="off"
                      label="Name"
                      placeholder="Enter your name"
                      variant="bordered"
                      errorMessage={`${
                        errors.name?.message ? errors.name?.message : ""
                      }`}
                    />
                    <Input
                      autoFocus
                      autoComplete="off"
                      {...register("username")}
                      label="Username"
                      placeholder="Enter your username"
                      className={`${
                        errors.username?.message ? "mt-1" : "mt-2"
                      }`}
                      variant="bordered"
                      errorMessage={`${
                        errors.username?.message ? errors.username?.message : ""
                      }`}
                    />
                    <Input
                      autoFocus
                      endContent={
                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      {...register("email")}
                      autoComplete="off"
                      label="Email"
                      className={`${errors.email?.message ? "mt-1" : "mt-2"}`}
                      errorMessage={`${
                        errors.email?.message ? errors.email?.message : ""
                      }`}
                      placeholder="Enter your email"
                      variant="bordered"
                    />
                    <Select
                      variant="bordered"
                      label="Select a Role"
                      className={`${
                        errors.roleName?.message ? "mt-1" : "mt-2"
                      }`}
                      {...register("roleName")}
                      errorMessage={`${
                        errors.roleName?.message ? errors.roleName?.message : ""
                      }`}
                    >
                      {Roles?.map((animal) => (
                        <SelectItem key={animal.value} value={animal.value}>
                          {animal.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      autoFocus
                      autoComplete="off"
                      label="Address"
                      {...register("address")}
                      errorMessage={`${
                        errors.address?.message ? errors.address?.message : ""
                      }`}
                      className={`${errors.address?.message ? "mt-1" : "mt-2"}`}
                      placeholder="Enter your address"
                      variant="bordered"
                    />
                    <Input
                      autoFocus
                      autoComplete="off"
                      label="Contact"
                      {...register("contact")}
                      placeholder="Enter your contact"
                      className={`${errors.contact?.message ? "mt-1" : "mt-2"}`}
                      errorMessage={`${
                        errors.contact?.message ? errors.contact?.message : ""
                      }`}
                      variant="bordered"
                    />
                    <div className="flex py-2 px-1 justify-between">
                      <Checkbox
                        classNames={{
                          label: "text-small",
                        }}
                      >
                        Remember me
                      </Checkbox>
                    </div>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button type="submit" color="primary">
                        Add
                      </Button>
                    </ModalFooter>
                  </form>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

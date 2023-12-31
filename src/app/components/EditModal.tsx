import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem
} from "@nextui-org/react";
import { MailIcon } from "./Icons";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { Users, UsersHandle } from "@/src/types";
import LoadingComponent from "./LoadingComponent";
import { ToastContainer } from "react-toastify";
import { Roles } from "@/src/utils/data";
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

export default function EditModal({
  isOpen,
  onOpenChange,
  self,
  onOpen
}: {isOpen:boolean,onOpenChange:()=>void,self:Users | undefined,onOpen:()=>void}) {
  const queryClient = useQueryClient();
  const [Loading, setLoading] = React.useState(false);

  const EditMutation = useMutation({
    mutationFn: (data: UsersHandle) => {
      return fetch(
        `https://655ef5e2879575426b443c29.mockapi.io/api/users/${self?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
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

  const onSubmit: SubmitHandler<UsersHandle> = (data:UsersHandle): void => {
    EditMutation.mutate(data);
  };

  return (
    <>
      <ToastContainer />

      <Modal
        isOpen={isOpen}
        size="3xl"
        onOpenChange={onOpenChange}
        placement="auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col ">
                Edit to staff
              </ModalHeader>
              <ModalBody className="gap-2">
                {Loading ? (
                  <LoadingComponent
                    loadMessage={"Updating to staff"}
                    message={"Updated to staff !"}
                    onClose={onClose}
                  />
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="gap-2">
                    <Input
                      autoFocus
                      {...register("name")}
                      autoComplete="off"
                      label="Name"
                      defaultValue={self?.name}
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
                      defaultValue={self?.username}
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
                      defaultValue={self?.email}
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
                      {Roles?.map((role) => (
                        <SelectItem key={role.value}  value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      autoFocus
                      autoComplete="off"
                      label="Address"
                      {...register("address")}
                      defaultValue={self?.address}
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
                      defaultValue={self?.contact}
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
                      <Button color="danger" variant="ghost" onPress={onClose}>
                        Close
                      </Button>
                      <Button variant="shadow" type="submit" color="primary">
                        Update
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

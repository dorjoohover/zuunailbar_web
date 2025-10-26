import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Logout = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [error, setError] = useState("");
  const logout = async () => {
    fetch("/api/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const handleLogout = async () => {
    setError("");
    try {
      logout();

      addToast({
        title: "Амжилттай гарлаа",
        size: "lg",
        color: "success",
      });
      setTimeout(() => {
        window.location.replace(window.location.href);
      }, 300);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button
        onPress={() => {
          onOpen();
        }}
        className="text-sm font-semibold md:hidden  text-white w-full bg-transparent max-w-auto border border-white  aspect-square"
      >
        {/* <UserRound className="size-4" /> */}
        Гарах
      </Button>
      <Button
        size="sm"
        onPress={() => {
          onOpen();
        }}
        className="text-sm font-semibold hidden md:block text-white bg-transparent size-10 aspect-square"
      >
        {/* <UserRound className="size-4" /> */}
        Гарах
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="p-4">
          {(onClose) => (
            <>
              <ModalHeader className="text-white text-center flex justify-center">
                <p className="text-black text-center">
                  Та гарахдаа итгэлтэй байна уу
                </p>
              </ModalHeader>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                {/* Modal footer */}
                <ModalFooter className="flex justify-center w-full">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => onClose()}
                  >
                    Буцах
                  </Button>
                  {/* Login footer */}

                  <Button type="submit" className="px-10">
                    Гарах
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

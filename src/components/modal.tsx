import { ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

type AppModalProps = {
  useLink?: boolean; 
  href?: string;  
  btn?: string;  
  title?: string;    
  children?: ReactNode; 
  cancelText?: string;   
  confirmText?: string;  
  onConfirm?: () => void;
};

export default function AppModal({
  useLink = false,
  href = "/order",
  btn = "Modal",
  title = "Modal Title",
  children,
  cancelText = "Цуцлах",
  confirmText = "Баталгаажуулах",
  onConfirm = () => {},
}: AppModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const ButtonComponent = Button;

  return (
    <>
      <ButtonComponent
        as={useLink ? Link : undefined}
        href={useLink ? href : undefined}
        onPress={onOpen}
        className=""
      >
        {btn}
      </ButtonComponent>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>{children}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {cancelText}
                </Button>
                <Button color="primary" onPress={onConfirm}>
                  {confirmText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
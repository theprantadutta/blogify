import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import React, { ReactNode } from 'react'
import PrimaryButton from './PrimaryButton'

interface DeleteModalProps {
  children?: ReactNode
  onClick: React.MouseEventHandler<HTMLButtonElement>
  isOpen: boolean
  onClose: () => void
}

const DeleteModal: NextPage<DeleteModalProps> = ({
  onClick,
  isOpen,
  onClose,
}) => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="2xl" fontWeight="bold">
          Delete A Post
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="xl" fontWeight="bold" pb={6}>
          You are Deleting a Post. Are You Sure?
        </ModalBody>

        <ModalFooter>
          <PrimaryButton onClick={onClick} mr={3}>
            Go Ahead
          </PrimaryButton>
          <PrimaryButton onClick={onClose}>Not Sure</PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteModal

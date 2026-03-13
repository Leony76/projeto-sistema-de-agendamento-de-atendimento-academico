import React from 'react'
import ModalWrapper from './ModalWrapper'
import Button from '../button/Button'

type Props = {
  title:   string;
  message: string;
  isOpen:  boolean;
  loading: boolean;
  onClick: {
    closeModal: () => void;
    confirm:        () => void;
  };
}

const ConfirmAction = ({
  title,
  message,
  isOpen,
  onClick,
  loading,
}:Props) => {

  return (
    <ModalWrapper 
    title={title} 
    isOpen={isOpen} 
    onCloseActions={onClick.closeModal} 
    message={message}
    hasXClose
    >
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between',
        gap: '10px',
      }}>
        <Button 
        loading={loading}
        buttonStyle={{
          fontSize: "MD",
          border: "MD",
          color: "SECONDARY",
          filled: false
        }}
        onClick={onClick.confirm}>
          {loading ? 'Processando' : 'Confirmar'}
        </Button>
        
        <Button 
        buttonStyle={{  
          fontSize: "MD",
          border: "MD",
          color: "PRIMARY",
          filled: false
        }}
        onClick={onClick.closeModal}>
          Cancelar
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default ConfirmAction
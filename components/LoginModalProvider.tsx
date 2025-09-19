import React, { useState, useEffect } from 'react';
import LoginRequiredModal from './LoginRequiredModal';
import loginModalService, { LoginModalOptions } from '../services/loginModalService';

interface LoginModalProviderProps {
  children: React.ReactNode;
}

const LoginModalProvider: React.FC<LoginModalProviderProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState<LoginModalOptions>({});

  useEffect(() => {
    const handleShowModal = (options: LoginModalOptions) => {
      setModalOptions(options);
      setModalVisible(true);
    };

    const handleHideModal = () => {
      setModalVisible(false);
    };

    loginModalService.on('showLoginModal', handleShowModal);
    loginModalService.on('hideLoginModal', handleHideModal);

    return () => {
      loginModalService.removeListener('showLoginModal', handleShowModal);
      loginModalService.removeListener('hideLoginModal', handleHideModal);
    };
  }, []);

  const handleModalClose = () => {
    loginModalService.hideLoginModal();
  };

  return (
    <>
      {children}
      <LoginRequiredModal
        visible={modalVisible}
        onClose={handleModalClose}
        title={modalOptions.title}
        subtitle={modalOptions.subtitle}
        redirectPath={modalOptions.redirectPath}
        benefits={modalOptions.benefits}
      />
    </>
  );
};

export default LoginModalProvider;
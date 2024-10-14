import { Toaster } from 'react-hot-toast';

const CustomToaster = () => {
  return (
    <Toaster
      toastOptions={{
        duration: 3000,
        success: {
          style: {
            background: '#4CAF50',
            color: '#fff',

          },
          iconTheme: {
            primary: '#fff',
            secondary: '#333',
          },
        },
        error: {
          style: {
            background: '#F44336',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#333',
          },
        },
      }}
    />
  );
};

export default CustomToaster;
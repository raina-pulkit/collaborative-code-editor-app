import { LoginForm } from '@/components/login-form';
import { ROUTES } from '@/constants/routes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // If token exists, redirect to home page
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-zinc-700">
      <div className="flex flex-col gap-4 p-6 md:p-10 relative">
        <img
          src="/src/assets/group-pic.jpeg"
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black opacity-75 z-10"></div>
        <div className="flex flex-1 items-center justify-center z-20">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/src/assets/cool-editor.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginPage;

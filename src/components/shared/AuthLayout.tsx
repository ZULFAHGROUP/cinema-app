import { Carousel } from "antd";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div>
      <div className="flex min-h-screen p-6">
        <div className="bg-[url('/src/assets/background.jpg')] items-end font-bold text-6xl flex-1 hidden md:flex">
          <Carousel autoplay className="text-[#c77e3b] max-w-xl p-10 h-full">
            <div className="">
              <h3 className="text-4xl font-bold">Welcome to Our Platform</h3>
              <p className="italic text-lg mt-2">
                Explore a world of opportunities tailored just for you.
              </p>
            </div>
            <div className="">
              <h3 className="text-4xl font-bold">Join Our Community</h3>
              <p className="italic text-lg mt-2">
                Connect with like-minded individuals and grow together.
              </p>
            </div>
            <div className="">
              <h3 className="text-4xl font-bold">Achieve Your Goals</h3>
              <p className="italic text-lg mt-2">
                Your success is our priority—start your journey today.
              </p>
            </div>
          </Carousel>
        </div>
        <div className="flex-1 flex justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

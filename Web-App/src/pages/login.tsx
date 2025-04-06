import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
// import { login } from "../firebase/auth/authService";
import { Link } from 'react-router-dom';
import axios from 'axios';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});

interface Login3Props {
  heading?: string;
  subheading?: string;
  logo: {
    src: string;
    alt: string;
  };
  loginText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
}

const LoginPage = ({
  heading = "PoultryPal",
  subheading = "Welcome back",
  logo = {
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
  },
  loginText = "Log in",
  signupText = "Don't have an account?",
  signupUrl = "/signup",
}: Login3Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post('http://92.112.180.180:3000/api/v1/user/login', data);

      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
      reset();
    } catch (error) {
      console.error(
        'Login error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="mx-auto w-full max-w-sm rounded-lg p-6 shadow">
        <div className="mb-6 flex flex-col items-center">
          <Link to="/">
            <div className='flex gap-2'>
              <img
                src={logo.src}
                alt={logo.alt}
                className="mb-7 h-10 w-auto"
              />
              <p className="mb-2 text-2xl font-bold">{heading}</p>
            </div>
          </Link>
          <p className="text-muted-foreground">{subheading}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <Input
            type="email"
            placeholder="Enter your email"
            required
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <Input
            type="password"
            placeholder="Enter your password"
            required
            {...register("password")}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="border-muted-foreground"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password
            </a>
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Logging in..." : loginText}
          </Button>
        </form>
        <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
          <p>{signupText}</p>
          <a href={signupUrl} className="text-blue-600 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

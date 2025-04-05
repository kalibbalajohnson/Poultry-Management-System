import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { signUp } from '../firebase/auth/authService';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface SignUpFormProps {
  heading?: string;
  subheading?: string;
  logo: {
    src: string;
    alt: string;
  };
  signupText?: string;
  loginText?: string;
  loginUrl?: string;
}

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters' }),
  firstName: z
    .string()
    .min(2, { message: 'first name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'last name must be at least 2 characters' })
});

type FormData = z.infer<typeof formSchema>;

const SignUpPage = ({
  heading = "PoultryPal",
  subheading = "Sign up for free",
  logo = {
    src: "https://shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
  },
  signupText = "Create an account",
  loginText = "Already have an account?",
  loginUrl = "/login",
}: SignUpFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await axios.post('http://92.112.180.180:3000/user/signup',
        data
      );
      navigate('/login');
      form.reset();
    } catch (error) {
      console.error(
        'Sign up error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="mx-auto my-14 w-full max-w-md rounded-lg bg-white p-8 shadow">
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className='flex gap-4'>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your password"
                      className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing Up...' : signupText}
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {loginText}{' '}
            <a href={loginUrl} className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

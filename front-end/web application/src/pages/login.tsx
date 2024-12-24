import { useNavigate } from "react-router-dom";
import { UserCredential } from "firebase/auth";
import { login } from "../firebase/auth/authService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "../components/navBar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const userCredential: UserCredential | null = await login(data.email, data.password);
      if (userCredential) {
        const { uid, email } = userCredential.user;
        localStorage.setItem("user", JSON.stringify({ uid, email }));
        navigate("/dashboard");
      } else {
        console.error("Login failed: user credential is null");
      }
    } catch (error) {
      console.error("Login error:", error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="w-full max-w-md bg-white p-8 mx-auto my-14 border rounded-xl shadow">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your-email@example.com"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                      {...field}
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
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <Button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition duration-200"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

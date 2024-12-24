import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../components/navBar2";
import Sidebar from "../components/sideBar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Farm {
  _id: string;
  name: string;
  location: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Farm name is required" }),
  location: z.string().min(1, { message: "Farm location is required" }),
});

type FormData = z.infer<typeof formSchema>;

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const uid = user?.uid;

  useEffect(() => {
    if (!user?.uid) {
      navigate("/login");
    }
  }, [user, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  const { data: farms, refetch, isLoading, error } = useQuery<Farm[], Error>({
    queryKey: ["farms", uid],
    queryFn: async () => {
      const response = await fetch(`http://4.206.218.223:3001/api/v1/farm?uid=${uid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch farms");
      }
      return response.json();
    },
    enabled: !!uid,
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://4.206.218.223:3001/api/v1/farm",
        { ...data, uid },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Farm created successfully", response.data);

      refetch();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Farm creation error:", error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 text-gray-800 font-sans">
      <Navbar2 />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-6 container mx-auto overflow-y-auto">
          <header className="mb-6 w-full flex justify-between items-center">
            <div className="flex-1 w-full">
              {isLoading ? (
                <p>Loading farms...</p>
              ) : error ? (
                <p className="text-red-500">{error.message}</p>
              ) : (
                <div>
                  {farms && farms.length > 0 ? (
                    farms.map((farm: Farm) => (
                      <div
                        key={farm._id}
                        className="p-4 bg-white text-gray-800 items-center justify-center rounded-lg shadow border flex flex-col space-y-2"
                      >
                        <h3 className="text-2xl mt-1 font-semibold">{farm.name}</h3>
                        <p className="text-gray-600">{farm.location}</p>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <button className="bg-green-600 text-sm font-semibold mt-3 rounded-full text-white px-4 py-2 hover:bg-green-800 transition duration-200 self-end">
                              Add House
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Poultry Farm</DialogTitle>
                              <DialogDescription>
                                Fill in the details below to create a new poultry farm.
                              </DialogDescription>
                            </DialogHeader>
                            <section className="p-4">
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                  <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Farm Name</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Farm name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Farm location" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button type="submit" className="w-full mt-4" disabled={loading}>
                                    {loading ? "Submitting..." : "Submit"}
                                  </Button>
                                </form>
                              </Form>
                            </section>
                          </DialogContent>
                        </Dialog>

                      </div>
                    ))
                  ) : (
                    <div className="bg-white border items-center p-6 rounded-md flex flex-col justify-center space-y-4">
                      <p>No Farm available. Create Farm.</p>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <button className="bg-green-700 text-sm font-semibold rounded-full text-white px-5 py-2 hover:bg-green-800 transition duration-200">
                            Add Farm
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Poultry Farm</DialogTitle>
                            <DialogDescription>
                              Fill in the details below to create a new poultry farm.
                            </DialogDescription>
                          </DialogHeader>
                          <section className="p-4">
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Farm Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Farm name" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="location"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Location</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Farm location" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit" className="w-full mt-4" disabled={loading}>
                                  {loading ? "Submitting..." : "Submit"}
                                </Button>
                              </form>
                            </Form>
                          </section>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>
          <div>
            <h1 className="text-2xl font-semibold">
              Houses
            </h1>
            <p className="mt-4">No Houses Available</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

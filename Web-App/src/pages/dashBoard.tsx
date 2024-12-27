import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../components/navBar2';
import Sidebar from '../components/sideBar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Farm {
  _id: string;
  name: string;
  location: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Farm name is required' }),
  location: z.string().min(1, { message: 'Farm location is required' })
});

type FormData = z.infer<typeof formSchema>;

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const uid = user?.uid;

  useEffect(() => {
    if (!user?.uid) {
      navigate('/login');
    }
  }, [user, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: ''
    }
  });

  const {
    data: farms,
    refetch,
    isLoading,
    error
  } = useQuery<Farm[], Error>({
    queryKey: ['farms', uid],
    queryFn: async () => {
      const response = await fetch(
        `http://4.206.218.223:3001/api/v1/farm?uid=${uid}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch farms');
      }
      return response.json();
    },
    enabled: !!uid
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://4.206.218.223:3001/api/v1/farm',
        { ...data, uid },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log('Farm created successfully', response.data);

      refetch();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error(
        'Farm creation error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-100 to-gray-50 font-sans text-gray-800">
      <Navbar2 />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="container mx-auto flex-grow overflow-y-auto p-6">
          <header className="mb-6 flex w-full items-center justify-between">
            <div className="w-full flex-1">
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
                        className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-white p-4 text-gray-800 shadow"
                      >
                        <h3 className="mt-1 text-2xl font-semibold">
                          {farm.name}
                        </h3>
                        <p className="text-gray-600">{farm.location}</p>
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <button className="mt-3 self-end rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                              Add House
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Poultry Farm</DialogTitle>
                              <DialogDescription>
                                Fill in the details below to create a new
                                poultry farm.
                              </DialogDescription>
                            </DialogHeader>
                            <section className="p-4">
                              <Form {...form}>
                                <form
                                  onSubmit={form.handleSubmit(onSubmit)}
                                  className="space-y-6"
                                >
                                  <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Farm Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Farm name"
                                            {...field}
                                          />
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
                                          <Input
                                            placeholder="Farm location"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button
                                    type="submit"
                                    className="mt-4 w-full"
                                    disabled={loading}
                                  >
                                    {loading ? 'Submitting...' : 'Submit'}
                                  </Button>
                                </form>
                              </Form>
                            </section>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 rounded-md border bg-white p-6">
                      <p>No Farm available. Create Farm.</p>
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <button className="rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                            Add Farm
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Poultry Farm</DialogTitle>
                            <DialogDescription>
                              Fill in the details below to create a new poultry
                              farm.
                            </DialogDescription>
                          </DialogHeader>
                          <section className="p-4">
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                              >
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Farm Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Farm name"
                                          {...field}
                                        />
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
                                        <Input
                                          placeholder="Farm location"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="submit"
                                  className="mt-4 w-full"
                                  disabled={loading}
                                >
                                  {loading ? 'Submitting...' : 'Submit'}
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
            <h1 className="text-2xl font-semibold">Houses</h1>
            <p className="mt-4">No Houses Available</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

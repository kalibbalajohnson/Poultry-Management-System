import { useState } from 'react';
import axios from 'axios';
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { DataTable } from '@/components/dataTable/dataTable';
import { House, columns } from '@/components/dataTable/houseColumns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

const houseSchema = z.object({
  name: z.string().min(1, 'House name is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  houseType: z.string().min(1, 'House type is required')
});

type FormData = z.infer<typeof houseSchema>;

function HousingPage() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      name: '',
      capacity: 0,
      houseType: ''
    }
  });

  const accessToken = localStorage.getItem('accessToken');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://92.112.180.180:3000/api/v1/house',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      console.log('New House Added:', res.data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(
        'House creation error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };

  const { data: houses = [] } = useQuery<House[]>({
    queryKey: ['houses'],
    queryFn: async () => {
      try {
        const res = await fetch('http://92.112.180.180:3000/api/v1/house',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

        if (!res.ok) throw new Error('Failed to fetch house data');
        return res.json();
      } catch (err) {
        console.error('Failed to fetch house data:', err);
        throw err;
      }
    },
    refetchInterval: 3000,
  });

  return (
    <Layout>
      <Navbar2 />
      <div className="w-full space-y-4">
        <div className="rounded-lg bg-white px-8 py-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Farm Houses</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                  Add House
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add House</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new house.
                  </DialogDescription>
                </DialogHeader>
                <section className="p-2">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>House Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter house name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter capacity" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="houseType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>House Type</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select house type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Deep Litter">Deep Litter</SelectItem>
                                  <SelectItem value="Caged">Caged</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                        {loading ? 'Adding...' : 'Add House'}
                      </Button>
                    </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>
          <div className="container mx-auto mt-4">
            <DataTable columns={columns} data={houses} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HousingPage;
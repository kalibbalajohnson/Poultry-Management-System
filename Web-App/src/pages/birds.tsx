import { useState } from 'react';
import axios from 'axios';
import { DataTable } from '@/components/dataTable/dataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Batch, columns } from "@/components/dataTable/batchColumns";
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';

const batchSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  arrivalDate: z.string().min(1, "Arrival date is required"),
  ageAtArrival: z.coerce.number().min(0, "Age at arrival must be at least 0"),
  chickenType: z.string().min(1, "Chicken type is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  supplier: z.string().min(1, "Supplier is required"),
});

type FormData = z.infer<typeof batchSchema>;

function BatchPage() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      arrivalDate: "",
      ageAtArrival: 0,
      chickenType: "",
      quantity: 0,
      supplier: "",
    },
  });

  const accessToken = localStorage.getItem('accessToken');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://92.112.180.180:3000/api/v1/batch',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      console.log('New Batch Added:', res.data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(
        'Batch creation error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };

  const { data: batches = [] } = useQuery<Batch[]>({
    queryKey: ['batches'],
    queryFn: async () => {
      try {
        const res = await fetch('http://92.112.180.180:3000/api/v1/batch',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

        if (!res.ok) throw new Error('Failed to fetch batch data');
        return res.json();
      } catch (err) {
        console.error('Failed to fetch batch data:', err);
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
            <h2 className="text-2xl font-semibold">Farm Batches</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                  Add Batch
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Batch</DialogTitle> 
                  <DialogDescription>
                    Fill in the details below to add a new batch.
                  </DialogDescription>
                </DialogHeader>
                <section className="p-2">
                  <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4">
                  < div  className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter batch name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="arrivalDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Arrival Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ageAtArrival"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age at Arrival (days)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter age at arrival" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="chickenType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chicken Type</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select chicken type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Broiler">Broiler</SelectItem>
                                  <SelectItem value="Layer">Layer</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter quantity" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="supplier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supplier</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter supplier" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      </div>
                      <Button type="submit" className="w-full bg-green-700 mt-4 hover:bg-green-800">
                        {loading ? 'Adding...' : ' Add Batch'}
                      </Button>
                    </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>
          <div className="container mx-auto mt-4">
            <DataTable columns={columns} data={batches} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BatchPage;
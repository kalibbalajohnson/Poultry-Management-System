import { DataTable } from '@/components/dataTable/dataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Production, columns } from "@/components/dataTable/productionColumns"; // Update import
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Batch } from '@/components/dataTable/batchColumns';

const productionSchema = z.object({
  batchId: z.string().min(1, "Batch ID is required"),
  date: z.string().min(1, "Date is required"),
  numberOfDeadBirds: z.coerce.number().min(0, "Dead Birds must be at least 0"),
  numberOfEggsCollected: z.coerce.number().min(1, "Eggs Collected must be at least 0"),
});

type FormData = z.infer<typeof productionSchema>;

function ProductionPage() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  const form = useForm<FormData>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      batchId: "",
      date: "",
      numberOfDeadBirds: 0,
      numberOfEggsCollected: 0,
    }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://92.112.180.180:3000/api/v1/production',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      console.log('New Production Record Added:', res.data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(
        'Production creation error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };


  const { data: production = [] } = useQuery<Production[]>({
    queryKey: ['production'],
    queryFn: async () => {
      const res = await fetch('http://92.112.180.180:3000/api/v1/production', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch production');
      return res.json();
    },
  });

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
            <h2 className="text-2xl font-semibold">Production</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                  Add Production
                </button>
              </DialogTrigger>
              <DialogContent className='max-w-xl'>
                <DialogHeader>
                  <DialogTitle>Add Production</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add new production data.
                  </DialogDescription>
                </DialogHeader>
                <section className="p-2">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="batchId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a batch" />
                                </SelectTrigger>
                                <SelectContent>
                                  {batches?.map((batch) => (
                                    <SelectItem key={batch.id} value={batch.id}>
                                      {batch.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" placeholder="Select date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="numberOfEggsCollected"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eggs Collected</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter metric value" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="numberOfDeadBirds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dead Birds</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter metric value" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="col-span-1 md:col-span-2">
                        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                          {loading ? 'Adding...' : 'Add Production'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>
          <div className="container mx-auto mt-4">
            <DataTable columns={columns} data={production} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductionPage;
import { DataTable } from '@/components/dataTable/dataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Stock, columns } from "@/components/dataTable/stockColumns";
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const stockSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  threshold: z.coerce.number().min(1, "Threshold must be at least 1"),
});

type FormData = z.infer<typeof stockSchema>;

function StockPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      item: "",
      category: "",
      quantity: 0,
      threshold: 0,
    },
  });

  const accessToken = localStorage.getItem('accessToken');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://92.112.180.180:3000/api/v1/stock',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      console.log('New Stock Added:', res.data);
      form.reset();
    } catch (error) {
      console.error(
        'Stock creation error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };

  const { data: stock = [] } = useQuery<Stock[]>({
    queryKey: ['stock'],
    queryFn: async () => {
      try {
        const res = await fetch('http://92.112.180.180:3000/api/v1/stock', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch stock data');
        return res.json();
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
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
            <h2 className="text-2xl font-semibold">Farm Stock</h2>
            <Dialog>
              <DialogTrigger>
                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                  Add Stock
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Stock</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add new stock.
                  </DialogDescription>
                </DialogHeader>
                <section className="p-2">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="item"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter item name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Feed">Feed</SelectItem>
                                  <SelectItem value="Medicine">Medicine</SelectItem>
                                  <SelectItem value="Equipment">Equipment</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
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
                        name="threshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Threshold</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter threshold" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      </div>
                      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                        {loading ? 'Adding...' : 'Add Stock'}
                      </Button>
                    </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>
          <div className="container mx-auto mt-4">
            <DataTable columns={columns} data={stock} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StockPage;
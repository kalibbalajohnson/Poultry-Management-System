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

const stockSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

const data: Stock[] = [
  { id: "1", item: "Maize Bran", category: "Feed", quantity: 100 },
  { id: "2", item: "Soybean Meal", category: "Feed", quantity: 50 },
  { id: "3", item: "Wheat Bran", category: "Feed", quantity: 80 },
  { id: "1", item: "Maize Bran", category: "Feed", quantity: 100 },
  { id: "2", item: "Soybean Meal", category: "Feed", quantity: 50 },
  { id: "3", item: "Wheat Bran", category: "Feed", quantity: 80 },
];

function StockPage() {
  const form = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      item: "",
      category: "",
      quantity: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof stockSchema>) => {
    console.log("New Stock Added:", values);
    form.reset();
  };

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
                      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                        Add Stock
                      </Button>
                    </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>
          <div className="container mx-auto mt-4">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StockPage;
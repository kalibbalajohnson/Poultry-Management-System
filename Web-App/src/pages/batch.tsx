import { DataTable } from '@/components/dataTable/dataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Batch, columns } from "@/components/dataTable/batchColumns"; // Update import
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const batchSchema = z.object({
  batchName: z.string().min(1, "Batch name is required"),
  arrivalDate: z.string().min(1, "Arrival date is required"), // Use string for simplicity
  ageAtArrival: z.coerce.number().min(0, "Age at arrival must be at least 0"),
  chickenType: z.string().min(1, "Chicken type is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  supplier: z.string().min(1, "Supplier is required"),
});


const data: Batch[] = [
  {
    id: "1",
    batchName: "Batch 1",
    arrivalDate: new Date("2023-09-01"),
    ageAtArrival: 4,
    chickenType: "Broiler",
    quantity: 100,
    supplier: "Supplier A",
  },
  {
    id: "2",
    batchName: "Batch 2",
    arrivalDate: new Date("2023-09-15"),
    ageAtArrival: 1,
    chickenType: "Layer",
    quantity: 200,
    supplier: "Supplier B",
  },
  {
    id: "3",
    batchName: "Batch 3",
    arrivalDate: new Date("2023-10-01"),
    ageAtArrival: 7,
    chickenType: "Broiler",
    quantity: 150,
    supplier: "Supplier C",
  },
];

function BatchPage() {
  const form = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchName: "",
      arrivalDate: "",
      ageAtArrival: 0,
      chickenType: "",
      quantity: 0,
      supplier: "",
    },
  });

  const onSubmit = (values: z.infer<typeof batchSchema>) => {
    console.log("New Batch Added:", values);
    form.reset();
  };

  return (
    <Layout>
      <Navbar2 />
      <div className="w-full space-y-4">
        <div className="rounded-lg bg-white px-8 py-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Farm Batches</h2> {/* Update title */}
            <Dialog>
              <DialogTrigger>
                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                  Add Batch
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Batch</DialogTitle> {/* Update title */}
                  <DialogDescription>
                    Fill in the details below to add a new batch.
                  </DialogDescription>
                </DialogHeader>
                <section className="p-2">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="batchName"
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
                      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                        Add Batch
                      </Button>
                    </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>
          <div className="container mx-auto mt-4">
            <DataTable columns={columns} data={data} /> {/* Use Batch columns and data */}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BatchPage;
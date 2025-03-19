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

// Define the schema for production
const productionSchema = z.object({
  houseBatchId: z.string().min(1, "Batch ID is required"),
  date: z.string().min(1, "Date is required"),
  metricName: z.string().min(1, "Metric name is required"),
  metricValue: z.coerce.number().min(0, "Metric value must be at least 0"),
});

// Sample data for production
const data: Production[] = [
  {
    houseBatchId: "BATCH001",
    date: new Date("2023-10-01"),
    metricName: "Egg Production",
    metricValue: 500,
  },
  {
    houseBatchId: "BATCH002",
    date: new Date("2023-10-02"),
    metricName: "Feed Consumption",
    metricValue: 1200,
  },
  {
    houseBatchId: "BATCH003",
    date: new Date("2023-10-03"),
    metricName: "Water Usage",
    metricValue: 300,
  },
];

function ProductionPage() {
  const form = useForm({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      houseBatchId: "",
      date: "",
      metricName: "",
      metricValue: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof productionSchema>) => {
    console.log("New Production Added:", values);
    form.reset();
  };

  return (
    <Layout>
      <Navbar2 />
      <div className="w-full space-y-4">
        <div className="rounded-lg bg-white px-8 py-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Production Data</h2> {/* Update title */}
            <Dialog>
              <DialogTrigger>
                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                  Add Production
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Production</DialogTitle> {/* Update title */}
                  <DialogDescription>
                    Fill in the details below to add new production data.
                  </DialogDescription>
                </DialogHeader>
                <section className="p-2">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="houseBatchId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter batch ID" {...field} />
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
                        name="metricName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metric Name</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select metric name" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Egg Production">Egg Production</SelectItem>
                                  <SelectItem value="Feed Consumption">Feed Consumption</SelectItem>
                                  <SelectItem value="Water Usage">Water Usage</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="metricValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metric Value</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter metric value" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                        Add Production
                      </Button>
                    </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>
          <div className="container mx-auto mt-4">
            <DataTable columns={columns} data={data} /> {/* Use Production columns and data */}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductionPage;
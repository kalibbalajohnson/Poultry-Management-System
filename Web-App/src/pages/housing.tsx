import { DataTable } from '@/components/dataTable/dataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { House, columns } from "@/components/dataTable/houseColumns"; // Update import
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the schema for a house
const houseSchema = z.object({
  name: z.string().min(1, "House name is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  houseType: z.string().min(1, "House type is required"),
});

// Sample data for houses
const data: House[] = [
  {
    id: "1",
    name: "House A",
    capacity: 500,
    houseType: "Deep Litter",
  },
  {
    id: "2",
    name: "House B",
    capacity: 1000,
    houseType: "Cage",
  },
  {
    id: "3",
    name: "House C",
    capacity: 700,
    houseType: "Cage",
  },
];

function HousingPage() {
  const form = useForm({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      houseType: "",
    },
  });

  const onSubmit = (values: z.infer<typeof houseSchema>) => {
    console.log("New House Added:", values);
    form.reset();
  };

  return (
    <Layout>
      <Navbar2 />
      <div className="w-full space-y-4">
        <div className="rounded-lg bg-white px-8 py-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Farm Houses</h2> {/* Update title */}
            <Dialog>
              <DialogTrigger>
                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                  Add House
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add House</DialogTitle> {/* Update title */}
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
                                  <SelectItem value="Cage">Cage</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                        Add House
                      </Button>
                    </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>
          <div className="container mx-auto mt-4">
            <DataTable columns={columns} data={data} /> {/* Use House columns and data */}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HousingPage;
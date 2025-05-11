import { useState} from 'react';
import axios from 'axios';
import { DataTable } from '@/components/dataTable/dataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Feather, Boxes, Users, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const navigate = useNavigate();

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
      refetch(); // Refresh data after adding new batch
    } catch (error) {
      console.error(
        'Batch creation error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };

  const { data: batches = [], isLoading, isError, refetch } = useQuery<Batch[]>({
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
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Calculate statistics
  const totalBirds = batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
  const activeBatches = batches?.filter(batch => !batch.isArchived)?.length || 0;
  const archivedBatches = batches?.filter(batch => batch.isArchived)?.length || 0;
  
  // Types of chickens
  const chickenTypes = batches?.reduce((types, batch) => {
    if (!types[batch.chickenType]) {
      types[batch.chickenType] = 0;
    }
    types[batch.chickenType] += 1;
    return types;
  }, {} as Record<string, number>) || {};

  // Filter batches based on selected type
  const filteredBatches = batches.filter(batch => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "active") return !batch.isArchived;
    if (selectedFilter === "archived") return batch.isArchived;
    return batch.chickenType === selectedFilter;
  });

  return (
    <Layout>
      <Navbar2 />
      <div className="w-full space-y-4">
        <div className="rounded-lg bg-white px-8 py-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Bird Batches</h2>
              <p className="text-gray-500">Manage and monitor all your poultry batches</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800 flex items-center gap-2">
                  <Boxes size={16} />
                  Add New Batch
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Batch</DialogTitle> 
                  <DialogDescription>
                    Fill in the details below to add a new batch of birds to your farm.
                  </DialogDescription>
                </DialogHeader>
                <section className="py-4">
                  <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <FormLabel>Bird Type</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select bird type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Broiler">Broiler</SelectItem>
                                  <SelectItem value="Layer">Layer</SelectItem>
                                  <SelectItem value="Dual Purpose">Dual Purpose</SelectItem>
                                  <SelectItem value="Breeder">Breeder</SelectItem>
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
                    <DialogFooter className="mt-6">
                      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-green-700 hover:bg-green-800">
                        {loading ? 'Adding...' : 'Add Batch'}
                      </Button>
                    </DialogFooter>
                  </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>

          {/* Key statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Birds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Feather className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-2xl font-bold">{totalBirds}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Boxes className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-2xl font-bold">{activeBatches}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Archived Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-2xl font-bold">{archivedBatches}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Bird Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(chickenTypes).map(([type, count]) => (
                    <Badge key={type} variant="outline">
                      {type}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={selectedFilter === "all" ? "default" : "outline"} 
              onClick={() => setSelectedFilter("all")}
              className={selectedFilter === "all" ? "bg-green-700 hover:bg-green-800" : ""}
            >
              All Batches
            </Button>
            <Button 
              variant={selectedFilter === "active" ? "default" : "outline"} 
              onClick={() => setSelectedFilter("active")}
              className={selectedFilter === "active" ? "bg-green-700 hover:bg-green-800" : ""}
            >
              Active
            </Button>
            <Button 
              variant={selectedFilter === "archived" ? "default" : "outline"} 
              onClick={() => setSelectedFilter("archived")}
              className={selectedFilter === "archived" ? "bg-green-700 hover:bg-green-800" : ""}
            >
              Archived
            </Button>
            {Object.keys(chickenTypes).map(type => (
              <Button 
                key={type}
                variant={selectedFilter === type ? "default" : "outline"} 
                onClick={() => setSelectedFilter(type)}
                className={selectedFilter === type ? "bg-green-700 hover:bg-green-800" : ""}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Data Table */}
          <div className="container mx-auto mt-4">
            {isLoading ? (
              <div className="text-center py-8">Loading batch data...</div>
            ) : isError ? (
              <div className="bg-red-50 p-4 rounded-md flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                <p className="text-red-500">Error loading batch data. Please try again later.</p>
              </div>
            ) : filteredBatches.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <Boxes className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No batches found matching your filter criteria.</p>
                <Button 
                  className="mt-4 bg-green-700 hover:bg-green-800"
                  onClick={() => setOpen(true)}
                >
                  Add First Batch
                </Button>
              </div>
            ) : (
              <DataTable columns={columns} data={filteredBatches} />
            )}
          </div>

          {/* Batch Management Tips */}
          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-blue-900 mb-2">Batch Management Tips</h3>
            <ul className="list-disc pl-5 text-blue-800 text-sm">
              <li>Regularly update batch information to maintain accurate records</li>
              <li>Archive inactive batches to keep your dashboard organized</li>
              <li>Monitor age progression to plan feeding and healthcare schedules</li>
              <li>Use batch filters to quickly find the information you need</li>
            </ul>
          </div>
          
          {/* Simple helper messages that don't require Tooltip component */}
          <div className="mt-6 text-sm text-gray-500 flex items-center gap-2">
            <div className="bg-gray-200 p-2 rounded-full">?</div>
            <p>Need help with batch management? Contact your administrator or check the user manual.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BatchPage;
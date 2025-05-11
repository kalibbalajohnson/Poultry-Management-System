import { useState, useEffect } from 'react';
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
import { Feather, Boxes, Users, AlertTriangle, Edit, Archive, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ColumnDef } from "@tanstack/react-table";

const batchSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  arrivalDate: z.string().min(1, "Arrival date is required"),
  ageAtArrival: z.coerce.number().min(0, "Age at arrival must be at least 0"),
  chickenType: z.string().min(1, "Chicken type is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  supplier: z.string().min(1, "Supplier is required"),
  isArchived: z.boolean().optional(),
});

type FormData = z.infer<typeof batchSchema>;

function BatchPage() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [editMode, setEditMode] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      arrivalDate: "",
      ageAtArrival: 0,
      chickenType: "",
      quantity: 0,
      supplier: "",
      isArchived: false,
    },
  });

  // Reset form and selected batch when dialog closes
  useEffect(() => {
    if (!open) {
      setEditMode(false);
      setSelectedBatch(null);
      form.reset({
        name: "",
        arrivalDate: "",
        ageAtArrival: 0,
        chickenType: "",
        quantity: 0,
        supplier: "",
        isArchived: false,
      });
    }
  }, [open, form]);

  // Populate form when editing
  useEffect(() => {
    if (selectedBatch && editMode) {
      form.reset({
        name: selectedBatch.name,
        arrivalDate: new Date(selectedBatch.arrivalDate).toISOString().split('T')[0],
        ageAtArrival: selectedBatch.ageAtArrival,
        chickenType: selectedBatch.chickenType,
        quantity: selectedBatch.quantity,
        supplier: selectedBatch.supplier,
        isArchived: selectedBatch.isArchived || false,
      });
    }
  }, [selectedBatch, editMode, form]);

  const accessToken = localStorage.getItem('accessToken');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (editMode && selectedBatch) {
        // Update existing batch
        const res = await axios.patch(
          `http://92.112.180.180:3000/api/v1/batch/${selectedBatch.id}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        console.log('Batch Updated:', res.data);
      } else {
        // Create new batch
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
      }
      
      form.reset();
      setOpen(false);
      setEditMode(false);
      setSelectedBatch(null);
      refetch(); // Refresh data after adding/updating batch
    } catch (error) {
      console.error(
        editMode ? 'Batch update error:' : 'Batch creation error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle archiving a batch
  const handleArchiveBatch = async () => {
    if (!selectedBatch) return;
    
    setLoading(true);
    try {
      await axios.patch(
        `http://92.112.180.180:3000/api/v1/batch/${selectedBatch.id}`,
        { isArchived: !selectedBatch.isArchived },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      
      setArchiveDialogOpen(false);
      setSelectedBatch(null);
      refetch(); // Refresh data after archiving
    } catch (error) {
      console.error(
        'Batch archive error:',
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

  // Create custom columns with edit and archive actions
  const enhancedColumns: ColumnDef<Batch>[] = [
    ...columns.slice(0, -1), // Use all original columns except the last one (actions)
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const batch = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setEditMode(true);
                setSelectedBatch(batch);
                setOpen(true);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedBatch(batch);
                setArchiveDialogOpen(true);
              }}
              className="h-8 w-8 p-0"
            >
              <Archive className="h-4 w-4" />
              <span className="sr-only">Archive</span>
            </Button>
          </div>
        );
      },
    }
  ];

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
                  <DialogTitle>{editMode ? "Edit Batch" : "Add New Batch"}</DialogTitle> 
                  <DialogDescription>
                    {editMode 
                      ? "Update the details for this batch of birds." 
                      : "Fill in the details below to add a new batch of birds to your farm."}
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
                      
                      {editMode && (
                        <FormField
                          control={form.control}
                          name="isArchived"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Archived Status</FormLabel>
                                <div className="text-xs text-muted-foreground">
                                  Mark this batch as archived if it's no longer active
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-green-700 hover:bg-green-800">
                        {loading ? 'Processing...' : editMode ? 'Update Batch' : 'Add Batch'}
                      </Button>
                    </DialogFooter>
                  </form>
                  </Form>
                </section>
              </DialogContent>
            </Dialog>
          </div>

          {/* Archive Confirmation Dialog */}
          <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedBatch?.isArchived ? "Unarchive Batch" : "Archive Batch"}</DialogTitle>
                <DialogDescription>
                  {selectedBatch?.isArchived 
                    ? "This will make the batch active again. Are you sure you want to unarchive this batch?"
                    : "This will hide the batch from active records. You can unarchive it later if needed."}
                </DialogDescription>
              </DialogHeader>
              <div className="p-6 border rounded-lg flex items-center gap-3 bg-gray-50">
                {selectedBatch?.isArchived ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Archive className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <h4 className="font-medium">{selectedBatch?.name}</h4>
                  <p className="text-sm text-gray-500">
                    {selectedBatch?.quantity} birds - {selectedBatch?.chickenType}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setArchiveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleArchiveBatch}
                  variant="default"
                  className={selectedBatch?.isArchived ? "bg-green-700 hover:bg-green-800" : "bg-amber-600 hover:bg-amber-700"}
                >
                  {loading ? 'Processing...' : selectedBatch?.isArchived ? 'Unarchive Batch' : 'Archive Batch'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
              <DataTable columns={enhancedColumns} data={filteredBatches} />
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
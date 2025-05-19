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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  AlertTriangle,
  Filter,
  Plus,
  ChevronDown,
  LucideRefreshCw,
  PlusCircle,
  ShoppingCart
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const stockSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  threshold: z.coerce.number().min(0, "Threshold must be at least 0"),
  notes: z.string().optional(),
  supplier: z.string().optional(),
  unitPrice: z.coerce.number().optional(),
  unit: z.string().optional().default("kg"),
});

type FormData = z.infer<typeof stockSchema>;

function StockPage() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Stock | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(0);
  const [restockNote, setRestockNote] = useState<string>('');
  const [restockLoading, setRestockLoading] = useState(false);
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;

  const form = useForm<FormData>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      item: "",
      category: "",
      quantity: 0,
      threshold: 0,
      notes: "",
      supplier: "",
      unitPrice: 0,
      unit: "kg",
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
      setOpen(false);
      refetch();
    } catch (error) {
      console.error(
        'Stock creation error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    if (!selectedItem) return;

    setRestockLoading(true);
    try {
      const res = await axios.patch(
        `http://92.112.180.180:3000/api/v1/stock/${selectedItem.id}`,
        {
          quantity: selectedItem.quantity + restockAmount,
          notes: restockNote ? `${selectedItem.notes || ''}\n${new Date().toLocaleString()}: Restocked +${restockAmount} ${selectedItem.unit || 'kg'} - ${restockNote}` : selectedItem.notes
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      console.log('Stock Updated:', res.data);
      setRestockDialogOpen(false);
      setSelectedItem(null);
      setRestockAmount(0);
      setRestockNote('');
      refetch();
    } catch (error) {
      console.error(
        'Stock update error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setRestockLoading(false);
    }
  };

  const { data: stock = [], isLoading, isError, refetch } = useQuery<Stock[]>({
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
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Calculate stock statistics
  const totalItems = stock.length;
  const lowStockItems = stock.filter(item => item.quantity <= item.threshold).length;
  const totalByCategory = stock.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Filter stock based on selected filter
  const filteredStock = stock.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'low') return item.quantity <= item.threshold;
    return item.category === filter;
  });

  // Handlers for category filtering
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return (
    <Layout>
      <Navbar2 />
      <div className="w-full p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Inventory Management</h2>
            <p className="text-gray-500">Track and manage your farm's inventory levels</p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={filter === 'all' ? 'bg-accent text-accent-foreground' : ''}
                  onClick={() => handleFilterChange('all')}
                >
                  All Items
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filter === 'low' ? 'bg-accent text-accent-foreground' : ''}
                  onClick={() => handleFilterChange('low')}
                >
                  Low Stock Items
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {Object.keys(totalByCategory).map(category => (
                  <DropdownMenuItem
                    key={category}
                    className={filter === category ? 'bg-accent text-accent-foreground' : ''}
                    onClick={() => handleFilterChange(category)}
                  >
                    {category} ({totalByCategory[category]})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              title="Refresh stock data"
            >
              <LucideRefreshCw className="h-4 w-4" />
            </Button>
            {user?.role !== "Worker" && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-700 hover:bg-green-800 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add Inventory Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to your inventory. Fill out the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details">Item Details</TabsTrigger>
                      <TabsTrigger value="advanced">Additional Info</TabsTrigger>
                    </TabsList>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
                        <TabsContent value="details" className="space-y-4">
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
                                      <SelectItem value="Supplies">Supplies</SelectItem>
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
                              name="unit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Unit</FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                        <SelectItem value="bags">Bags</SelectItem>
                                        <SelectItem value="pcs">Pieces</SelectItem>
                                        <SelectItem value="bottles">Bottles</SelectItem>
                                        <SelectItem value="boxes">Boxes</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="threshold"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Low Stock Threshold</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Enter threshold" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                        <TabsContent value="advanced" className="space-y-4">
                          <FormField
                            control={form.control}
                            name="supplier"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Supplier (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter supplier name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="unitPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unit Price (Optional)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Enter unit price" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter any additional notes or information about this item"
                                    className="min-h-[80px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-green-700 hover:bg-green-800"
                            disabled={loading}
                          >
                            {loading ? 'Adding...' : 'Add Item'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stock Overview Cards */}
        {user?.role !== "Worker" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-2xl font-bold">{totalItems}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(totalByCategory).map(([category, count]) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={lowStockItems > 0 ? "border-amber-200 bg-amber-50" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${lowStockItems > 0 ? "text-amber-700" : "text-gray-500"}`}>
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${lowStockItems > 0 ? "text-amber-600" : "text-gray-700"}`} />
                  <span className={`text-2xl font-bold ${lowStockItems > 0 ? "text-amber-700" : ""}`}>
                    {lowStockItems}
                  </span>
                </div>
                {lowStockItems > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs border-amber-300 text-amber-800 hover:bg-amber-100"
                    onClick={() => handleFilterChange('low')}
                  >
                    View Low Stock Items
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setOpen(true)}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Item
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Order Supplies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter indication */}
        {filter !== 'all' && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700">
                {filter === 'low' ? 'Showing low stock items only' : `Filtered by category: ${filter}`}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              onClick={() => handleFilterChange('all')}
            >
              Clear Filter
            </Button>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Inventory Items</h3>
            <p className="text-sm text-gray-500">
              {filter === 'all'
                ? 'Showing all inventory items'
                : filter === 'low'
                  ? 'Showing low stock items'
                  : `Showing ${filter} items`
              }
            </p>
          </div>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading inventory data...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-8 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 font-medium">Failed to load inventory data</p>
              <p className="text-red-500 text-sm mt-1">Please check your connection and try again</p>
              <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : filteredStock.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Package className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No items found</p>
              {filter !== 'all' ? (
                <p className="text-gray-500 text-sm mt-1">Try clearing your filter or adding more items</p>
              ) : (
                <p className="text-gray-500 text-sm mt-1">Add your first inventory item to get started</p>
              )}
              <Button
                className="mt-4 bg-green-700 hover:bg-green-800"
                onClick={() => setOpen(true)}
              >
                Add First Item
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-md border">
                <DataTable
                  columns={[
                    ...columns.slice(0, -1), // All columns except the last one (actions)
                    {
                      id: "status",
                      header: "Status",
                      cell: ({ row }) => {
                        const item = row.original;
                        const percentage = Math.min(Math.round((item.quantity / Math.max(item.threshold * 2, 1)) * 100), 100);
                        let statusColor = "bg-green-500";
                        let statusText = "Good";

                        if (item.quantity <= item.threshold) {
                          statusColor = "bg-red-500";
                          statusText = "Low";
                        } else if (item.quantity <= item.threshold * 1.5) {
                          statusColor = "bg-amber-500";
                          statusText = "Warning";
                        }

                        return (
                          <div className="w-28">
                            <div className="flex justify-between items-center mb-1 text-xs">
                              <span>{statusText}</span>
                              <span>{percentage}%</span>
                            </div>
                            <Progress value={percentage} className="h-2" indicatorClassName={statusColor} />
                          </div>
                        );
                      },
                    },
                    {
                      id: "actions",
                      header: "Actions",
                      cell: ({ row }) => {
                        const item = row.original;
                        return (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-green-700 border-green-700 hover:bg-green-50"
                              onClick={() => {
                                setSelectedItem(item);
                                setRestockAmount(Math.max(item.threshold * 2 - item.quantity, 10));
                                setRestockDialogOpen(true);
                              }}
                            >
                              Restock
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Checkout</DropdownMenuItem>
                                {user?.role !== "Worker" && (
                                  <>
                                    <DropdownMenuItem>View History</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        );
                      },
                    }
                  ]}
                  data={filteredStock}
                />
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Showing {filteredStock.length} of {stock.length} total items
              </p>
            </>
          )}
        </div>

        {/* Restock dialog */}
        <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Restock Inventory</DialogTitle>
              <DialogDescription>
                Add more stock to {selectedItem?.item}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium">{selectedItem?.item}</p>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-500">Current Stock:</span>
                    <span>{selectedItem?.quantity} {selectedItem?.unit || 'kg'}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-500">Threshold:</span>
                    <span>{selectedItem?.threshold} {selectedItem?.unit || 'kg'}</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount to Add
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(Number(e.target.value))}
                    min={1}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes (Optional)
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Enter details about this restock (supplier, cost, etc.)"
                    value={restockNote}
                    onChange={(e) => setRestockNote(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRestockDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-700 hover:bg-green-800"
                onClick={handleRestock}
                disabled={restockLoading || restockAmount <= 0}
              >
                {restockLoading ? 'Processing...' : 'Confirm Restock'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Inventory Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2">Inventory Management Tips</h3>
          <ul className="list-disc text-blue-700 text-sm ml-5 space-y-1">
            <li>Set appropriate threshold values to get notified when stock is running low</li>
            <li>Regularly check the "Low Stock Items" filter to see what needs restocking</li>
            <li>Add supplier information to make reordering easier</li>
            <li>Analyze stock usage patterns to forecast future demand </li>
            <li>Ensure that all staff involved in stock management are well-trained </li>
            <li>Use the notes field to record important details about specific items</li>
            <li>Organize stock items into categories</li>

          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default StockPage;
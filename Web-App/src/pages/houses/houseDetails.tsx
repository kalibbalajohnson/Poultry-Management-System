import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Home, Boxes, Monitor } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Batch } from "@/components/dataTable/batchColumns";

interface House {
  id: string;
  name: string;
  capacity: number;
  houseType: string;
  isMonitored: string;
  createdAt: string;
  updatedAt: string;
}

interface Allocation {
  id: string;
  batchId: string;
  houseId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

const allocationSchema = z.object({
  batchId: z.string().min(1, 'Batch is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
});

type FormData = z.infer<typeof allocationSchema>;

const HouseDetailPage = () => {
  const { id } = useParams();
  const [house, setHouse] = useState<House | null>(null);
  const [loading1, setLoading1] = useState(false);
  // const [loading2, setLoading2] = useState(false);
  // const [loading3, setLoading3] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      batchId: '',
      quantity: 0
    }
  });

  const accessToken = localStorage.getItem('accessToken');

  const onSubmit = async (data: FormData) => {
    setLoading1(true);
    try {
      const res = await axios.post(
        'http://92.112.180.180:3000/api/v1/batch/allocation',
        {
          ...data,
          houseId: id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      console.log('New Batch Allocation Added:', res.data);
      form.reset();
      setOpen1(false);
    } catch (error) {
      console.error(
        'Batch Alloccation creation error:',
        error instanceof Error ? error.message : error
      );
    } finally {
      setLoading1(false);
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

  const {
    data: allocation = [],
    isError,
    error,
  } = useQuery<Allocation[]>({
    queryKey: ['allocation', id],
    queryFn: async () => {
      const res = await fetch(`http://92.112.180.180:3000/api/v1/batch/allocation/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch allocation');
      return res.json();
    },
    refetchInterval: 3000,
  });

  if (isError) {
    console.error('Error fetching allocation:', error);
  }

  const { data: houses = [] } = useQuery<House[]>({
    queryKey: ['houses'],
    queryFn: async () => {
      const res = await fetch('http://92.112.180.180:3000/api/v1/house', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch houses');
      return res.json();
    },
  });

  useEffect(() => {
    if (houses.length && id) {
      const found = houses.find((entry) => entry.id === id);
      setHouse(found || null);
    }
  }, [houses, id]);

  const totalAllocated = allocation.reduce((sum, alloc) => sum + alloc.quantity, 0);
  const houseCapacity = house?.capacity ?? 1;
  const fillPercentage = Math.min(Math.floor((totalAllocated / houseCapacity) * 100), 100);
  const totalBoxes = 20;
  const filledBoxes = Math.floor((fillPercentage / 100) * totalBoxes);

  return (
    <Layout>
      <Navbar2 />
      <div className="bg-white px-8 py-5 min-h-screen">
        <div className="mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">House {house?.name || 'Unknown'}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex items-center gap-1 px-4 py-2 transition rounded-full bg-green-700 text-sm font-semibold text-white duration-200 hover:bg-green-800">
                  Allocation
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setOpen1(true)}>
                  Create
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setOpen2(true)}>
                  Transfer In
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setOpen3(true)}>
                  Transfer Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog open={open1} onOpenChange={setOpen1}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Batch Allocation</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new house.
                </DialogDescription>
              </DialogHeader>
              <section className="p-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter capacity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                      {loading1 ? 'Creating...' : 'Create'}
                    </Button>
                  </form>
                </Form>
              </section>
            </DialogContent>
          </Dialog>

          <Dialog open={open2} onOpenChange={setOpen2}>
            <DialogContent>
              {/* content here */}
            </DialogContent>
          </Dialog>

          <Dialog open={open3} onOpenChange={setOpen3}>
            <DialogContent>
              {/* content here */}
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1 p-8 space-y-6">
              <div className="flex items-center gap-4">
                <Home className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">House Name</p>
                  <h3 className="text-2xl font-semibold text-gray-800">{house?.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Boxes className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <h3 className="text-xl font-semibold text-gray-700">{house?.capacity ?? 'N/A'} Units</h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Monitor className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Monitoring</p>
                  <h3 className="text-xl font-semibold text-gray-700">
                    {house?.isMonitored === 'true' ? 'Active' : 'Not Active'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Home className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">House Type</p>
                  <h3 className="text-xl font-semibold text-gray-700">
                    {house?.houseType ?? 'N/A'}
                  </h3>
                </div>
              </div>
            </div>

            <div className="relative w-full p-4 bg-gray-100 border border-gray-200 rounded-xl shadow-inner md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Occupancy Map</h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalBoxes }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-11 w-full rounded-sm transition-all duration-500 ease-in-out ${index < filledBoxes
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
              <div className="absolute top-4 right-4 bg-white border px-3 py-1 rounded-full text-sm font-semibold shadow">
                {fillPercentage}% Filled
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                Allocated: {totalAllocated} / Capacity: {houseCapacity}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HouseDetailPage;
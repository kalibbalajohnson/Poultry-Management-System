import { useState } from 'react';
import axios from 'axios';
import { DataTable } from '@/components/dataTable/dataTable';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Staff } from "@/components/dataTable/staffColumns";
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
<<<<<<< Updated upstream
=======
import { 
  Alert, 
  AlertDescription 
} from "@/components/ui/alert";
import { 
  Users, 
  Search, 
  UserPlus, 
  X, 
  Loader2, 
  Shield, 
  UserCog, 
  AlignJustify,
  Check,
  AlertCircle,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
>>>>>>> Stashed changes

const userSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    role: z.string().min(1, "Role is required"),
    email: z.string().min(1, "email is required"),
    contact: z.string().min(1, "contact is required"),
    password: z.string().min(1, "password is required"),
});

type FormData = z.infer<typeof userSchema>;

function StaffPage() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            role: "",
            email: "",
            contact: "",
            password: "",
        },
    });

    const accessToken = localStorage.getItem('accessToken');

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const res = await axios.post(
                'http://92.112.180.180:3000/api/v1/user/register',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            console.log('New Staff Added:', res.data);
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error(
                'Staff creation error:',
                error instanceof Error ? error.message : error
            );
        } finally {
            setLoading(false);
        }
    };

    const { data: staff = [] } = useQuery<Staff[]>({
        queryKey: ['staff'],
        queryFn: async () => {
            try {
                const res = await fetch('http://92.112.180.180:3000/api/v1/user/staff',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                if (!res.ok) throw new Error('Failed to fetch staff data');
                return res.json();
            } catch (err) {
                console.error('Failed to fetch staff data:', err);
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
                        <h2 className="text-2xl font-semibold">Farm Staff</h2>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger>
                                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                                    Add Staff
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>Add Staff</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to add a new staff member.
                                    </DialogDescription>
                                </DialogHeader>
                                <section className="p-2">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>First Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter first name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Last Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter last name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="role"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Role</FormLabel>
                                                        <FormControl>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select staff role" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Admin">
                                                                        Admin
                                                                    </SelectItem>
                                                                    <SelectItem value="Worker">
                                                                        Worker
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="contact"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Contact</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter phone number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter email address" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter password" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full mt-4 bg-green-700 hover:bg-green-800 col-span-2">
                                                {loading ? 'Adding...' : 'Add Staff'}
                                            </Button>
                                        </form>
                                    </Form>
                                </section>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="container mx-auto mt-4">
                        <DataTable columns={columns} data={staff} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default StaffPage;
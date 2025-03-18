import { DataTable } from '@/components/dataTable/dataTable';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Workers, columns } from "@/components/dataTable/staffColumns";
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const userSchema = z.object({
    firstName: z.string().min(1, "Batch number is required"),
    lastName: z.string().min(1, "Vaccine name is required"),
    userRole: z.string().min(1, "Time is required"),
    email: z.string().min(1, "Disease is required"),
    contact: z.string().min(1, "Time is required"),
    password: z.string().min(1, "Disease is required"),
});

const data: Workers[] = [
    { id: "1", firstName: "John", lastName: "Doe", userRole: "Admin", email: "john.doe@example.com", contact: "0785434567", password: "securepassword1" },
    { id: "2", firstName: "Jane", lastName: "Smith", userRole: "Worker", email: "jane.smith@example.com", contact: "0785434567", password: "securepassword2" },
    { id: "3", firstName: "Robert", lastName: "Brown", userRole: "Worker", email: "robert.brown@example.com", contact: "0785434567", password: "securepassword3" },
    { id: "4", firstName: "Emily", lastName: "Clark", userRole: "Worker", email: "emily.clark@example.com", contact: "0785434567", password: "securepassword4" },
    { id: "5", firstName: "Michael", lastName: "Davis", userRole: "Worker", email: "michael.davis@example.com", contact: "0785434567", password: "securepassword5" },
    { id: "6", firstName: "Sarah", lastName: "Wilson", userRole: "Worker", email: "sarah.wilson@example.com", contact: "0785434567", password: "securepassword6" }
];

function StaffPage() {
    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            userRole: "",
            email: "",
            contact: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof userSchema>) => {
        console.log("User Added:", values);
        form.reset();
    };

    return (
        <Layout>
            <Navbar2 />
            <div className="w-full space-y-4">
                <div className="rounded-lg bg-white px-8 py-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Farm Staff</h2>
                        <Dialog>
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
                                                name="userRole"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Role</FormLabel>
                                                        <FormControl>
                                                            <Select {...field}>
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
                                                Add Staff
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

export default StaffPage;
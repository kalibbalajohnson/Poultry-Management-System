import { DataTable } from '@/components/dataTable/dataTable';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Immunization, columns } from "@/components/dataTable/immunizationColumns";
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const immunizationSchema = z.object({
    batch: z.string().min(1, "Batch number is required"),
    vaccineName: z.string().min(1, "Vaccine name is required"),
    time: z.string().min(1, "Time is required"),
    disease: z.string().min(1, "Disease is required"),
});

const data: Immunization[] = [
    { id: "1", batch: "B001", vaccineName: "Newcastle Vaccine", time: "08:00 AM", disease: "Newcastle Disease", status: "Completed", notes: "No reactions" },
    { id: "2", batch: "B002", vaccineName: "Marek's Disease Vaccine", time: "09:30 AM", disease: "Marek's Disease", status: "Pending", notes: "Scheduled for tomorrow" },
    { id: "3", batch: "B003", vaccineName: "Fowlpox Vaccine", time: "11:00 AM", disease: "Fowlpox", status: "Completed", notes: "Mild swelling" },
    { id: "4", batch: "B004", vaccineName: "Infectious Bronchitis Vaccine", time: "02:00 PM", disease: "Infectious Bronchitis", status: "Completed", notes: "Good response" },
    { id: "5", batch: "B005", vaccineName: "Avian Influenza Vaccine", time: "03:45 PM", disease: "Avian Influenza", status: "Pending", notes: "To be administered" },
    { id: "6", batch: "B006", vaccineName: "Salmonella Vaccine", time: "05:00 PM", disease: "Salmonella", status: "Completed", notes: "All birds vaccinated" },
];

function ImmunizationPage() {
    const form = useForm({
        resolver: zodResolver(immunizationSchema),
        defaultValues: {
            batch: "",
            vaccineName: "",
            time: "",
            disease: "",
        },
    });

    const onSubmit = (values: z.infer<typeof immunizationSchema>) => {
        console.log("New Immunization Schedule Added:", values);
        form.reset();
    };

    return (
        <Layout>
            <Navbar2 />
            <div className="w-full space-y-4">
                <div className="rounded-lg bg-white px-8 py-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Immunization</h2>
                        <Dialog>
                            <DialogTrigger>
                                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                                    Add Schedule
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Schedule</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to add a new immunization schedule.
                                    </DialogDescription>
                                </DialogHeader>
                                <section className="p-2">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="batch"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Batch Number</FormLabel>
                                                        <FormControl>
                                                            <Select {...field}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select batch number" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {data.map((item) => (
                                                                        <SelectItem key={item.id} value={item.batch}>
                                                                            {item.batch}
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
                                                name="vaccineName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Vaccine Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter vaccine name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="disease"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Disease</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter disease name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="time"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Scheduled Time</FormLabel>
                                                        <FormControl>
                                                            <Input type="datetime-local" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full mt-4 bg-green-700 hover:bg-green-800 col-span-2">
                                                Add Schedule
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

export default ImmunizationPage;
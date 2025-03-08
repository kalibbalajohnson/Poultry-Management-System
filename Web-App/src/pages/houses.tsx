import Navbar2 from "../components/navBar2";
import "chart.js/auto";
import Layout from "@/components/layout";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Farm {
    id: string;
    name: string;
    location: string;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Farm name is required" }),
    location: z.string().min(1, { message: "Farm location is required" }),
});

type FormData = z.infer<typeof formSchema>;

const Houses: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    });

    const uid = user?.uid;
    const queryClient = useQueryClient();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            location: "",
        },
    });

    const { data: farms } = useQuery<Farm[], Error>({
        queryKey: ["farms", uid],
        queryFn: async () => {
            const response = await fetch(
                `http://4.206.218.223:3001/api/v1/farm?uid=${uid}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch farms");
            }
            return response.json();
        },
        enabled: !!uid,
    });

    const farmId = farms?.length ? farms[0].id : null;

    const { data: houses } = useQuery<Farm[], Error>({
        queryKey: ["houses", farmId],
        queryFn: async () => {
            if (!farmId) return [];
            const response = await fetch(
                `http://4.206.218.223:3001/api/v1/farm/house?farmId=${farmId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch farm houses");
            }
            return response.json();
        },
        enabled: !!farmId,
    });

    const onSubmit = async (data: FormData) => {
        if (!farmId) {
            console.error("No farm ID available to add house");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://4.206.218.223:3001/api/v1/farm/house", { ...data, farmId });
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["houses", farmId] });
        } catch (error) {
            console.error("Failed to add house", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex flex-col">
                <Navbar2 />
                <main className="flex-grow px-8 py-5">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Houses</h2>

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                                        Add House
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Poultry Farm</DialogTitle>
                                        <DialogDescription>
                                            Fill in the details below to create a new poultry farm.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <section className="p-4">
                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(onSubmit)}
                                                className="space-y-6"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Farm Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Farm name" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="location"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Location</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Farm location" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" disabled={loading}>
                                                    {loading ? "Submitting..." : "Submit"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </section>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {houses && houses.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {houses.map((house) => (
                                    <div
                                        key={house.id}
                                        className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-white p-4 text-gray-800 shadow"
                                    >
                                        <h3 className="text-lg font-semibold">{house.name}</h3>
                                        <p className="text-sm text-gray-600">{house.location}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4">No Houses Available</p>
                        )}
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default Houses;
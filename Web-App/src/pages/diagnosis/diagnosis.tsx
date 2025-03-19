import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type Diagnosis = {
    id: string;
    imageUrl: string;
    disease: string;
    date: string;
};

const diagnosisSchema = z.object({
    image: z.string().min(1, "Image is required"),
});

const data: Diagnosis[] = [
    { id: "1", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScW0OxfCFzTKWuxBZJbpWgHvZSKJghvAKLhQ&s", disease: "Newcastle Disease", date: "21/06/2025" },
    { id: "2", imageUrl: "https://www.chickens.allotment-garden.org/poultry-diary/wp-content/uploads/2017/12/03/can-you-house-train-chickens/Chicken-Dropping.jpg", disease: "Avian Influenza", date: "21/06/2025" },
    { id: "3", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScW0OxfCFzTKWuxBZJbpWgHvZSKJghvAKLhQ&s", disease: "Salmonella", date: "21/06/2025" },
    { id: "4", imageUrl: "https://www.chickens.allotment-garden.org/poultry-diary/wp-content/uploads/2017/12/03/can-you-house-train-chickens/Chicken-Dropping.jpg", disease: "Fowl Pox", date: "21/06/2025" },
    { id: "5", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScW0OxfCFzTKWuxBZJbpWgHvZSKJghvAKLhQ&s", disease: "Marek's Disease", date: "21/06/2025" },
    { id: "6", imageUrl: "https://www.chickens.allotment-garden.org/poultry-diary/wp-content/uploads/2017/12/03/can-you-house-train-chickens/Chicken-Dropping.jpg", disease: "Coccidiosis", date: "21/06/2025" },
];

function DiagnosisPage() {
    const form = useForm({
        resolver: zodResolver(diagnosisSchema),
        defaultValues: {
            image: '',
        },
    });

    const onSubmit = (values: z.infer<typeof diagnosisSchema>) => {
        console.log("New Castle Detected:", values);
        form.reset();
    };

    return (
        <Layout>
            <Navbar2 />
            <div className="w-full space-y-4">
                <div className="bg-white px-8 py-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Disease Diagnosis</h2>
                        <Dialog>
                            <DialogTrigger>
                                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                                    Add Diagnosis
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Diagnosis</DialogTitle>
                                    <DialogDescription>
                                        Upload an image below to perform diagnosis.
                                    </DialogDescription>
                                </DialogHeader>
                                <section className="p-2">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="image"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Upload Image</FormLabel>
                                                        <FormControl>
                                                            <Input type="file" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                                                Submit
                                            </Button>
                                        </form>
                                    </Form>
                                </section>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="container mx-auto mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.map((entry) => (
                                <div key={entry.id} className="p-4 border rounded-lg">
                                    {/* <img src={entry.imageUrl} alt={entry.disease} className="w-full h-28 object-cover rounded-md mb-3" /> */}
                                    <p className="text-lg font-semibold text-gray-800">{entry.disease}</p>
                                    <p className="text-sm mb-2 text-gray-600">{entry.date}</p>
                                    <a
                                        href={`/diagnosis/${entry.id}`}
                                        className="text-black underline text-sm decoration-black hover:text-blue-600 hover:decoration-blue-600"
                                    >
                                        View Details
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default DiagnosisPage;
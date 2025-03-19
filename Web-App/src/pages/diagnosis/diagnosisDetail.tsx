import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';

const data = [
    { id: "1", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScW0OxfCFzTKWuxBZJbpWgHvZSKJghvAKLhQ&s", disease: "Newcastle Disease", date: "21/06/2025" },
    { id: "2", imageUrl: "https://www.chickens.allotment-garden.org/poultry-diary/wp-content/uploads/2017/12/03/can-you-house-train-chickens/Chicken-Dropping.jpg", disease: "Avian Influenza", date: "21/06/2025" },
    { id: "3", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScW0OxfCFzTKWuxBZJbpWgHvZSKJghvAKLhQ&s", disease: "Salmonella", date: "21/06/2025" },
    { id: "4", imageUrl: "https://www.chickens.allotment-garden.org/poultry-diary/wp-content/uploads/2017/12/03/can-you-house-train-chickens/Chicken-Dropping.jpg", disease: "Fowl Pox", date: "21/06/2025" },
    { id: "5", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScW0OxfCFzTKWuxBZJbpWgHvZSKJghvAKLhQ&s", disease: "Marek's Disease", date: "21/06/2025" },
    { id: "6", imageUrl: "https://www.chickens.allotment-garden.org/poultry-diary/wp-content/uploads/2017/12/03/can-you-house-train-chickens/Chicken-Dropping.jpg", disease: "Coccidiosis", date: "21/06/2025" },
];

interface Diagnosis {
    id: string;
    imageUrl: string;
    disease: string;
    date: string;
}

const DiagnosisDetailPage = () => {
    const { id } = useParams();
    const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

    useEffect(() => {
        const diagnosisData = data.find((entry) => entry.id === id);
        setDiagnosis(diagnosisData || null);
    }, [id]);

    if (!diagnosis) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <Navbar2 />
            <div className="bg-white px-8 py-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">{diagnosis.disease}</h2>
                    <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                        Generate Report
                    </button>
                </div>
                <div className="mt-6 flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-14">
                    <div className="flex flex-col items-center space-y-6">
                        <img
                            src={diagnosis.imageUrl}
                            alt={diagnosis.disease}
                            className="max-w-md max-h-60 rounded-md"
                        />
                        <p className="text-xl font-semibold text-gray-800">{diagnosis.disease}</p>
                        <p className="text-sm text-gray-600">{diagnosis.date}</p>
                    </div>

                    <div className="flex flex-col items-center space-y-6">
                        <img
                            src={diagnosis.imageUrl}
                            alt="Grad-CAM"
                            className="max-w-md max-h-60 object-contain rounded-md border border-gray-300"
                        />
                        <p className="text-sm text-gray-600">Grad-CAM Visualization</p>
                    </div>
                </div>
                <div className="mt-6 space-y-6">
                    <div className="bg-gray-100 p-6 rounded-lg w-full md:w-2/3">
                        <h3 className="text-lg font-medium text-gray-700">Symptoms</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            This disease typically presents with symptoms like fever, cough, and severe fatigue.
                        </p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg w-full md:w-2/3 mt-6">
                        <h3 className="text-lg font-medium text-gray-700">Treatment</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            The treatment plan for this condition includes medication, rest, and hydration.
                        </p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg w-full md:w-2/3 mt-6">
                        <h3 className="text-lg font-medium text-gray-700">Precautions</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Ensure to isolate affected individuals, and take extra care in maintaining hygiene.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DiagnosisDetailPage;
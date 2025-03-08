import { DataTable } from '@/components/dataTable/dataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Stock, columns } from "@/components/dataTable/stockColumns";
import Layout from '@/components/layout';
import Navbar2 from '@/components/navBar2';

const data: Stock[] = [
  {
    id: "728ed52f",
    item: "Maize Bran",
    quantity: 100,
    remainingQuantity: 65,
  },
  {
    id: "728ed52f",
    item: "Maize Bran",
    quantity: 100,
    remainingQuantity: 65,
  },
  {
    id: "728ed52f",
    item: "Maize Bran",
    quantity: 100,
    remainingQuantity: 65,
  },
  {
    id: "728ed52f",
    item: "Maize Bran",
    quantity: 100,
    remainingQuantity: 65,
  },
  {
    id: "728ed52f",
    item: "Maize Bran",
    quantity: 100,
    remainingQuantity: 65,
  },
];

function StockPage() {
  return (
    <Layout>
      <Navbar2 />
      <div className="w-full space-y-4">
        <div className="rounded-lg bg-white px-8 py-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Farm Stock
            </h2>
            <Dialog>
              <DialogTrigger>
                <button className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                  Add Stock
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Daily Farm Record Entry</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to record your daily farm activities.
                  </DialogDescription>
                </DialogHeader>
                <section className="p-4">
                  <form className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="numberOfHens"
                          className="mb-2 block text-sm font-medium text-gray-600"
                        >
                          Number of Hens
                        </label>
                        <input
                          type="number"
                          id="numberOfHens"
                          name="numberOfHens"
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="numberOfEggs"
                          className="mb-2 block text-sm font-medium text-gray-600"
                        >
                          Number of Eggs
                        </label>
                        <input
                          type="number"
                          id="numberOfEggs"
                          name="numberOfEggs"
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="quantityOfFood"
                        className="mb-2 block text-sm font-medium text-gray-600"
                      >
                        Quantity of Food (kg)
                      </label>
                      <input
                        type="number"
                        id="quantityOfFood"
                        name="quantityOfFood"
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full transform rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition duration-200 ease-in-out hover:scale-105 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                    >
                      Add Record
                    </button>
                  </form>
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

export default StockPage;

import Navbar2 from '../components/navBar2';
import Sidebar from '../components/sideBar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

function Stock() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-100 to-green-50 font-sans text-gray-800">
      <Navbar2 />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="container mx-auto flex-grow overflow-y-auto p-6">
          <Dialog>
            <DialogTrigger>
              <button className="mb-4 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-green-800">
                Add Stock
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Daily Farm Record Entry</DialogTitle>
                <DialogDescription>
                  Fill in the details below to record your daily farm
                  activities.
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

          <section className="rounded-lg bg-white p-8 shadow">
            <h2 className="mb-6 border-b border-green-200 pb-4 text-2xl font-semibold text-green-700">
              Farm Stock
            </h2>
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Item
                  </th>
                  <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Remaining Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="transition duration-150 hover:bg-gray-50">
                  <td className="border-b px-4 py-3 text-gray-600">1200</td>
                  <td className="border-b px-4 py-3 text-gray-600">1000</td>
                  <td className="border-b px-4 py-3 text-gray-600">70</td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Stock;

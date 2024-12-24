import Navbar2 from "../components/navBar2";
import Sidebar from "../components/sideBar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function Stock() {

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-100 to-green-50 text-gray-800 font-sans">
      <Navbar2 />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-6 container mx-auto overflow-y-auto">
          <Dialog>
            <DialogTrigger>
              <button className="bg-green-700 text-sm font-semibold rounded-full text-white px-4 py-2 mb-4 hover:bg-green-800 transition duration-200">
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
                        className="block text-sm font-medium text-gray-600 mb-2"
                      >
                        Number of Hens
                      </label>
                      <input
                        type="number"
                        id="numberOfHens"
                        name="numberOfHens"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="numberOfEggs"
                        className="block text-sm font-medium text-gray-600 mb-2"
                      >
                        Number of Eggs
                      </label>
                      <input
                        type="number"
                        id="numberOfEggs"
                        name="numberOfEggs"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="quantityOfFood"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Quantity of Food (kg)
                    </label>
                    <input
                      type="number"
                      id="quantityOfFood"
                      name="quantityOfFood"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105"
                  >
                    Add Record
                  </button>
                </form>
              </section>
            </DialogContent>
          </Dialog>

          <section className="bg-white shadow rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-green-700 border-b pb-4 border-green-200">
              Farm Stock
            </h2>
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Item
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Remaining Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 transition duration-150">
                  <td className="py-3 px-4 border-b text-gray-600">1200</td>
                  <td className="py-3 px-4 border-b text-gray-600">1000</td>
                  <td className="py-3 px-4 border-b text-gray-600">70</td>
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

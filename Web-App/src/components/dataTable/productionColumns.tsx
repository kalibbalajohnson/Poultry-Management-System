"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Filter } from "lucide-react" // Import Filter icon
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export type Production = {
  houseBatchId: string
  date: Date
  metricName: string
  metricValue: number
}

export const columns: ColumnDef<Production>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "houseBatchId",
    header: "Batch ID",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: "metricName",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <span>Metric Name</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <Input
                  type="text"
                  placeholder="Filter by metric..."
                  value={(column.getFilterValue() as string) ?? ""}
                  onChange={(e) => column.setFilterValue(e.target.value)}
                  className="w-full"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return row.getValue(id).toLowerCase().includes(value.toLowerCase())
    },
    enableSorting: false, // Disable sorting for this column
  },
  {
    accessorKey: "metricValue",
    header: "Metric Value",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const production = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(production.houseBatchId)}
            >
              Copy Batch ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete Production</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
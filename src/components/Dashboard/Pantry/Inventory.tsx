import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PantryItem } from "@/types/pantry";
import axios from "axios";
import { AlertTriangle, Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import EditItemForm from "./EditItemForm";

const Inventory = ({
  pantryItems,
  fetchPantryItems,
}: {
  pantryItems: PantryItem[];
  fetchPantryItems: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<PantryItem[]>([]);
  const [filter, setFilter] = useState("");
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (filter == "Low Stock") {
      setFilteredItems(() => {
        return pantryItems.filter((item) => {
          const q = searchTerm.toLowerCase();
          const itemName = item.itemName?.toLowerCase();
          const category = item.category?.toLowerCase();
          return (
            (item.threshold > item.quantity) && (itemName?.includes(q) ||
            category?.includes(q))
          );
        });
      });
    } else if (filter == "Expiring Soon") {
      setFilteredItems(() => {
        return pantryItems.filter((item) => {
          const q = searchTerm.toLowerCase();
          const itemName = item.itemName?.toLowerCase();
          const category = item.category?.toLowerCase();
          return (
            (new Date(item.expiryDate).getTime() - Date.now() <
              1000 * 60 * 60 * 24 * 5) &&
              (itemName?.includes(q) ||
            category?.includes(q))
          );
        });
      });
    } else if (filter == "Critical Stock") {
      setFilteredItems(() => {
        return pantryItems.filter((item) => {
          const q = searchTerm.toLowerCase();
          const itemName = item.itemName?.toLowerCase();
          const category = item.category?.toLowerCase();
          return (
            (item.quantity <= 0) && (itemName?.includes(q) ||
            category?.includes(q))
          );
        });
      });
    } else {
      setFilteredItems(() => {
        return pantryItems.filter((item) => {
          const q = searchTerm.toLowerCase();
          const itemName = item.itemName?.toLowerCase();
          const category = item.category?.toLowerCase();
          return itemName?.includes(q) || category?.includes(q);
        });
      });
    }
  }, [searchTerm, pantryItems, filter]);

  const onClose = () => {
    setEditingItem(null);
    setIsOpen(false);
  };
  const onDeleteItem = async (id: string) => {
    try {
      const response = await axios.delete(`/api/pantry/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setFilteredItems(() => filteredItems.filter((item) => item._id != id));
        toast({
          title: "Item successfully deleted",
          variant: "default",
        });
      } else {
        toast({
          title: response.data.message || "Error while deleting item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error while deleting item",
        variant: "destructive",
      });
    }
  };

  return (
    <section>
      {/* for editing items  */}
      {isOpen && (
          <EditItemForm
            isOpen={isOpen}
            onClose={onClose}
            fetchPantryItems={fetchPantryItems}
            editingItem={editingItem}
          />
        )}
      {/* search bar for seraching items */}
      <div className="grid grid-cols-6 md:grid-cols-10 gap-4 px-3 py-4 my-2 bg-white drop-shadow-lg rounded-lg">
        <Input
          className="col-span-4 md:col-span-8 "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search for items`}
        />
        {/* <input type="text" placeholder='Search for items' className='col-span-7'/> */}

        <select
          onChange={(e) => setFilter(e.target.value)}
          className="py-1 px-2 border rounded-md shadow col-span-2 md:col-span-1"
        >
          <option value="" onClick={() => setFilter("")}>
            All
          </option>
          {["Low Stock", "Expiring Soon", "Critical Stock"].map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <Button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-700 rounded-md col-span-6 md:col-span-1"
        >
          + Add Item
        </Button>
      </div>

      <section className="border border-gray-200 mt-8 rounded-lg overflow-scroll">
        <div className="grid grid-cols-6 p-3 bg-gray-100 py-4 border-b border-gray-300 min-w-[600px]">
          {[
            "Item Name",
            "Category",
            "Quantity",
            "Threshold",
            "Expiry",
            "Actions",
          ].map((colmn) => {
            return (
              <p key={colmn} className="font-semibold text-[13px] opacity-60">
                {colmn.toUpperCase()}
              </p>
            );
          })}
        </div>
        {filteredItems.map((item, index) => {
          return (
            <div
              className="grid text-[14px] min-w-[600px] font-semibold grid-cols-6 p-3 hover:bg-gray-100 bg-white py-4 border-b border-gray-300"
              key={item._id}
            >
              <p>
                {item.itemName}
                <span className="text-orange-500 text-[13px] flex gap-1">
                  {new Date(item.expiryDate).getTime() - Date.now() <
                    1000 * 60 * 60 * 24 * 5 && (
                    <>
                      <AlertTriangle className="h-4 w-4 mt-[1px]" /> Expiring
                      Soon
                    </>
                  )}
                </span>
              </p>
              <p>{item.category}</p>
              <p>
                {item.quantity} {item.unit}
              </p>
              <p>
                {item.threshold} {item.unit}
              </p>
              <p>{new Date(item.expiryDate).toLocaleDateString()}</p>
              <div className="flex gap-1">
                <Edit
                  onClick={() => {
                    setIsOpen(true), setEditingItem(item);
                  }}
                  className="h-7 w-7 rounded-md p-1 cursor-pointer hover:scale-110 text-gray-700 bg-gray-200"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Trash2 className="h-7 w-7 rounded-md p-1 cursor-pointer hover:scale-110 text-red-500 bg-gray-200" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] font-sans">
                    <DialogHeader>
                      <DialogTitle className="text-red-500 text-center pb-2 text-xl">
                        Delete Item
                      </DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this item?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-y-2">
                      <DialogClose asChild>
                        <Button variant="outline" className="text-lg">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        className="text-lg"
                        onClick={() => onDeleteItem(item._id)}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </section>
    </section>
  );
};

export default Inventory;

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PantryItem } from "@/types/pantry";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { date, z } from "zod";

const PantryItemSchema = z.object({
  itemName: z.string().min(1, "required"),
  category: z.string().min(1, "required"),
  quantity: z.coerce.number().min(0),
  expiryDate: z.string(),
  threshold: z.coerce.number().min(1, "threshold should be more than 0"),
  unit: z.string().min(1, "required"),
});

const EditItemForm = ({
  isOpen,
  onClose,
  editingItem,
  fetchPantryItems,
}: {
  isOpen: boolean;
  fetchPantryItems: () => void;
  onClose: () => void;
  editingItem?: PantryItem | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (editingItem) {
    editingItem.expiryDate = new Date(editingItem.expiryDate)
      .toISOString()
      .split("T")[0];
  }

  const form = useForm<any>({
    resolver: zodResolver(PantryItemSchema),
    defaultValues: {
      itemName: editingItem?.itemName || "",
      category: editingItem?.category || "",
      expiryDate:
        editingItem?.expiryDate || new Date().toISOString().split("T")[0],
      quantity: editingItem?.quantity || 0,
      threshold: editingItem?.threshold || 0,
      unit: editingItem?.unit || "",
    },
  });
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onSubmit = async (value: any) => {
    setIsLoading(true);
    try {
      if (editingItem) {
        const response = await axios.put(
          `/api/pantry/${editingItem._id}`,
          { ...value },
          { withCredentials: true }
        );
        if (response.data.success) {
          toast({
            description: "Item Successfully updated",
            variant: "default",
          });
          onClose();
          fetchPantryItems();
        }
      } else {
        const response = await axios.post(
          "/api/pantry",
          { ...value },
          { withCredentials: true }
        );
        if (response.data.success) {
          toast({
            description: "Item Successfully added",
            variant: "default",
          });
          onClose();
          fetchPantryItems();
        }
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: error.response.data.message || "Unexpected error occured",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white relative  rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        <button className="absolute right-4 top-3" onClick={onClose}>
          <X className="w-7 h-7 text-white" />
        </button>
        <h3 className="text-bold text-2xl text-white p-2 md:p-4 bg-emerald-400">
          {editingItem ? "Edit Item" : "Add New Item"}
        </h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-4 p-2 md:p-4"
          >
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Rice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Grains" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="flex justify-center items-center bg-emerald-600 text-white px-4 py-2 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{editingItem ? "Update Item" : "Add Item"}</span>
                )}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditItemForm;

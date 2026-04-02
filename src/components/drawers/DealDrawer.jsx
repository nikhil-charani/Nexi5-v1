import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "../../hooks/useAppContext";
const dealSchema = z.object({
  title: z.string().min(2, "Title is required"),
  clientName: z.string().min(2, "Client name is required"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  stage: z.enum(["Discovery", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]),
  expectedCloseDate: z.string().min(1, "Date is required")
});
function DealDrawer({ isOpen, onClose, dealToEdit }) {
  const { addDeal, updateDeal, currentUser } = useAppContext();
  const isEditing = !!dealToEdit;
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(dealSchema),
    defaultValues: { title: "", clientName: "", amount: 0, stage: "Discovery", expectedCloseDate: "" }
  });
  useEffect(() => {
    if (dealToEdit) {
      reset({
        title: dealToEdit.title,
        clientName: dealToEdit.clientName,
        amount: dealToEdit.amount,
        stage: dealToEdit.stage,
        expectedCloseDate: dealToEdit.expectedCloseDate
      });
    } else {
      reset({ title: "", clientName: "", amount: 0, stage: "Discovery", expectedCloseDate: "" });
    }
  }, [dealToEdit, isOpen, reset]);
  const onSubmit = (data) => {
    if (isEditing && dealToEdit) {
      updateDeal(dealToEdit.id, data);
    } else {
      addDeal({ ...data, owner: currentUser?.name || "Unknown User" });
    }
    onClose();
  };
  return <AnimatePresence>
      {isOpen && <>
          <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
  />

          <motion.div
    initial={{ x: "100%" }}
    animate={{ x: 0 }}
    exit={{ x: "100%" }}
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
    className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-950 z-50 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
  >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {isEditing ? "Edit Deal" : "Add Deal"}
              </h2>
              <button onClick={onClose} className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="deal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deal Title</label>
                  <input {...register("title")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary" placeholder="e.g. ERP Expansion" />
                  {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name / Company</label>
                  <input {...register("clientName")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary" />
                  {errors.clientName && <p className="mt-1 text-xs text-rose-500">{errors.clientName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount ($)</label>
                  <input type="number" {...register("amount")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary" />
                  {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Close Date</label>
                  <input type="date" {...register("expectedCloseDate")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary" />
                  {errors.expectedCloseDate && <p className="mt-1 text-xs text-rose-500">{errors.expectedCloseDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stage</label>
                  <select {...register("stage")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary">
                    <option value="Discovery">Discovery</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm font-medium border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950">
                Cancel
              </button>
              <button type="submit" form="deal-form" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary">
                {isEditing ? "Save Changes" : "Add Deal"}
              </button>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}
export {
  DealDrawer as default
};

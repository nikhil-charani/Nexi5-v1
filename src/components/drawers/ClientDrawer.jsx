import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "../../hooks/useAppContext";
const clientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(2, "Company is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone is required"),
  industry: z.string().min(2, "Industry is required")
});
function ClientDrawer({ isOpen, onClose, clientToEdit }) {
  const { addClient } = useAppContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", company: "", email: "", phone: "", industry: "" }
  });
  useEffect(() => {
    if (clientToEdit) {
      reset({
        name: clientToEdit.name,
        company: clientToEdit.company,
        email: clientToEdit.email,
        phone: clientToEdit.phone,
        industry: clientToEdit.industry
      });
    } else {
      reset({ name: "", company: "", email: "", phone: "", industry: "" });
    }
  }, [clientToEdit, isOpen, reset]);
  const onSubmit = (data) => {
    addClient(data);
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
                {clientToEdit ? "View Client" : "Add Client"}
              </h2>
              <button onClick={onClose} className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="client-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input {...register("name")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary" />
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                  <input {...register("company")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary" />
                  {errors.company && <p className="mt-1 text-xs text-rose-500">{errors.company.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input {...register("email")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary" />
                  {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input {...register("phone")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary" />
                  {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                  <input {...register("industry")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none border-slate-300 dark:border-slate-700 focus:border-primary" />
                  {errors.industry && <p className="mt-1 text-xs text-rose-500">{errors.industry.message}</p>}
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm font-medium border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950">
                Cancel
              </button>
              <button type="submit" form="client-form" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary">
                {clientToEdit ? "Add as New (Mock)" : "Add Client"}
              </button>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}
export {
  ClientDrawer as default
};

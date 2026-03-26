import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "../../hooks/useAppContext";
const candidateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  position: z.string().min(2, "Position is required"),
  experience: z.string().min(1, "Experience is required"),
  status: z.enum(["New", "Interviewing", "Offered", "Rejected"])
});
function CandidateDrawer({ isOpen, onClose, candidateToEdit }) {
  const { addCandidate, updateCandidate } = useAppContext();
  const isEditing = !!candidateToEdit;
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      position: "",
      experience: "",
      status: "New"
    }
  });
  useEffect(() => {
    if (candidateToEdit) {
      reset({
        name: candidateToEdit.name,
        position: candidateToEdit.position,
        experience: candidateToEdit.experience,
        status: candidateToEdit.status
      });
    } else {
      reset({
        name: "",
        position: "",
        experience: "",
        status: "New"
      });
    }
  }, [candidateToEdit, isOpen, reset]);
  const onSubmit = (data) => {
    if (isEditing && candidateToEdit) {
      updateCandidate(candidateToEdit.id, data);
    } else {
      addCandidate(data);
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
                {isEditing ? "Edit Candidate" : "Add Candidate"}
              </h2>
              <button
    onClick={onClose}
    className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
  >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="candidate-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
    {...register("name")}
    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
    placeholder="e.g. John Doe"
  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Position</label>
                  <input
    {...register("position")}
    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
    placeholder="e.g. Frontend Engineer"
  />
                  {errors.position && <p className="mt-1 text-xs text-rose-500">{errors.position.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience</label>
                  <input
    {...register("experience")}
    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
    placeholder="e.g. 3 Years"
  />
                  {errors.experience && <p className="mt-1 text-xs text-rose-500">{errors.experience.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
    {...register("status")}
    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
  >
                    <option value="New">New</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
              <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
  >
                Cancel
              </button>
              <button
    type="submit"
    form="candidate-form"
    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
  >
                {isEditing ? "Save Changes" : "Add Candidate"}
              </button>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}
export {
  CandidateDrawer as default
};

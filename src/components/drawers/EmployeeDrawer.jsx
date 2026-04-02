import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, CheckCircle2, ShieldCheck, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "../../hooks/useAppContext";
import { toast } from "sonner";

const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  department: z.string().min(2, "Department is required"),
  designation: z.string().min(2, "Designation is required"),
  manager: z.string().min(2, "Manager is required"),
  joiningDate: z.string().min(2, "Joining Date is required"),
  status: z.enum(["Active", "On Leave", "Suspended", "Resigned"]),
  company: z.string().min(2, "Company is required"),
  basicSalary: z.number().min(0).optional(),
  allowances: z.number().min(0).optional(),
  workMode: z.enum(["Onsite", "Remote", "Hybrid"]).default("Onsite"),
  employeeType: z.enum(["Full-time", "Intern"]).default("Full-time"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export default function EmployeeDrawer({ isOpen, onClose, employeeToEdit, title, isProfileView = false }) {
  const { addEmployee, updateEmployee } = useAppContext();
  const isEditing = !!employeeToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      designation: "",
      manager: "",
      joiningDate: new Date().toISOString().split("T")[0],
      status: "Active",
      company: "Nexi5",
      basicSalary: 60000,
      allowances: 10000,
      workMode: "Onsite",
      employeeType: "Full-time",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (employeeToEdit) {
      reset({
        name: employeeToEdit.name,
        email: employeeToEdit.email || "",
        department: employeeToEdit.department,
        designation: employeeToEdit.designation,
        manager: employeeToEdit.manager,
        joiningDate: employeeToEdit.joiningDate,
        status: employeeToEdit.status,
        company: employeeToEdit.company || "Nexi5",
        basicSalary: employeeToEdit.basicSalary || 0,
        allowances: employeeToEdit.allowances || 0,
        workMode: employeeToEdit.workMode || "Onsite",
        employeeType: employeeToEdit.employeeType || "Full-time",
        phone: employeeToEdit.phone || "",
        address: employeeToEdit.address || "",
      });
    } else {
      reset({
        name: "",
        email: "",
        department: "",
        designation: "",
        manager: "",
        joiningDate: new Date().toISOString().split("T")[0],
        status: "Active",
        company: "Nexi5",
        basicSalary: 60000,
        allowances: 10000,
        workMode: "Onsite",
        employeeType: "Full-time",
        phone: "",
        address: "",
      });
    }
  }, [employeeToEdit, isOpen, reset]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEmployee, setCreatedEmployee] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const handleClose = () => {
    setCreatedEmployee(null);
    onClose();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let result;
      if (isEditing && employeeToEdit) {
        toast.loading("Updating employee...", { id: "emp-action" });
        result = await updateEmployee(employeeToEdit.uid || employeeToEdit.id, data);
      } else {
        toast.loading("Adding employee...", { id: "emp-action" });
        result = await addEmployee(data);
      }

      if (result?.success) {
        if (!isEditing) {
          toast.success("Employee added successfully!", { id: "emp-action" });
          setCreatedEmployee({
            name: data.name,
            email: data.email,
            employeeId: result.data?.employeeId || result.employeeId,
            tempPassword: result.data?.tempPassword || result.tempPassword
          });
        } else {
          toast.success("Employee updated successfully!", { id: "emp-action" });
          onClose();
        }
      } else {
        toast.error(result?.error || "Something went wrong", { id: "emp-action" });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: "emp-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-950 z-50 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {createdEmployee ? "Employee Created" : title || (isEditing ? "Edit Employee" : "Add Employee")}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {createdEmployee ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2 py-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mb-2">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Success!</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 px-4">
                      The credentials have been sent to their email. You can also copy them manually below.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-white dark:border-slate-800">
                      <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 spacing-wider">Full Name</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{createdEmployee.name}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <ShieldCheck size={18} className="text-slate-400" />
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Employee ID</p>
                            <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{createdEmployee.employeeId}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => copyToClipboard(createdEmployee.employeeId, 'id')} className="p-2 text-slate-400 hover:text-cyan-600 transition-colors">
                          {copiedField === 'id' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-slate-400" />
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Login Email</p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{createdEmployee.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between group bg-white dark:bg-slate-900 p-3 rounded-xl border border-dashed border-cyan-200 dark:border-cyan-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 font-bold">123</div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-cyan-500">Temporary Password</p>
                            <p className="text-sm font-mono font-black text-slate-900 dark:text-white">{createdEmployee.tempPassword}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => copyToClipboard(createdEmployee.tempPassword, 'pw')} className="bg-cyan-600 p-2 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-sm">
                          {copiedField === 'pw' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl">
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                      <strong>Important:</strong> Please advise the employee to change this password immediately after their first successful login for security.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Done & Close
                  </button>
                </motion.div>
              ) : (
                <form id="employee-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      {...register("name")}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                      placeholder="e.g. Jane Doe"
                    />
                    {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                  </div>

                  {isProfileView && (
                    <div className="flex items-center justify-between group bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={18} className="text-slate-400" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Employee ID</p>
                          <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{employeeToEdit?.employeeId || "N/A"}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => copyToClipboard(employeeToEdit?.employeeId || "", 'id')} className="p-2 text-slate-400 hover:text-cyan-600 transition-colors">
                        {copiedField === 'id' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      {...register("email")}
                      disabled={isEditing}
                      className={`w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all ${isEditing ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
                      placeholder="e.g. jane.doe@company.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
                    <p className="mt-1 text-xs text-slate-400">
                      {isEditing ? "Corporate email cannot be changed." : "Login credentials will be sent to this email."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                    <input
                      {...register("company")}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                      placeholder="e.g. Nexi5, Wipro, Amazon"
                    />
                    {errors.company && <p className="mt-1 text-xs text-rose-500">{errors.company.message}</p>}
                    <p className="mt-1 text-xs text-slate-400">This determines the prefix for ID and temporary password (e.g., WIP, AMZ).</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                    <input
                      {...register("department")}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                      placeholder="e.g. Engineering"
                    />
                    {errors.department && <p className="mt-1 text-xs text-rose-500">{errors.department.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input
                      {...register("phone")}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                      placeholder="e.g. +91 98765 43210"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location / Address</label>
                    <input
                      {...register("address")}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                      placeholder="e.g. Mumbai, India"
                    />
                    {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address.message}</p>}
                  </div>

                  {!isProfileView && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                        <input
                          {...register("department")}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                          placeholder="e.g. Engineering"
                        />
                        {errors.department && <p className="mt-1 text-xs text-rose-500">{errors.department.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                        <input
                          {...register("designation")}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                          placeholder="e.g. Frontend Developer"
                        />
                        {errors.designation && <p className="mt-1 text-xs text-rose-500">{errors.designation.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Manager</label>
                        <input
                          {...register("manager")}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                          placeholder="e.g. John Smith"
                        />
                        {errors.manager && <p className="mt-1 text-xs text-rose-500">{errors.manager.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Joining Date</label>
                          <input
                            type="date"
                            {...register("joiningDate")}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                          />
                          {errors.joiningDate && <p className="mt-1 text-xs text-rose-500">{errors.joiningDate.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                          <select
                            {...register("status")}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all font-bold"
                          >
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Resigned">Resigned</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Employment Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Full-time", "Intern"].map((type) => (
                            <label key={type} className="relative flex items-center justify-center">
                              <input
                                type="radio"
                                {...register("employeeType")}
                                value={type}
                                className="peer sr-only"
                              />
                              <div className="w-full py-2.5 text-[11px] font-black uppercase tracking-widest text-center rounded-xl border border-slate-200 peer-checked:bg-[#0f4184] peer-checked:text-white peer-checked:border-transparent transition-all cursor-pointer hover:bg-slate-50">
                                {type}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Working Mode</label>
                        <div className="grid grid-cols-3 gap-3">
                          {["Onsite", "Remote", "Hybrid"].map((mode) => (
                            <label key={mode} className="relative flex items-center justify-center">
                              <input
                                type="radio"
                                {...register("workMode")}
                                value={mode}
                                className="peer sr-only"
                              />
                              <div className="w-full py-2.5 text-[11px] font-black uppercase tracking-widest text-center rounded-xl border border-slate-200 peer-checked:bg-[#0f4184] peer-checked:text-white peer-checked:border-transparent transition-all cursor-pointer hover:bg-slate-50">
                                {mode}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Payroll Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Basic Salary (₹)</label>
                            <input
                              type="number"
                              {...register("basicSalary", { valueAsNumber: true })}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                              placeholder="e.g. 60000"
                            />
                            {errors.basicSalary && <p className="mt-1 text-xs text-rose-500">{errors.basicSalary.message}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Allowances (₹)</label>
                            <input
                              type="number"
                              {...register("allowances", { valueAsNumber: true })}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-slate-900 dark:text-white sm:text-sm outline-none transition-all"
                              placeholder="e.g. 10000"
                            />
                            {errors.allowances && <p className="mt-1 text-xs text-rose-500">{errors.allowances.message}</p>}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>

            {/* Footer */}
            {!createdEmployee && (
              <div className="px-6 pt-4 pb-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-end gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="employee-form"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? "Processing..." : title || (isEditing ? "Save Changes" : "Add Employee")}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

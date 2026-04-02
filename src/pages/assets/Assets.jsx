import { useState, useMemo, Fragment, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Laptop, Search, Plus, Check, X, MoreVertical, Monitor, Smartphone, Keyboard, MouseOff, Tablet, CreditCard, Headphones, Package, AlertCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuItem } from "../../components/assets/dropdown";
import { useAppContext } from "../../hooks/useAppContext";
import {
  getAssets,
  getMyAssets,
  createAssets,
  updateAsset,
  deleteAsset,
  getAllRequests,
  getMyRequests,
  createRequest,
  updateRequestStatus,
  lookupEmployee
} from "../../api/assetApi";

const ASSET_TYPES = ["Laptop", "Desktop", "Mobile Phone", "Tablet", "Keyboard / Mouse", "Headset", "ID Card", "Access Card", "Charger", "Other"];
const STATUS_COLORS = {
  "Assigned": { bg: "bg-[#22C1DC]/10", text: "text-[#0EA5B7]", dot: "bg-[#22C1DC]" },
  "Returned": { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  "Damaged": { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
  "Repairing": { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
  "Lost": { bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-600" },
};

const REQUEST_STATUS_COLORS = {
  "Pending": { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
  "In Review": { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" },
  "Approved": { bg: "bg-[#22C1DC]/10", text: "text-[#0EA5B7]", dot: "bg-[#22C1DC]" },
  "Rejected": { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
  "Resolved": { bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-500" },
};

// Mock data removed. Data is now fetched from the backend.

function Assets() {
  const { currentUser, userRole } = useAppContext();
  const token = currentUser?.token;
  const [activeTab, setActiveTab] = useState("Assets"); // "Assets" | "Requests"
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // State for data
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);

  const isHRorAdmin = ["admin", "hr head", "hr recruiter", "hr accountant"].includes(userRole?.toLowerCase());

  useEffect(() => {
    if (token) {
      console.log(`[DEBUG] token detected, calling loadData...`);
      loadData();
    } else {
      console.log(`[DEBUG] No token found in context yet.`);
    }
  }, [token, userRole]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log(`[DEBUG] Loading data for role: ${userRole}`);
      if (isHRorAdmin) {
        const [assetsData, requestsData] = await Promise.all([
          getAssets(token),
          getAllRequests(token)
        ]);
        console.log(`[DEBUG] Assets Loaded (${assetsData.length}):`, assetsData);
        setAssets(assetsData);
        setRequests(requestsData);
      } else {
        const [myAssets, myRequests] = await Promise.all([
          getMyAssets(token),
          getMyRequests(token)
        ]);
        console.log(`[DEBUG] My Assets Loaded (${myAssets.length}):`, myAssets);
        setAssets(myAssets);
        setRequests(myRequests);
      }
    } catch (error) {
      console.error("[ERROR] loadData failed:", error);
      toast.error("Failed to sync assets data");
    } finally {
      setIsLoading(false);
    }
  };

  // Modals state
  const [isAssetModalOpen, setAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null); // Asset being edited
  const [isRequestFormOpen, setRequestFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (employeeId) => {
    setExpandedGroups(prev => ({ ...prev, [employeeId]: !prev[employeeId] }));
  };


  const getEmptyAssetBlock = () => ({ id: Date.now().toString() + Math.random(), name: "", type: "Laptop", brand: "", model: "", serialNumber: "", comments: "", status: "Assigned" });
  const [assetForm, setAssetForm] = useState({ employeeId: "", employeeName: "", department: "", assets: [getEmptyAssetBlock()] });

  const [requestForm, setRequestForm] = useState({
    requestType: "New Asset Request",
    assetType: "Laptop",
    assetName: "",
    priority: "Medium",
    reason: ""
  });

  const handleEmployeeIdChange = async (e) => {
    const val = e.target.value.toUpperCase();
    setAssetForm(prev => ({
      ...prev,
      employeeId: val
    }));

    // Trigger lookup if ID looks complete (e.g., EMP-XXXXX)
    if (val.length >= 6) {
      try {
        const data = await lookupEmployee(val, token);
        setAssetForm(prev => ({
          ...prev,
          employeeName: data.name,
          department: data.department
        }));
        toast.success(`Employee Found: ${data.name}`);
      } catch (err) {
        // Silently wait for more input or fail gracefully
        setAssetForm(prev => ({
          ...prev,
          employeeName: "",
          department: ""
        }));
      }
    }
  };

  const handleEmployeeNameChange = (e) => {
    setAssetForm(prev => ({
      ...prev,
      employeeName: e.target.value
    }));
  };

  const handleEditEmployeeIdChange = async (e) => {
    const val = e.target.value.toUpperCase();
    setEditingAsset(prev => ({
      ...prev,
      employeeId: val
    }));

    // Trigger lookup if ID looks complete (e.g., EMP-XXXXX)
    if (val.length >= 6) {
      try {
        const data = await lookupEmployee(val, token);
        setEditingAsset(prev => ({
          ...prev,
          employeeName: data.name,
          department: data.department
        }));
        toast.success(`Employee Found: ${data.name}`);
      } catch (err) {
        // Silently wait for more input or fail gracefully
        setEditingAsset(prev => ({
          ...prev,
          employeeName: "",
          department: ""
        }));
      }
    }
  };

  const handleAssetFieldChange = (assetId, field, value) => {
    setAssetForm(prev => ({
      ...prev,
      assets: prev.assets.map(a => a.id === assetId ? { ...a, [field]: value } : a)
    }));
  };

  const addAssetBlock = () => {
    setAssetForm(prev => ({
      ...prev,
      assets: [...prev.assets, getEmptyAssetBlock()]
    }));
  };

  const removeAssetBlock = (assetId) => {
    setAssetForm(prev => ({
      ...prev,
      assets: prev.assets.filter(a => a.id !== assetId)
    }));
  };

  // Filtered Assets
  const visibleAssets = useMemo(() => {
    if (!search) return assets;
    return assets.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [assets, search]);

  const groupedAssets = useMemo(() => {
    const groups = {};
    visibleAssets.forEach(asset => {
      const key = asset.employeeId || asset.id;
      if (!groups[key]) groups[key] = [];
      groups[key].push(asset);
    });
    return Object.values(groups);
  }, [visibleAssets]);

  // Filtered Requests
  const visibleRequests = useMemo(() => {
    if (!search) return requests;
    return requests.filter(r =>
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.requestType.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [requests, search]);

  const stats = {
    total: assets.length,
    assigned: assets.filter(a => a.status === "Assigned").length,
    pendingReq: requests.filter(r => r.status === "Pending").length,
    damaged: assets.filter(a => a.status === "Damaged").length,
    returned: assets.filter(a => a.status === "Returned").length,
  };

  const handleAssetSubmit = async () => {
    if (!assetForm.employeeId.trim() || !assetForm.employeeName.trim()) {
      toast.error("Employee ID and Name are required.");
      return;
    }

    const { employeeId, employeeName, department, assets: formAssets } = assetForm;
    const payloadAssets = [];
    const usedSerials = new Set();

    // Validate each asset
    for (const a of formAssets) {
      if (!a.type || !a.serialNumber.trim()) {
        toast.error("Asset Type & Serial Number are required for all assets.");
        return;
      }
      if (usedSerials.has(a.serialNumber)) {
        toast.error(`Duplicate Serial Number found in the form: ${a.serialNumber}`);
        return;
      }
      usedSerials.add(a.serialNumber);

      if (a.type === "Other" && (!a.comments || !a.comments.trim())) {
        toast.error("Please provide comments for 'Other' asset types.");
        return;
      }

      const generatedName = a.name.trim() || `${a.brand || 'Unbranded'} ${a.type}`;

      payloadAssets.push({
        type: a.type,
        brand: a.brand || "",
        model: a.model || "",
        serialNumber: a.serialNumber,
        employeeName: employeeName || "Unknown",
        employeeId: employeeId,
        department: department || "N/A",
        status: a.status,
        condition: "Good"
      });
    }

    try {
      await createAssets(payloadAssets, token);
      toast.success(`${formAssets.length} asset(s) successfully assigned.`);
      setAssetModalOpen(false);
      setAssetForm({ employeeId: "", employeeName: "", department: "", assets: [getEmptyAssetBlock()] });
      loadData(); // Refresh list
    } catch (error) {
      toast.error(error.message || "Failed to save assets");
    }
  };

  const resolveRequest = async (id, newStatus, remark) => {
    try {
      await updateRequestStatus(id, { status: newStatus, remarks: remark }, token);
      toast.success(`Request marked as ${newStatus}`);
      setSelectedRequest(null);
      loadData();
    } catch (error) {
      toast.error(error.message || "Failed to update request");
    }
  };

  const handleMarkReturned = async (assetId) => {
    try {
      await updateAsset(assetId, { status: "Returned", employeeId: null, employeeName: null }, token);
      toast.success("Asset marked as Returned.");
      loadData();
    } catch (error) {
      toast.error(error.message || "Failed to update asset status.");
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm("Are you sure you want to permanently delete this asset?")) return;
    try {
      await deleteAsset(assetId, token);
      toast.success("Asset deleted successfully.");
      loadData();
    } catch (error) {
      toast.error(error.message || "Failed to delete asset.");
    }
  };

  const openEditModal = (asset) => {
    setEditingAsset({ ...asset });
  };

  const handleEditSubmit = async () => {
    if (!editingAsset) return;
    try {
      // Auto-update status if assigned
      const isAssigned = editingAsset.employeeId && editingAsset.employeeName;
      const newStatus = isAssigned && (editingAsset.status === "Returned" || !editingAsset.status)
        ? "Assigned"
        : editingAsset.status;

      await updateAsset(editingAsset.id, {
        type: editingAsset.type,
        brand: editingAsset.brand,
        serialNumber: editingAsset.serialNumber,
        status: newStatus,
        condition: editingAsset.condition,
        name: editingAsset.brand ? `${editingAsset.brand} ${editingAsset.type}` : editingAsset.type,
        employeeId: editingAsset.employeeId || null,
        employeeName: editingAsset.employeeName || null,
        department: editingAsset.department || null
      }, token);
      toast.success("Asset updated successfully.");
      setEditingAsset(null);
      loadData();
    } catch (error) {
      toast.error(error.message || "Failed to update asset.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return "—"; }
  };

  const handleRequestSubmit = async () => {
    if (!requestForm.assetName.trim() || !requestForm.reason.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        ...requestForm,
        employeeId: currentUser?.employeeId || currentUser?.uid || "EMP-Unknown",
        employeeName: currentUser?.name || currentUser?.displayName || "Unknown",
        department: currentUser?.department || "General"
      };
      await createRequest(payload, token);
      toast.success("Request submitted successfully!");
      setRequestFormOpen(false);
      setRequestForm({
        requestType: "New Asset Request",
        assetType: "Laptop",
        assetName: "",
        priority: "Medium",
        reason: ""
      });
      loadData();
    } catch (error) {
      toast.error(error.message || "Failed to submit request");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <div className="flex items-center gap-3 mb-1 text-primary">
            <Package size={26} className="shrink-0" />
            <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Company Assets</h1>
          </div>
          <p className="text-textSecondary text-sm font-medium">Manage organization assets and handle employee requests</p>
        </div>
        <div className="flex items-center gap-3">
          {isHRorAdmin && (
            <button
              onClick={() => setAssetModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-gradient-to-r from-[#22C1DC] to-[#1E3A8A] hover:opacity-90 transition-all shadow-sm"
            >
              <Plus size={18} /> Add Asset
            </button>
          )}
          {!isHRorAdmin && (
            <button
              onClick={() => { setActiveTab("Requests"); setRequestFormOpen(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-slate-600 bg-white border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              <AlertCircle size={18} /> Request Asset
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Asset", value: stats.total, color: "text-slate-800" },
          { label: "Assigned", value: stats.assigned, color: "text-[#0EA5B7]" },
          { label: "Pending Requests", value: stats.pendingReq, color: "text-orange-600" },
          { label: "Damaged", value: stats.damaged, color: "text-red-500" },
          { label: "Returned", value: stats.returned, color: "text-gray-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-start">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <h3 className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-px">
        {["Assets", "Requests"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold transition-all relative ${activeTab === tab ? "text-primary" : "text-gray-400 hover:text-gray-600"}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="asset-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400 text-textPrimary shadow-sm"
        />
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-nexi5">
        <div className="overflow-x-auto custom-scrollbar">
          {activeTab === "Assets" ? (
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Asset ID</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Asset Details</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Assigned To</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Assignment Date</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Condition</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Status</th>
                  {isHRorAdmin && <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {groupedAssets.map((group, i) => {
                  if (group.length === 1) {
                    const asset = group[0];
                    return (
                      <motion.tr key={asset.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#F0F9FF] transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{asset.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-textPrimary">{asset.name}</p>
                          <p className="text-xs text-textSecondary font-medium">{asset.type} • {asset.brand}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-textPrimary">{asset.employeeName || "Unassigned"}</p>
                          <p className="text-xs text-textSecondary font-medium">{asset.department?.toUpperCase() || "-"}</p>
                        </td>
                        <td className="px-6 py-4 text-textSecondary font-medium">{formatDate(asset.createdAt)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${asset.condition === 'New' || asset.condition === 'Good' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : asset.condition === 'Fair' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {asset.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[asset.status]?.bg || "bg-gray-100"} ${STATUS_COLORS[asset.status]?.text || "text-gray-600"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[asset.status]?.dot || "bg-gray-500"}`} />
                            {asset.status}
                          </span>
                        </td>
                        {isHRorAdmin && (
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu trigger={<button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"><MoreVertical size={18} /></button>}>
                              <DropdownMenuItem onClick={() => openEditModal(asset)}>Edit Asset</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMarkReturned(asset.id)}>Mark as Returned</DropdownMenuItem>
                              <DropdownMenuItem destructive onClick={() => handleDeleteAsset(asset.id)}>Delete Asset</DropdownMenuItem>
                            </DropdownMenu>
                          </td>
                        )}
                      </motion.tr>
                    );
                  } else {
                    const mainEmployee = group[0];
                    const isExpanded = expandedGroups[mainEmployee.employeeId];
                    return (
                      <Fragment key={`group-${mainEmployee.employeeId}`}>
                        <motion.tr onClick={() => toggleGroup(mainEmployee.employeeId)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#F0F9FF] transition-colors cursor-pointer bg-slate-50 border-l-4 border-l-primary/30">
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-700">{mainEmployee.id}</span>
                            <span className="ml-2 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold whitespace-nowrap">+{group.length - 1} more</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-textPrimary">{mainEmployee.name}</p>
                            <p className="text-xs text-textSecondary font-medium">{mainEmployee.type} • {mainEmployee.brand}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-textPrimary">{mainEmployee.employeeName || "Unassigned"}</p>
                            <p className="text-xs text-textSecondary font-medium">{mainEmployee.department?.toUpperCase() || "-"}</p>
                          </td>
                          <td className="px-6 py-4 text-textSecondary font-medium">{formatDate(mainEmployee.createdAt)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${mainEmployee.condition === 'New' || mainEmployee.condition === 'Good' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : mainEmployee.condition === 'Fair' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                              {mainEmployee.condition}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[mainEmployee.status]?.bg || "bg-gray-100"} ${STATUS_COLORS[mainEmployee.status]?.text || "text-gray-600"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[mainEmployee.status]?.dot || "bg-gray-500"}`} />
                              {mainEmployee.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-primary bg-primary/5 hover:bg-primary/15 rounded-lg transition-colors border border-primary/20">
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          </td>
                        </motion.tr>
                        {isExpanded && (
                          <motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-slate-50/50">
                            <td colSpan={7} className="p-0 border-b-0">
                              <div className="mx-6 my-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                  <Package size={16} className="text-primary" /> Assigned Assets ({group.length})
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {group.map((asset) => (
                                    <div key={asset.id} className="relative p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{asset.id}</span>
                                        {isHRorAdmin ? (
                                          <DropdownMenu trigger={<button className="p-1 text-slate-400 hover:text-primary transition-colors"><MoreVertical size={14} /></button>}>
                                            <DropdownMenuItem onClick={() => toast.info("Edit feature coming soon")}>Edit Asset</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleMarkReturned(asset.id)}>Mark as Returned</DropdownMenuItem>
                                            <DropdownMenuItem destructive onClick={() => handleDeleteAsset(asset.id)}>Delete</DropdownMenuItem>
                                          </DropdownMenu>
                                        ) : null}
                                      </div>
                                      <p className="font-bold text-slate-800 text-sm mb-0.5 truncate">{asset.name}</p>
                                      <p className="text-xs text-slate-500 mb-3 truncate">{asset.type} • {asset.brand}</p>

                                      <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${asset.condition === 'New' || asset.condition === 'Good' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : asset.condition === 'Fair' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{asset.condition}</span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[asset.status]?.bg || "bg-gray-100"} ${STATUS_COLORS[asset.status]?.text || "text-gray-600"}`}>
                                          <span className={`w-1 h-1 rounded-full ${STATUS_COLORS[asset.status]?.dot || "bg-gray-500"}`} />
                                          {asset.status}
                                        </span>
                                      </div>

                                      <p className="text-[10px] font-medium text-slate-400">Assigned: {formatDate(asset.createdAt)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </Fragment>
                    );
                  }
                })}
                {groupedAssets.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-slate-400 font-medium">No assets found</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Request ID</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Employee</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Type</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Asset Info</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Date</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Priority</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Status</th>
                  <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleRequests.map((req, i) => (
                  <motion.tr key={req.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#F0F9FF] transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>
                    <td className="px-6 py-4 font-bold text-slate-700">{req.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-textPrimary">{req.employeeName}</p>
                      <p className="text-xs text-textSecondary font-medium">{req.department?.toUpperCase() || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-bold text-[11px] rounded border border-slate-200">{req.requestType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-textPrimary">{req.assetName}</p>
                      <p className="text-xs text-textSecondary font-medium">{req.assetType}</p>
                    </td>
                    <td className="px-6 py-4 text-textSecondary font-medium">{formatDate(req.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-xs ${req.priority === "High" ? "text-red-500" : req.priority === "Medium" ? "text-orange-500" : "text-blue-500"}`}>{req.priority}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${REQUEST_STATUS_COLORS[req.status]?.bg} ${REQUEST_STATUS_COLORS[req.status]?.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${REQUEST_STATUS_COLORS[req.status]?.dot}`} />
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isHRorAdmin ? (
                        <button onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }} className="text-primary font-bold text-xs hover:underline">Review</button>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }} className="text-primary font-bold text-xs hover:underline">View Details</button>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {visibleRequests.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-slate-400 font-medium">No requests found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Asset Modal */}
      <AnimatePresence>
        {isAssetModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAssetModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-textPrimary">Add New Asset</h2>
                <button onClick={() => setAssetModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 bg-slate-50/50">
                {/* Employee Section */}
                <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                      Employee Assignment
                    </h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {assetForm.assets.length} Asset{assetForm.assets.length !== 1 && 's'} Added
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Employee ID *</label>
                      <input
                        value={assetForm.employeeId}
                        onChange={handleEmployeeIdChange}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none uppercase"
                        placeholder="EMP-001"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Employee Name *</label>
                      <input
                        value={assetForm.employeeName}
                        readOnly
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-500 outline-none cursor-not-allowed"
                        placeholder="Auto-populated..."
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Asset Blocks */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {assetForm.assets.map((asset, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={asset.id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                          <h4 className="text-sm font-bold text-slate-700">Asset #{index + 1}</h4>
                          {assetForm.assets.length > 1 && (
                            <button
                              onClick={() => removeAssetBlock(asset.id)}
                              className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1.5"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          )}
                        </div>
                        <div className="p-5 grid grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Asset Type *</label>
                            <select
                              value={asset.type}
                              onChange={e => handleAssetFieldChange(asset.id, "type", e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                              {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Serial Number *</label>
                            <input
                              value={asset.serialNumber}
                              onChange={e => handleAssetFieldChange(asset.id, "serialNumber", e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                              placeholder="e.g. SN-12345"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Brand & Model</label>
                            <input
                              value={asset.brand}
                              onChange={e => handleAssetFieldChange(asset.id, "brand", e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                              placeholder="e.g. Apple MacBook Pro M2"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                            <select
                              value={asset.status}
                              onChange={e => handleAssetFieldChange(asset.id, "status", e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                              {Object.keys(STATUS_COLORS).map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="pt-2">
                  <button
                    onClick={addAssetBlock}
                    className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-xl text-primary font-bold text-sm hover:border-primary/30 hover:bg-primary/5 transition-all flex justify-center items-center gap-2"
                  >
                    <Plus size={18} /> Add Another Asset
                  </button>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button onClick={() => setAssetModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-gray-200 rounded-lg transition-all">Cancel</button>
                <button onClick={handleAssetSubmit} className="px-6 py-2.5 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-[#22C1DC] to-[#1E3A8A] hover:opacity-90 shadow-sm transition-all">Save Asset</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Request Review Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRequest(null)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{selectedRequest.requestType}</span>
                  <h2 className="text-xl font-bold text-textPrimary mt-1">{selectedRequest.assetName}</h2>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Employee</p>
                    <p className="font-bold text-slate-700">{selectedRequest.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Department</p>
                    <p className="font-bold text-slate-700">{selectedRequest.department?.toUpperCase() || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Request Date</p>
                    <p className="font-bold text-slate-700">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Priority</p>
                    <span className={`font-bold text-sm ${selectedRequest.priority === "High" ? "text-red-500" : selectedRequest.priority === "Medium" ? "text-orange-500" : "text-blue-500"}`}>{selectedRequest.priority}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Reason / Description</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 p-3 rounded-lg">{selectedRequest.reason}</p>
                </div>
                {selectedRequest.remarks && (
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">HR Remarks</p>
                    <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">{selectedRequest.remarks}</p>
                  </div>
                )}
                {isHRorAdmin && selectedRequest.status !== "Resolved" && selectedRequest.status !== "Rejected" && (
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Resolution Remarks</p>
                    <textarea id="hr-rem" className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" rows="2" placeholder="e.g. Approved and processing replacement..."></textarea>
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-gray-100 flex justify-between bg-gray-50/50">
                {isHRorAdmin && selectedRequest.status !== "Resolved" && selectedRequest.status !== "Rejected" ? (
                  <>
                    <button onClick={() => resolveRequest(selectedRequest.id, "Rejected", document.getElementById("hr-rem").value)} className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all">Reject</button>
                    <div className="flex gap-2">
                      <button onClick={() => resolveRequest(selectedRequest.id, "In Review", document.getElementById("hr-rem").value)} className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all">Mark In Review</button>
                      <button onClick={() => resolveRequest(selectedRequest.id, "Resolved", document.getElementById("hr-rem").value)} className="px-5 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all shadow-sm">Resolve & Approve</button>
                    </div>
                  </>
                ) : (
                  <button onClick={() => setSelectedRequest(null)} className="w-full py-2.5 text-sm font-bold text-slate-500 hover:bg-gray-200 rounded-lg transition-all">Close</button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* New Request Modal (Employee) */}
        {isRequestFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestFormOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-textPrimary">New Asset Request</h2>
                <button onClick={() => setRequestFormOpen(false)} className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4 bg-slate-50/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Request Type *</label>
                    <select
                      value={requestForm.requestType}
                      onChange={e => setRequestForm(prev => ({ ...prev, requestType: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option>New Asset Request</option>
                      <option>Damaged Asset Report</option>
                      <option>Return Asset Request</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Priority *</label>
                    <select
                      value={requestForm.priority}
                      onChange={e => setRequestForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Asset Details *</label>
                  <input
                    value={requestForm.assetName}
                    onChange={e => setRequestForm(prev => ({ ...prev, assetName: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g. Mechanical Keyboard, MacBook Power Adapter..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Reason / Justification *</label>
                  <textarea
                    value={requestForm.reason}
                    onChange={e => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    rows="4"
                    placeholder="Please explain why you are making this request..."
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button onClick={() => setRequestFormOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-gray-200 rounded-lg transition-all">Cancel</button>
                <button onClick={handleRequestSubmit} className="px-6 py-2.5 text-sm font-bold text-white rounded-lg bg-emerald-500 hover:bg-emerald-600 shadow-sm transition-all">Submit Request</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Asset Modal */}
      <AnimatePresence>
        {editingAsset && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingAsset(null)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary">Edit Asset</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{editingAsset.id}</p>
                </div>
                <button onClick={() => setEditingAsset(null)} className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                {/* Read-only employee info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-blue-400 mb-1 block">Employee ID</label>
                    <input
                      value={editingAsset.employeeId || ""}
                      onChange={handleEditEmployeeIdChange}
                      className="w-full bg-white border border-blue-100 rounded-lg py-1.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none uppercase font-bold text-slate-700"
                      placeholder="EMP-001"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-blue-400 mb-1 block">Assigned To</label>
                    <p className="text-sm font-bold text-slate-700 mt-1.5">{editingAsset.employeeName || "Unassigned"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Asset Type</label>
                    <select value={editingAsset.type} onChange={e => setEditingAsset(p => ({ ...p, type: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                      {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                    <select value={editingAsset.status} onChange={e => setEditingAsset(p => ({ ...p, status: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                      {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Brand &amp; Model</label>
                  <input value={editingAsset.brand || ""} onChange={e => setEditingAsset(p => ({ ...p, brand: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Apple MacBook Pro M2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Serial Number</label>
                    <input value={editingAsset.serialNumber || ""} onChange={e => setEditingAsset(p => ({ ...p, serialNumber: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. SN-12345" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Condition</label>
                    <select value={editingAsset.condition || "Good"} onChange={e => setEditingAsset(p => ({ ...p, condition: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                      {["New", "Good", "Fair", "Damaged"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button onClick={() => setEditingAsset(null)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-gray-200 rounded-lg transition-all">Cancel</button>
                <button onClick={handleEditSubmit} className="px-6 py-2.5 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-[#22C1DC] to-[#1E3A8A] hover:opacity-90 shadow-sm transition-all">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Assets;

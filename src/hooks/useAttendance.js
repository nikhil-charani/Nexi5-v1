import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAppContext } from './useAppContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const useAttendance = () => {
    const { currentUser, setIsCheckedIn, setCheckInTime } = useAppContext();
    const [dailyData, setDailyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const axiosConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${currentUser?.token}` }
    }), [currentUser?.token]);

    // 1. Real-time Subscription
    useEffect(() => {
        if (!currentUser?.token) return;
        
        let socketUrl = API_BASE.replace('/api', '');
        const socket = io(socketUrl, { withCredentials: true });

        socket.on('attendance:update', (event) => {
            console.log("Real-time Attendance Event:", event);
            
            // Refresh stats and daily logs
            fetchSummary();
            fetchDaily(format(new Date(), 'yyyy-MM-dd'));
            
            if (event.uid === currentUser?.uid) {
                toast.info(`Attendance ${event.type === 'checkin' ? 'Check-in' : 'Check-out'} detected.`);
            }
        });

        return () => socket.disconnect();
    }, [currentUser?.token]);

    // 2. Actions
    const checkIn = async (payload = { location: 'office' }) => {
        try {
            const res = await axios.post(`${API_BASE}/checkin`, payload, axiosConfig);
            if (res.data.success) {
                // Update Global Context
                setIsCheckedIn(true);
                setCheckInTime(new Date(res.data.data.checkin));
                toast.success("Check-in Successful");
                return res.data;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Check-in failed");
            throw err;
        }
    };

    const checkOut = async () => {
        try {
            const res = await axios.put(`${API_BASE}/checkout`, {}, axiosConfig);
            if (res.data.success) {
                // Update Global Context
                setIsCheckedIn(false);
                setCheckInTime(null);
                toast.success("Check-out Successful");
                return res.data;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Check-out failed");
            throw err;
        }
    };

    // 3. Data Fetchers
    const fetchDaily = useCallback(async (date) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/attendance/advanced/daily?date=${date}`, axiosConfig);
            if (res.data.success) setDailyData(res.data.data);
        } finally {
            setIsLoading(false);
        }
    }, [axiosConfig]);

    const fetchMonthly = useCallback(async (month) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/attendance/advanced/monthly?month=${month}`, axiosConfig);
            if (res.data.success) setMonthlyData(res.data.data);
        } finally {
            setIsLoading(false);
        }
    }, [axiosConfig]);

    const fetchSummary = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/attendance/advanced/summary`, axiosConfig);
            if (res.data.success) setSummary(res.data.data);
        } catch (err) {
            console.error("Failed to fetch attendance summary", err);
        }
    }, [axiosConfig]);

    return {
        checkIn,
        checkOut,
        fetchDaily,
        fetchMonthly,
        fetchSummary,
        dailyData,
        monthlyData,
        summary,
        isLoading
    };
};

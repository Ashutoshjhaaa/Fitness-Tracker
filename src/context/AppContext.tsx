import { createContext,useContext,useEffect,useState } from "react";

import {initialState, type FoodEntry,type ActivityEntry, type User, type Credentials } from "../types";
import { useNavigate } from "react-router-dom";
import strapiApi from "../services/strapiApi";

const AppContext = createContext(initialState);

export const AppProvider = ({children}: {children: React.ReactNode}) => {

    const navigate = useNavigate()
    const [user, setUser] = useState<User>(null);
    const [isUserFetched, setIsUserFetched] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    const signup = async (credentials: Credentials) => {
        const {data} = await strapiApi.auth.register(credentials);
        setUser({...data.user, token: data.jwt});
        if(data?.user?.age && data?.user?.weight && data?.user?.goal) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
        setIsUserFetched(true);
    }
    const login = async (credentials: Credentials) => {
        const {data} = await strapiApi.auth.login(credentials);
        setUser({...data.user, token: data.jwt});
        if(data?.user?.age && data?.user?.weight && data?.user?.goal) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    }

    const fetchUser = async (token: string) => {
        try {
            const {data} = await strapiApi.user.me()
            setUser({...data, token})
            if(data?.age && data?.weight && data?.goal) {
                setOnboardingCompleted(true);
            }
        } catch {
            // Token expired or invalid — clear it
            localStorage.removeItem('token');
        } finally {
            setIsUserFetched(true);
        }
    }

    const fetchFoodLogs = async () => {
        const {data} = await strapiApi.foodLogs.list()
        setAllFoodLogs(data);
    }

    const fetchActivityLogs = async () => {
        const {data} = await strapiApi.activityLogs.list()
        setAllActivityLogs(data);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setOnboardingCompleted(false);
        navigate('/')
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setIsUserFetched(true);
        }
    },[]);
     


    
    const value = {
        user, setUser, isUserFetched, fetchUser, onboardingCompleted, setOnboardingCompleted, allFoodLogs, setAllFoodLogs, allActivityLogs, setAllActivityLogs, signup, login, logout, fetchFoodLogs, fetchActivityLogs,
        
    }
    return <AppContext.Provider value={value}>
        {children}
    
    </AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext)
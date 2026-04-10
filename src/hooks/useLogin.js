import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {login} from '../services/authService';

export const useLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await login(email, password);
            console.log("Data: ", data);

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("fullName", data.fullName);

            switch (data.role) {
                case "admin": navigate("/admin"); break;
                case "leader": navigate("/leader"); break;
                case "member": navigate("/member"); break;
                default: navigate("/");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);  
        }
    };

    return{
        email, setEmail,
        password, setPassword,
        error, loading,
        handleLoginSubmit,
        navigate
    };
};
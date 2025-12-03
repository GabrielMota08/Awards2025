import { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
// Instale date-fns se quiser formatar datas bonitas, ou use string nativa
// npm install date-fns

const Dashboard = () => {
    const [groups, setGroups] = useState([]);
    const { isLoading, isAuthenticated } = useContext(AppContext);
    const navigate = useNavigate();
    // Estado do formulário
    const initialFormState = { title: "", description: "", start_date: "", end_date: "" };
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(null); // ID do grupo sendo editado

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isLoading, isAuthenticated, navigate]);

    const fetchGroups = async () => {
        try {
            const res = await api.get("/my-groups");
            setGroups(res.data);
        } catch (err) {
            console.error("Erro ao buscar grupos", err);
        }
    };

    const handleStartEdit = (group) => {
        setIsEditing(group.id);
        // Formata as datas para o input datetime-local aceitar (yyyy-MM-ddThh:mm)
        const formatForInput = (isoString) => {
            if(!isoString) return "";
            return new Date(isoString).toISOString().slice(0, 16);
        }

        setFormData({
            title: group.title,
            description: group.description,
            start_date: formatForInput(group.start_date),
            end_date: formatForInput(group.end_date)
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Modo Edição
                await api.put(`/groups/${isEditing}`, formData);
                alert("Premiação atualizada!");
            } else {
                // Modo Criação
                await api.post("/groups", formData);
                alert("Premiação criada!");
            }
            
            handleCancelEdit();
            fetchGroups(); // Recarrega a lista
        } catch (err) {
            alert("Erro ao salvar: " + (err.response?.data?.msg || err.message));
        }
    };

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h1>Votações criadas</h1>
            
            <div style={{ background: "#333", padding: "20px", marginBottom: "30px", borderRadius: "8px" }}>
                <h3>{isEditing ? "Editar Premiação" : "Criar Nova Premiação"}</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}>
                    <input 
                        placeholder="Título (ex: Oscar 2024)" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        style={{ padding: "10px" }}
                        required
                    />
                    <input 
                        placeholder="Descrição" 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        style={{ padding: "10px" }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ flex: 1 }}>
                            <label>Início:</label>
                            <input 
                                type="datetime-local" 
                                value={formData.start_date}
                                onChange={e => setFormData({...formData, start_date: e.target.value})} 
                                style={{ width: "100%", padding: "10px" }}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Fim:</label>
                            <input 
                                type="datetime-local" 
                                value={formData.end_date}
                                onChange={e => setFormData({...formData, end_date: e.target.value})} 
                                style={{ width: "100%", padding: "10px" }}
                                required
                            />
                        </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button type="submit" style={{ padding: "10px", background: "gold", border: "none", cursor: "pointer", flex: 1, fontWeight: "bold" }}>
                            {isEditing ? "SALVAR ALTERAÇÕES" : "CRIAR"}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={handleCancelEdit} style={{ padding: "10px", background: "#555", color: "white", border: "none", cursor: "pointer" }}>
                                CANCELAR
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {groups.map(group => (
                    <div key={group.id} style={{ border: "1px solid #555", padding: "20px", borderRadius: "8px", width: "320px", background: "#111", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            <h2 style={{ color: "gold" }}>{group.title}</h2>
                            <p>{group.description}</p>
                            <p style={{ fontSize: "0.8em", color: "#aaa", marginTop: "10px" }}>Link para votantes:</p>
                            <div style={{ background: "#000", padding: "8px", wordBreak: "break-all", fontSize: "0.8em", borderRadius: "4px" }}>
                                localhost:5173/categories/{group.access_token}
                            </div>
                        </div>
                        
                        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Link to={`/dashboard/manage/${group.id}`}>
                                <button style={{ width: "100%", padding: "10px", cursor: "pointer", background: "#4caf50", color: "white", border: "none", borderRadius: "4px" }}>
                                    GERENCIAR CATEGORIAS
                                </button>
                            </Link>
                            <button 
                                onClick={() => handleStartEdit(group)}
                                style={{ width: "100%", padding: "8px", cursor: "pointer", background: "#444", color: "white", border: "none", borderRadius: "4px" }}
                            >
                                Editar Informações
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
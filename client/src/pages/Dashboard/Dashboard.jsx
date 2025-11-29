import { useEffect, useState } from "react";
import api from "../../services/api"; // Importe a api configurada
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [groups, setGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ title: "", description: "", start_date: "", end_date: "" });

    // Carregar grupos ao entrar na tela
    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await api.get("/my-groups");
            setGroups(res.data);
        } catch (err) {
            console.error("Erro ao buscar grupos", err);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await api.post("/groups", newGroup);
            alert("Grupo criado!");
            fetchGroups(); // Recarrega a lista
        } catch (err) {
            alert("Erro ao criar grupo");
        }
    };

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h1>Meus Prêmios</h1>
            
            {/* Formulário Simples de Criação */}
            <div style={{ background: "#333", padding: "20px", marginBottom: "20px", borderRadius: "8px" }}>
                <h3>Criar Nova Premiação</h3>
                <form onSubmit={handleCreateGroup} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
                    <input placeholder="Título (ex: Oscar 2024)" onChange={e => setNewGroup({...newGroup, title: e.target.value})} />
                    <input placeholder="Descrição" onChange={e => setNewGroup({...newGroup, description: e.target.value})} />
                    <label>Início:</label>
                    <input type="datetime-local" onChange={e => setNewGroup({...newGroup, start_date: e.target.value})} />
                    <label>Fim:</label>
                    <input type="datetime-local" onChange={e => setNewGroup({...newGroup, end_date: e.target.value})} />
                    <button type="submit">Criar</button>
                </form>
            </div>

            {/* Lista de Grupos */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {groups.map(group => (
                    <div key={group.id} style={{ border: "1px solid #555", padding: "15px", borderRadius: "8px", width: "300px" }}>
                        <h2>{group.title}</h2>
                        <p>{group.description}</p>
                        <p style={{ fontSize: "0.8em", color: "#aaa" }}>Link para votantes:</p>
                        <div style={{ background: "#000", padding: "5px", wordBreak: "break-all" }}>
                            {/* Aqui geramos o link público para votação */}
                            http://localhost:5173/vote/{group.access_token}
                        </div>
                        {/* Botão para gerenciar categorias deste grupo (Futuro) */}
                        <button style={{ marginTop: "10px" }}>Gerenciar Categorias</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
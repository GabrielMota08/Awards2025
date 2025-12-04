import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import api from "../../services/api";
import { FaArrowLeftLong, FaPlus, FaTrash, FaCheck } from "react-icons/fa6";
import styles from "./ManageGroup.module.css";
import AppContext from "../../context/AppContext";

// --- COMPONENTE 1: HEADER DA CATEGORIA (NOVO) ---
// Funciona igual ao card: inputs abertos, salva apenas se houver mudança
const CategoryHeader = ({ category, onSave, onDelete, onDirtyChange }) => {
    const [data, setData] = useState({
        name: category.name,
        description: category.description
    });
    const [changed, setChanged] = useState(false);
    const uniqueId = `cat-${category.id}`;

    useEffect(() => {
        if (onDirtyChange) onDirtyChange(uniqueId, changed);
        return () => { if (onDirtyChange && changed) onDirtyChange(uniqueId, false); };
    }, [changed, uniqueId]);

    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
        setChanged(true);
    };

    const handleSave = () => {
        if (!data.name) return alert("O nome da categoria é obrigatório");
        onSave(category.id, data);
        setChanged(false); 
    };

    return (
        <div className={styles.catHeaderContainer}>
            <div className={styles.catInputs}>
                {/* Título com Width Dinâmico */}
                <input 
                    className={styles.catNameInput}
                    value={data.name}
                    placeholder="Nome da Categoria"
                    onChange={e => handleChange("name", e.target.value)}
                    // Lógica de Width Dinâmico: 
                    // Calcula caracteres (ch) + um pouco de sobra. Mínimo 200px via CSS.
                    style={{ width: `${Math.max(data.name.length, 10) + 2}ch` }}
                />
                
                {/* Descrição com Width Dinâmico */}
                <input 
                    className={styles.catDescInput}
                    value={data.description}
                    placeholder="Descrição da categoria"
                    onChange={e => handleChange("description", e.target.value)}
                    // Mesma lógica de width
                    style={{ width: `${Math.max(data.description.length, 15) + 2}ch` }}
                />
            </div>

            <div className={styles.catActions}>
                {/* Botão Salvar: VISIBILITY HIDDEN se não houver mudança */}
                <button 
                    onClick={handleSave} 
                    className={styles.saveCatBtn}
                    style={{ 
                        visibility: changed ? 'visible' : 'hidden', 
                        opacity: changed ? 1 : 0 
                    }}
                    title="Salvar alterações"
                >
                    <FaCheck />
                </button>

                {/* Botão Deletar: Texto + Ícone */}
                <button 
                    onClick={() => onDelete(category.id)} 
                    className={styles.deleteCatBtn}
                    title="Excluir categoria"
                >
                    <FaTrash /> Excluir Categoria
                </button>
            </div>
        </div>
    );
};

// --- COMPONENTE 2: CARD DE INDICADO (Igual ao anterior) ---
const ManageCard = ({ nominee, onSave, onDelete, isNew = false, onDirtyChange, uniqueId }) => {
    const [data, setData] = useState({
        name: nominee?.name || "",
        description: nominee?.description || "",
        imageUrl: nominee?.image || nominee?.image_url || ""
    });
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        if (onDirtyChange) onDirtyChange(uniqueId, changed);
        return () => { if (onDirtyChange && changed) onDirtyChange(uniqueId, false); };
    }, [changed, uniqueId]);

    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
        setChanged(true);
    };

    const handleSave = () => {
        if (!data.name) return alert("Nome é obrigatório");
        onSave(data);
        if (!isNew) {
            setChanged(false); 
        } else {
            setData({ name: "", description: "", imageUrl: "" }); 
            setChanged(false);
        }
    };

    const handleCancelNew = () => setChanged(false);

    if (isNew && !changed) {
        return (
            <div className={styles.addCard} onClick={() => setChanged(true)}>
                <FaPlus size={30} />
                <h4>Adicionar Indicado</h4>
            </div>
        );
    }

    return (
        <div className={styles.manageCard}>
            <div className={styles.cardLeftColumn}>
                <div className={styles.imageInputArea}>
                    {data.imageUrl && <img src={data.imageUrl} alt="Preview" />}
                    <input 
                        placeholder="Link Imagem" 
                        value={data.imageUrl}
                        onChange={e => handleChange("imageUrl", e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.cardRightColumn}>
                <input 
                    className={styles.nameInput} 
                    placeholder="Nome"
                    value={data.name}
                    onChange={e => handleChange("name", e.target.value)}
                />
                <textarea 
                    className={styles.descInput}
                    placeholder="Descrição..."
                    rows={2}
                    value={data.description}
                    onChange={e => handleChange("description", e.target.value)}
                />
                <div className={styles.cardActions}>
                    <button 
                        className={styles.saveButton} 
                        onClick={handleSave} 
                        style={{opacity: changed ? 1 : 0.5}}
                    >
                        {isNew ? "ADD" : <FaCheck />}
                    </button>
                    {!isNew && (
                        <button className={styles.deleteButton} onClick={onDelete}><FaTrash /></button>
                    )}
                    {isNew && (
                        <button className={styles.deleteButton} onClick={handleCancelNew}>X</button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- PÁGINA PRINCIPAL ---
const ManageGroup = () => {
    const { groupId } = useParams();
    const { isLoading, isAuthenticated } = useContext(AppContext);
    const navigate = useNavigate();
    const [groupData, setGroupData] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    
    // Controle de alterações não salvas (Dirty State)
    const [dirtyItems, setDirtyItems] = useState(new Set());

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isLoading, isAuthenticated, navigate]);

    const handleDirtyChange = (id, isDirty) => {
        setDirtyItems(prev => {
            const newSet = new Set(prev);
            if (isDirty) newSet.add(id);
            else newSet.delete(id);
            return newSet;
        });
    };

    // Bloqueios de saída
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (dirtyItems.size > 0) {
                e.preventDefault();
                e.returnValue = "Há alterações não salvas!";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [dirtyItems]);

    const handleGoBack = () => {
        if (dirtyItems.size > 0) {
            if (!window.confirm("Há alterações não salvas. Deseja sair e perder o progresso?")) return;
        }
        navigate("/account");
    };

    useEffect(() => {
        fetchData();
    }, [groupId]);

    const fetchData = async () => {
        try {
            const groupsRes = await api.get("/my-groups");
            const currentGroup = groupsRes.data.find(g => g.id === parseInt(groupId));
            if (currentGroup) {
                const detailsRes = await api.get(`/vote-data/${currentGroup.access_token}`);
                setGroupData(detailsRes.data);
            }
        } catch (err) { console.error(err); }
    };

    // --- AÇÕES ---

    const handleAddCategory = async () => {
        if (!newCategoryName) return;
        try {
            await api.post("/categories", { groupId, name: newCategoryName, description: "Nova categoria" });
            setNewCategoryName("");
            fetchData();
        } catch (err) { alert("Erro ao criar categoria"); }
    };

    const handleSaveCategory = async (catId, data) => {
        try {
            await api.put(`/categories/${catId}`, data);
            // Não recarrega tudo (fetchData) para não perder o foco do input ou resetar outros estados sujos
        } catch (err) { alert("Erro ao salvar categoria"); }
    };

    const handleDeleteCategory = async (catId) => {
        if(!window.confirm("Apagar esta categoria e todos os seus indicados?")) return;
        try {
            await api.delete(`/categories/${catId}`);
            fetchData();
        } catch (err) { alert("Erro ao deletar"); }
    };

    const handleUpdateNominee = async (id, data) => {
        try { await api.put(`/nominees/${id}`, { ...data, image_url: data.imageUrl }); } 
        catch (err) { alert("Erro ao salvar"); }
    };

    const handleCreateNominee = async (categoryId, data) => {
        try { 
            await api.post("/nominees", { ...data, categoryId }); 
            fetchData(); 
        } catch (err) { alert("Erro ao criar"); }
    };

    const handleDeleteNominee = async (id) => {
        if(!window.confirm("Remover?")) return;
        try { 
            await api.delete(`/nominees/${id}`); 
            fetchData(); 
        } catch (err) { alert("Erro ao deletar"); }
    };

    if (!groupData) return <div style={{color:'white', padding: 20}}>Carregando...</div>;

    return (
        <div className={styles.manageContainer}>
            <div className={styles.header}>
                <button onClick={handleGoBack} style={{ background: 'transparent', border: 'none', color: "white", display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, marginBottom: 10, cursor: 'pointer' }}>
                    <FaArrowLeftLong /> Voltar
                </button>
                <h1>{groupData.group.title}</h1>
                <h4>{groupData.group.description}</h4>
                <div style={{marginTop: 20, display:'flex', justifyContent:'center', gap: 10}}>
                    <input 
                        style={{padding: 10, borderRadius: 5, border:'none', width: 300}} 
                        placeholder="Nome da Nova Categoria..."
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                    />
                    <button onClick={handleAddCategory} className={styles.purpleThemeBtn} style={{padding: '10px 20px', border:'none', fontWeight:'bold', cursor:'pointer', borderRadius: 5}}>
                        CRIAR CATEGORIA
                    </button>
                </div>
            </div>

            {/* LISTA DE CATEGORIAS */}
            {groupData.categories.map((category) => (
                <section key={category.id} className={styles.categorySection}>
                    
                    {/* Componente de Cabeçalho da Categoria (Sempre em modo edição) */}
                    <CategoryHeader 
                        category={category}
                        onSave={handleSaveCategory}
                        onDelete={handleDeleteCategory}
                        onDirtyChange={handleDirtyChange}
                    />

                    <div className={styles.grid}>
                        {category.nominees.map((nominee) => (
                            <ManageCard 
                                key={nominee.id}
                                uniqueId={`nominee-${nominee.id}`}
                                nominee={nominee}
                                onSave={(data) => handleUpdateNominee(nominee.id, data)}
                                onDelete={() => handleDeleteNominee(nominee.id)}
                                onDirtyChange={handleDirtyChange}
                            />
                        ))}
                        <ManageCard 
                            isNew={true}
                            uniqueId={`new-cat-${category.id}`}
                            onSave={(data) => handleCreateNominee(category.id, data)}
                            onDirtyChange={handleDirtyChange}
                        />
                    </div>
                </section>
            ))}
        </div>
    );
};

export default ManageGroup;
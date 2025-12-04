import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import AppContext from "../../context/AppContext";
import styles from "./Account.module.css";
import { FaRegCopy, FaEdit, FaUser, FaTrophy, FaPlus, FaTimes } from "react-icons/fa";

// Componente do Card de Premiação Individual
const GroupCard = ({ group, onUpdate }) => {
    const [details, setDetails] = useState({ categories: [] });
    
    // 1. Adicionamos o estado para a descrição
    const [title, setTitle] = useState(group.title);
    const [description, setDescription] = useState(group.description);
    
    const [copyLinkMessage, setCopyLinkMessage] = useState();

    useEffect(() => {
        api.get(`/vote-data/${group.access_token}`).then(res => {
            setDetails(res.data);
        });
    }, [group.access_token]);

    // Atualiza estados locais se a prop group mudar (opcional, mas recomendável)
    useEffect(() => {
        setTitle(group.title);
        setDescription(group.description);
    }, [group]);

    const formatDataMySQL = (dateString) => {
        if (!dateString) return null;
        // Se já estiver no formato do MySQL, retorna como está
        if (!dateString.includes('T')) return dateString;
        
        // Transforma '2025-11-29T03:00:00.000Z' em '2025-11-29 03:00:00'
        return dateString.replace('T', ' ').substring(0, 19);
    };

    const handleBlurTitle = async () => {
        if (title !== group.title) {
            try {
                // 2. Antes de enviar, formatamos as datas
                const payload = {
                    ...group,
                    title: title, // novo titulo
                    description: description, // nova descrição (caso tenha editado mas não salvo)
                    start_date: formatDataMySQL(group.start_date),
                    end_date: formatDataMySQL(group.end_date)
                };

                await api.put(`/groups/${group.id}`, payload);
                onUpdate(); 
            } catch (err) {
                console.error(err); // Bom para ver o erro no console
                alert("Erro ao salvar título");
            }
        }
    };

    const handleBlurDescription = async () => {
        if (description !== group.description) {
            try {
                // 3. Mesma coisa aqui
                const payload = {
                    ...group,
                    title: title,
                    description: description,
                    start_date: formatDataMySQL(group.start_date),
                    end_date: formatDataMySQL(group.end_date)
                };

                await api.put(`/groups/${group.id}`, payload);
                onUpdate();
            } catch (err) {
                console.error(err);
                alert("Erro ao salvar descrição");
            }
        }
    };

    const copyLink = () => {
        const link = `${window.location.origin}/votar/${group.access_token}`;
        navigator.clipboard.writeText(link);
        setCopyLinkMessage(true)
        setTimeout(() => {
            setCopyLinkMessage(false)
        }, 750)
    };

    return (
        <div className={styles.groupCard}>
            <div className={styles.groupHeader}>
                <input 
                    className={styles.groupTitleInput}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={handleBlurTitle}
                    placeholder="Título da Premiação"
                />
                
                {/* 3. Trocamos o <p> por um <input> ou <textarea> */}
                <textarea 
                    className={styles.groupDescInput}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onBlur={handleBlurDescription}
                    placeholder="Clique para adicionar uma descrição..."
                    rows={1} // Começa com 1 linha
                />
            </div>

            {/* ... Restante do código (categoriesContainer, etc) permanece igual ... */}
             <div className={styles.categoriesContainer}>
                {details.categories.length === 0 && (
                    <div style={{color:'#666', fontStyle:'italic', padding: 10}}>Nenhuma categoria criada ainda.</div>
                )}
                
                {details.categories.map(cat => (
                    <div key={cat.id} className={styles.categoryPreviewBox}>
                        <h4 className={styles.catPreviewTitle}>{cat.name}</h4>
                        <div className={styles.nomineesPreviewScroll}>
                            {cat.nominees && cat.nominees.length > 0 ? (
                                cat.nominees.map(nom => (
                                    <div key={nom.id} className={styles.miniNomineeCard}>
                                        <img src={nom.image} alt={nom.name} className={styles.miniNomineeImg} />
                                        <div className={styles.miniNomineeName}>{nom.name}</div>
                                    </div>
                                ))
                            ) : (
                                <div style={{padding: '10px', color: '#555', fontSize: '0.9rem'}}>
                                    Sem indicados ainda.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.groupActions}>
                <button className={`${copyLinkMessage ? styles.copyLinkMessage : ""} ${styles.actionBtn} ${styles.shareBtn}`} onClick={copyLink}>
                    <FaRegCopy /> {copyLinkMessage ? "Link copiado" : "Copiar Link"}
                </button>
                
                <Link to={`/account/manage/${group.id}`}>
                    <button className={`${styles.actionBtn} ${styles.editBtn}`}>
                        <FaEdit /> GERENCIAR
                    </button>
                </Link>
            </div>
        </div>
    );
};


const Account = () => {
    const { user, isLoading, isAuthenticated } = useContext(AppContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("account");
    
    const [groups, setGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ title: "", description: "", start_date: "", end_date: "" });
    const [showCreateForm, setShowCreateForm] = useState(false); // Controla a visibilidade do form

    const [userData, setUserData] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
            return;
        }

        if (isAuthenticated) {
            fetchUserData();
            fetchGroups();
        }
    }, [isLoading, isAuthenticated, navigate]);

    const fetchUserData = async () => {
        try {
            const res = await api.get("/user");
            setUserData({ 
                name: res.data.name, 
                email: res.data.email, 
                password: "" 
            });
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
        }
    };

    const fetchGroups = async () => {
        try {
            const res = await api.get("/my-groups");
            setGroups(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await api.put("/user", userData);
            alert("Dados atualizados!");
        } catch (err) {
            alert("Erro ao atualizar");
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await api.post("/groups", newGroup);
            alert("Premiação Criada!");
            setNewGroup({ title: "", description: "", start_date: "", end_date: "" });
            setShowCreateForm(false); // Fecha o form após criar
            fetchGroups();
        } catch (err) {
            alert("Erro ao criar");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Painel</h2>
                <button 
                    className={`${styles.menuItem} ${activeTab === 'account' ? styles.activeMenu : ''}`}
                    onClick={() => setActiveTab('account')}
                >
                    <FaUser style={{marginRight: 8}}/> Minha Conta
                </button>
                <button 
                    className={`${styles.menuItem} ${activeTab === 'groups' ? styles.activeMenu : ''}`}
                    onClick={() => setActiveTab('groups')}
                >
                    <FaTrophy style={{marginRight: 8}}/> Grupos de Premiação
                </button>
            </div>

            <div className={styles.content}>
                
                {/* ABA: MINHA CONTA */}
                {activeTab === 'account' && (
                    <div>
                        <h1>Meus Dados</h1>
                        <form className={styles.accountForm} onSubmit={handleUpdateUser}>
                            <div className={styles.inputGroup}>
                                <label>Nome</label>
                                <input 
                                    className={styles.input} 
                                    value={userData.name} 
                                    onChange={e => setUserData({...userData, name: e.target.value})}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email</label>
                                <input 
                                    className={styles.input} 
                                    value={userData.email} 
                                    onChange={e => setUserData({...userData, email: e.target.value})}
                                    placeholder="email@exemplo.com"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Nova Senha (opcional)</label>
                                <input 
                                    className={styles.input} 
                                    type="password" 
                                    placeholder="Deixe em branco para manter"
                                    onChange={e => setUserData({...userData, password: e.target.value})}
                                />
                            </div>
                            <button type="submit" className={styles.saveBtn}>SALVAR ALTERAÇÕES</button>
                        </form>
                    </div>
                )}

                {/* ABA: GRUPOS DE PREMIAÇÃO */}
                {activeTab === 'groups' && (
                    <div>
                        <h1>Minhas Premiações</h1>
                        
                        {/* Botão para abrir o formulário */}
                        <div style={{marginBottom: '30px'}}>
                            {!showCreateForm ? (
                                <button className={styles.showCreateBtn} onClick={() => setShowCreateForm(true)}>
                                    <FaPlus style={{marginRight: 8}}/> CRIAR NOVA PREMIAÇÃO
                                </button>
                            ) : (
                                <button className={styles.cancelCreateBtn} onClick={() => setShowCreateForm(false)}>
                                    <FaTimes style={{marginRight: 8}}/> CANCELAR
                                </button>
                            )}
                        </div>

                        {/* Card de Criação (Visível apenas quando showCreateForm é true) */}
                        {showCreateForm && (
                            <div className={styles.createCard}>
                                <h3>Nova Premiação</h3>
                                <form onSubmit={handleCreateGroup} style={{display:'flex', flexDirection:'column', gap: 10}}>
                                    <div className={styles.createRow}>
                                        <input 
                                            className={styles.input} 
                                            style={{flex: 1}} 
                                            placeholder="Nome do Evento (ex: Oscar 2025)"
                                            value={newGroup.title}
                                            onChange={e => setNewGroup({...newGroup, title: e.target.value})}
                                            required
                                        />
                                        <input 
                                            className={styles.input} 
                                            style={{flex: 2}} 
                                            placeholder="Descrição curta"
                                            value={newGroup.description}
                                            onChange={e => setNewGroup({...newGroup, description: e.target.value})}
                                        />
                                    </div>
                                    <div className={styles.createRow}>
                                        <div style={{flex:1}}>
                                            <label style={{fontSize: 12, color:'#aaa'}}>Início</label>
                                            <input type="datetime-local" className={styles.input} style={{width:'100%'}}
                                                value={newGroup.start_date}
                                                onChange={e => setNewGroup({...newGroup, start_date: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div style={{flex:1}}>
                                            <label style={{fontSize: 12, color:'#aaa'}}>Fim</label>
                                            <input type="datetime-local" className={styles.input} style={{width:'100%'}}
                                                value={newGroup.end_date}
                                                onChange={e => setNewGroup({...newGroup, end_date: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className={styles.createBtn}>CONFIRMAR CRIAÇÃO</button>
                                </form>
                            </div>
                        )}

                        <div className={styles.groupsList}>
                            {groups.map(group => (
                                <GroupCard key={group.id} group={group} onUpdate={fetchGroups} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
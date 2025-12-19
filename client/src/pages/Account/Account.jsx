import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../services/api";
import AppContext from "../../context/AppContext";
import styles from "./Account.module.css";
import { FaRegCopy, FaEdit, FaUser, FaTrophy, FaPlus, FaTimes } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

// Componente do Card de Premiação Individual
const GroupCard = ({ group, onUpdate }) => {
    const [details, setDetails] = useState({ categories: [] });
    
    // Estados locais para edição
    const [title, setTitle] = useState(group.title || "");
    const [description, setDescription] = useState(group.description || "");
    
    // Função para formatar data do banco (UTC/ISO) para o input local (YYYY-MM-DDTHH:MM) sem somar horas extras
    const formatForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        // Ajuste para garantir que o input mostre a hora correta localmente
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const [startDate, setStartDate] = useState(formatForInput(group.start_date));
    const [endDate, setEndDate] = useState(formatForInput(group.end_date));
    
    const [themeColor, setThemeColor] = useState(group.theme || '#7c4dff');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [copyLinkMessage, setCopyLinkMessage] = useState(false);

    const colors = ['#7c4dff', '#24398e'];

    // Carrega detalhes (categorias/indicados) apenas se o token mudar
    useEffect(() => {
        if(group.access_token) {
            api.get(`/vote-data/${group.access_token}`)
                .then(res => setDetails(res.data))
                .catch(err => console.error("Erro ao carregar detalhes", err));
        }
    }, [group.access_token]);

    // Atualiza estados se a prop group mudar (ex: após um refresh do pai)
    useEffect(() => {
        setTitle(group.title);
        setDescription(group.description);
        setStartDate(formatForInput(group.start_date));
        setEndDate(formatForInput(group.end_date));
        setThemeColor(group.theme || '#7c4dff');
    }, [group]);

    const handleSave = async (fieldOverride = {}) => {
        try {
            const payload = {
                title: fieldOverride.title !== undefined ? fieldOverride.title : title,
                description: fieldOverride.description !== undefined ? fieldOverride.description : description,
                start_date: fieldOverride.start_date !== undefined ? fieldOverride.start_date : startDate,
                end_date: fieldOverride.end_date !== undefined ? fieldOverride.end_date : endDate,
                theme: fieldOverride.theme !== undefined ? fieldOverride.theme : themeColor
            };

            await api.put(`/groups/${group.id}`, payload);
            
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar alterações");
        }
    };

    const handleColorChange = (newColor) => {
        setThemeColor(newColor);
        setShowColorPicker(false);
        handleSave({ theme: newColor });
    };

    const handleBlur = (field) => {
        handleSave();
    };

    const copyLink = () => {
        const link = `${window.location.origin}/nominees/${group.access_token}/0`;
        navigator.clipboard.writeText(link);
        setCopyLinkMessage(true);
        setTimeout(() => setCopyLinkMessage(false), 750);
    };

    return (
        <div className={styles.groupCard}>
            <div className={styles.groupHeader}>
                <input 
                    className={styles.groupTitleInput}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={() => handleBlur('title')}
                    placeholder="Título da Premiação"
                />
                
                <textarea 
                    className={styles.groupDescInput}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onBlur={() => handleBlur('description')}
                    placeholder="Clique para adicionar uma descrição..."
                    rows={1}
                />

                <div className={styles.dateEditContainer}>
                    <div>
                        <span style={{marginRight:5}}>Início:</span>
                        <input 
                            type="datetime-local" 
                            className={styles.dateInput}
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            onBlur={() => handleBlur('start_date')}
                        />
                    </div>
                    <div>
                        <span style={{marginRight:5}}>Fim:</span>
                        <input 
                            type="datetime-local" 
                            className={styles.dateInput}
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            onBlur={() => handleBlur('end_date')}
                        />
                    </div>
                </div>
            </div>

             <div className={styles.categoriesContainer}>
                {(!details.categories || details.categories.length === 0) && (
                    <div style={{color:'#666', fontStyle:'italic', padding: 10}}>Nenhuma categoria criada ainda.</div>
                )}
                
                {details.categories && details.categories.map(cat => (
                    <div key={cat.id} className={styles.categoryPreviewBox} style={{borderLeftColor: themeColor}}>
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
                    <button className={`${styles.actionBtn} ${styles.editBtn} ${styles[`editBtn${themeColor == "#24398e" ? "Blue" : (themeColor == "#7c4dff" ? "Purple" : "Purple")}`]}`}>
                        <FaEdit /> GERENCIAR CATEGORIAS
                    </button>
                </Link>

                <Link to={`/${group.access_token}`}>
                    <button className={`${styles.actionBtn} ${styles.openLinkBtn}`}>
                        <FiExternalLink/> Acessar página
                    </button>
                </Link>
            </div>

            {showColorPicker && (
                <div className={styles.colorPickerBox}>
                    {colors.map(color => (
                        <div 
                            key={color} 
                            className={styles.colorCircle} 
                            style={{backgroundColor: color, border: themeColor === color ? '2px solid white' : 'none'}}
                            onClick={() => handleColorChange(color)}
                        />
                    ))}
                </div>
            )}
            
            <button 
                className={styles.themeBtn} 
                style={{backgroundColor: themeColor}}
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Alterar cor do tema"
            />

        </div>
    );
};


const Account = () => {
    const { isLoading, isAuthenticated } = useContext(AppContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("account");
    const location = useLocation();
    
    const [groups, setGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ title: "", description: "", start_date: "", end_date: "" });
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [userData, setUserData] = useState({ name: "", email: "", password: "" });

    // Scroll Reset na montagem
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Controle de Abas via Hash
    useEffect(() => {
        if (location.hash === "#my-account") setActiveTab("account");
        else if (location.hash === "#my-awards") setActiveTab("groups");
    }, [location.hash]);

    // Auth Check
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        } else if (isAuthenticated) {
            // Carrega dados iniciais apenas uma vez ou se o usuário mudar
            fetchUserData();
            fetchGroups();
        }
    }, [isLoading, isAuthenticated, navigate]);

    const fetchUserData = async () => {
        try {
            const res = await api.get("/user");
            setUserData({ name: res.data.name, email: res.data.email, password: "" });
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
            setShowCreateForm(false);
            fetchGroups();
        } catch (err) {
            alert("Erro ao criar");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Painel</h2>
                <div>
                <a href="#my-account" style={{textDecoration:'none'}}>
                    <button className={`${styles.menuItem} ${activeTab === "account" ? styles.activeMenu : ""}`}>
                        <FaUser style={{ marginRight: 8 }} /> Minha Conta
                    </button>
                </a>

                <a href="#my-awards" style={{textDecoration:'none'}}>
                    <button className={`${styles.menuItem} ${activeTab === "groups" ? styles.activeMenu : ""}`}>
                        <FaTrophy style={{ marginRight: 8 }} /> Grupos de Premiação
                    </button>
                </a>
                </div>
            </div>

            <div className={styles.content}>
                
                {activeTab === 'account' && (
                    <div>
                        <h2>Meus Dados</h2>
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

                {activeTab === 'groups' && (
                    <div>
                        <h2>Minhas Premiações</h2>
                        
                        <div style={{marginBottom: '30px', marginTop: '0.5em'}}>
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

                        {showCreateForm && (
                            <div className={styles.createCard}>
                                <h3>Nova Premiação</h3>
                                <form onSubmit={handleCreateGroup} style={{display:'flex', flexDirection:'column', gap: 10}}>
                                    <div className={styles.createRow}>
                                        <input 
                                            className={styles.input} style={{flex: 1}} 
                                            placeholder="Nome do Evento"
                                            value={newGroup.title}
                                            onChange={e => setNewGroup({...newGroup, title: e.target.value})}
                                            required
                                        />
                                        <input 
                                            className={styles.input} style={{flex: 2}} 
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
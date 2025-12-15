import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";
import api from '../../services/api'; 
import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";

const Auth = () => {
    const { login, isAuthenticated, isLoading } = useContext(AppContext);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    
    const [isLoginView, setIsLoginView] = useState(true);

    const handleClickLogin = async (values) => {
        const result = await login(values.email, values.password);
        if (result.success) {
            navigate("/account");
        } else {
            setErrorMsg(result.msg || "Erro ao fazer o login");
        }
    };

    const handleClickRegister = (values) => {
        api.post("/register", {
            email: values.email,
            password: values.password,
        }).then(async (response) => {
            // Após registrar com sucesso, faz o login automaticamente
            const loginResult = await login(values.email, values.password);
            if (loginResult.success) {
                navigate("/account");
            } else {
                // Se falhar o login automático, muda para a tela de login
                alert("Conta criada! Faça login.");
                setIsLoginView(true);
            }
        }).catch((error) => {
            alert("Erro ao registrar: " + error.response?.data?.msg || "Tente novamente");
        });
    };

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate("/account");
        }
    }, [isLoading, isAuthenticated, navigate]);

    const validationLogin = yup.object().shape({
        email: yup.string().email("Este email não é valido").required("O email é obrigatório"),
        password: yup.string().required("A senha é obrigatória"),
    });

    const validationRegister = yup.object().shape({
        email: yup.string().email("Este email não é valido").required("O email é obrigatório"),
        password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("A senha é obrigatória"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "As senhas não coincidem")
            .required("Confirme sua senha"),
    });

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {isLoginView ? "Entrar" : "Criar Conta"}
                </h1>
                
                <p className={styles.subtitle}>
                    {isLoginView ? "Bem-vindo de volta!" : "Preencha os dados abaixo"}
                </p>

                {errorMsg && <div className={styles.serverError}>{errorMsg}</div>}

                {/* Renderização Condicional */}
                {isLoginView ? (
                    <Formik 
                        initialValues={{ email: "", password: "" }} 
                        onSubmit={handleClickLogin} 
                        validationSchema={validationLogin}
                    >
                        <Form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <Field name="email" className={styles.inputField} placeholder="exemplo@email.com" />
                                <ErrorMessage component="span" name="email" className={styles.formError} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Senha</label>
                                <Field type="password" name="password" className={styles.inputField} placeholder="********" />
                                <ErrorMessage component="span" name="password" className={styles.formError} />
                            </div>

                            <button className={styles.submitButton} type="submit">
                                Entrar
                            </button>
                        </Form>
                    </Formik>
                ) : (
                    <Formik 
                        initialValues={{ email: "", password: "", confirmPassword: "" }} 
                        onSubmit={handleClickRegister} 
                        validationSchema={validationRegister}
                    >
                        <Form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <Field name="email" className={styles.inputField} placeholder="exemplo@email.com" />
                                <ErrorMessage component="span" name="email" className={styles.formError} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Senha</label>
                                <Field type="password" name="password" className={styles.inputField} placeholder="********" />
                                <ErrorMessage component="span" name="password" className={styles.formError} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Confirmar Senha</label>
                                <Field type="password" name="confirmPassword" className={styles.inputField} placeholder="********" />
                                <ErrorMessage component="span" name="confirmPassword" className={styles.formError} />
                            </div>

                            <button className={styles.submitButton} type="submit">
                                Registrar
                            </button>
                        </Form>
                    </Formik>
                )}

                <div className={styles.toggleContainer}>
                    <span>
                        {isLoginView ? "Não tem uma conta?" : "Já tem uma conta?"}
                    </span>
                    <button 
                        className={styles.toggleButton} 
                        onClick={() => {
                            setIsLoginView(!isLoginView);
                            setErrorMsg(""); // Limpa erros ao trocar de tela
                        }}
                    >
                        {isLoginView ? "Cadastre-se" : "Faça Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
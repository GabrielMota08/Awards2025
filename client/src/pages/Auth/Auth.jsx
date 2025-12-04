import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";

const Auth = () => {
    const { login, isAuthenticated, isLoading } = useContext(AppContext);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const handleClickLogin = async (values) => {
        const result = await login(values.email, values.password);
        if (result.success) {
            navigate("/account");
        } else {
            setErrorMsg(result.msg || "Erro ao fazer o login");
        }
    };

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate("/account");
        }
    }, [isLoading, isAuthenticated, navigate]);

    const handleClickRegister = (values) => {
        Axios.post("http://localhost:3001/register", {
            email: values.email,
            password: values.password,
        }).then((response) => {
            console.log(response);
            alert(response.data.msg);
        });
    };

    const validationLogin = yup.object().shape({
        email: yup.string().email("Este email não é valido").required(),
        password: yup.string().min(2, "A senha deve ter pelo menos 6 caracteres").required(),
    });

    const validationRegister = yup.object().shape({
        email: yup.string().email("Este email não é valido").required(),
        password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required(),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "As senhas não coincidem"),
    });

    return (
        <div>
            <div className={styles.containerLogin}>
                <h1>Login</h1>

                {/* LOGIN */}
                <Formik initialValues={{}} onSubmit={handleClickLogin} validationSchema={validationLogin}>
                    <Form className={styles.loginForm}>
                        <div className={styles.loginFormGroup}>
                            <Field name="email" className={styles.formField} placeholder="Email" />
                            <ErrorMessage component="span" name="email" className={styles.formError} />
                        </div>

                        <div className={styles.loginFormGroup}>
                            <Field name="password" className={styles.formField} placeholder="Senha" />
                            <ErrorMessage component="span" name="password" className={styles.formError} />
                        </div>

                        <button className={styles.buttonLogin} type="submit">Login</button>
                    </Form>
                </Formik>

                <h1>Cadastro</h1>

                {/* REGISTER */}
                <Formik initialValues={{}} onSubmit={handleClickRegister} validationSchema={validationRegister}>
                    <Form className={styles.registerForm}>
                        <div className={styles.registerFormGroup}>
                            <Field name="email" className={styles.formField} placeholder="Email" />
                            <ErrorMessage component="span" name="email" className={styles.formError} />
                        </div>

                        <div className={styles.registerFormGroup}>
                            <Field name="password" className={styles.formField} placeholder="Senha" />
                            <ErrorMessage component="span" name="password" className={styles.formError} />
                        </div>

                        <div className={styles.registerFormGroup}>
                            <Field name="confirmPassword" className={styles.formField} placeholder="Confirme sua senha" />
                            <ErrorMessage component="span" name="confirmPassword" className={styles.formError} />
                        </div>

                        <button className={styles.buttonRegister} type="submit">Registrar</button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default Auth;

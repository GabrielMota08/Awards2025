import {Formik, Form, Field, ErrorMessage} from "formik";
import * as yup from 'yup';
import "./Auth.modules.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { useState } from "react";

const Auth = () => {
    const { login } = useContext(AppContext);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    
    const handleClickLogin = async (values) => {
        const result = await login(values.email, values.password);
        if(result.success){
            navigate("/dashboard");
        } else {
            setErrorMsg(result.msg || "Erro ao fazer o login")
        }
    }

    const handleClickRegister = (values) => {
        Axios.post("http://localhost:3001/register", {
            email: values.email,
            password: values.password,
        }).then((response) => {
            console.log(response);
            alert(response.data.msg);
        });
    }

    const validationLogin = yup.object().shape({
        email: yup.string().email("Este email não é valido").required(),
        password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required(),
    });

    const validationRegister = yup.object().shape({
        email: yup.string().email("Este email não é valido").required(),
        password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required(),
        confirmPassword: yup.string().oneOf([yup.ref("password"), null], "As senhas não coincidem")
    });
    return (
    <div>
        <div className="containerLogin">
            <h1>Login</h1>
            <Formik
            initialValues={{}} onSubmit={handleClickLogin} validationSchema={validationLogin}
            >
                <Form className="login-form">
                    <div className="login-form-group"> 
                        <Field name="email" className="form-field" placeholder="Email" />
                        <ErrorMessage
                        component="span"
                        name="email"
                        className="form-error"
                        />
                    </div>

                    <div className="login-form-group"> 
                        <Field name="password" className="form-field" placeholder="Senha" />
                        <ErrorMessage
                        component="span"
                        name="password"
                        className="form-error"
                        />
                    </div>
                    <button className="buttonLogin" type="submit">Login</button>
                </Form>
            </Formik>
            <h1>Cadastro</h1>
            <Formik
            initialValues={{}} onSubmit={handleClickRegister} validationSchema={validationRegister}
            >
                <Form className="register-form">
                    <div className="register-form-group"> 
                        <Field name="email" className="form-field" placeholder="Email" />
                        <ErrorMessage
                        component="span"
                        name="email"
                        className="form-error"
                        />
                    </div>

                    <div className="register-form-group"> 
                        <Field name="password" className="form-field" placeholder="Senha" />
                        <ErrorMessage
                        component="span"
                        name="password"
                        className="form-error"
                        />
                    </div>

                    <div className="register-form-group"> 
                        <Field name="confirmPassword" className="form-field" placeholder="Confirme sua senha" />
                        <ErrorMessage
                        component="span"
                        name="confirmPassword"
                        className="form-error"
                        />
                    </div>
                    <button className="buttonRegister" type="submit">Registrar</button>
                </Form>
            </Formik>
        </div>
    </div>
    );
}

export default Auth
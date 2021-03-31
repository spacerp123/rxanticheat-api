import Head from 'next/head';
import styles from '../../static/styles/add.module.css';
import { FaAngleRight, FaAngleDown } from 'react-icons/fa';
import { MdError, MdCheckCircle } from 'react-icons/md';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';


export default function Index() {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationResponse, setNotificationResponse] = useState({
    status: 201,
    message: "Mensagem aqui"
  });
  const [selectedOption, setSelectedOption] = useState("Tipo de Licença");
  const [password, setPassword] = useState("");
  const [license, setLicense] = useState("");
  const [ip, setIp] = useState("");
  const [selectedValue, setSelectedValue] = useState(0);
  const detailsRef = useRef(null);
  function openDetails() {
    setOpen(!open);
  }
  function changeValue(ev) {
    setSelectedOption(ev.target.getAttribute("selectname"))
    setSelectedValue(ev.target.value);
    detailsRef.current.open = false;
    setOpen(false);
  }
  function changePassword(ev) {
    setPassword(ev.target.value)
  }
  function changeLicense(ev) {
    setLicense(ev.target.value)
  }
  function changeIp(ev) {
    setIp(ev.target.value)
  }
  function generateLicense() {
      var result           = "RxAnticheat:";
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < 16; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }
  async function submit(ev) {
    ev.preventDefault();
    if (selectedValue <= 0) {
      setNotificationResponse({
        status: 400,
        message: "Data de expiração inválida!"
      });
      setNotification(true);
      return;
    }
    await axios.post("https://rxanticheat-api.vercel.app/api/licenses/createLicense", {
      license,
      ip,
      daysToExpire: selectedValue,
      password
    }).then(response => {
      setNotificationResponse({
        status: response.status,
        message: response.data.message
      });
      setPassword("");
      setIp("");
      setLicense("");
      setSelectedOption("Tipo de Licença");
      setSelectedValue(0);
      setNotification(true);
    }).catch(error => {
      setNotificationResponse({
        status: error.response.status,
        message: error.response.data.message || "Houve um erro"
      });
      setNotification(true);
    });
    
  }
  useEffect(() => {
    setLicense(generateLicense);
  }, [])
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "100%", backgroundColor: "#020202" }}>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p className={styles.rx_title} style={{ color: '#63edf7' }}>RxAnticheat</p>
        <span className={styles.rx_title} style={{ marginBottom: '16px', color: '#eeeeee' }}>Criar Licença</span>
      </div>
      {notification &&
      <div id={styles.rx_notify} className={notificationResponse.status == 201 ? styles.ok : styles.error}>
        {notificationResponse.status == 201 ? <MdCheckCircle color="#36c95e" className={styles.rx_response_icon}/> : <MdError color="#db5d4f" className={styles.rx_response_icon}/>}
        <p style={{color: "#dddddd"}}>{notificationResponse.message}</p>
      </div>
      }
      <form id={styles.form_add_license} onSubmit={submit}>
        <input className={styles.rx_input} required readOnly type="text" placeholder="Licença" value={license}/>
        <input className={styles.rx_input} required onChange={changeIp} type="text" placeholder="Endereço de IP" value={ip}/>
        <input className={styles.rx_input} required onChange={changePassword} type="password" placeholder="Senha Chave" value={password}/>
        <div id={styles.rx_details_select}>
          <details id={styles.rx_select_days} ref={ref => detailsRef.current = ref}>
            <summary style={{display: 'flex', alignItems: 'center', outline: 'none'}} onClick={openDetails}>{ open ? <FaAngleDown className={styles.angle_icon}/> : <FaAngleRight className={styles.angle_icon}/>}{selectedOption}</summary>
            <ul>
              <li onClick={changeValue} selectname="Licença Diária" value="1">Licença Diária</li>
              <li onClick={changeValue} selectname="Licença Semanal" value="7">Licença Semanal</li>
              <li onClick={changeValue} selectname="Licença Mensal" value="30">Licença Mensal</li>
              <li onClick={changeValue} selectname="Licença Trimestral" value="90">Licença Trimestral</li>
              <li onClick={changeValue} selectname="Licença Semestral" value="180">Licença Semestral</li>
              <li onClick={changeValue} selectname="Licença Anual" value="365">Licença Anual</li>
              <li onClick={changeValue} selectname={"Licença Lifetime"} value="9999999">Licença Lifetime</li>
            </ul>
          </details>
        </div>
        <button id={styles.rx_create_button} type="submit">Criar Licença</button>
      </form>
    </div>
  )
}

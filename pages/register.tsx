import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useUserContext } from "../context/userContext";
import styles from '../styles/Home.module.css'

let errors: any[];

const newAccountHandler = async (event:any) => {
  event.preventDefault();
  const name = event.target.name.value;
  const username = event.target.username.value;
  const password = event.target.password.value;
  const res = await fetch('https://vef2-20222-v3-synilausn.herokuapp.com/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, username, password }),
  })

  const result = await res.json();

  return result;
}

export default function Home() {
  const loginContext = useUserContext();
  const [fail, setFail] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
      <Head>
        <title>Nýskráning</title>
      </Head>
      <h1>Nýskráning</h1>
      {
        success ? (
        <>
          <p>Nýskráning tókst</p>
          <Link href='/login'>Skráðu þig inn</Link>
        </>
        ) : (
      <form onSubmit={async (event) => {
        event.preventDefault();
        const user = await newAccountHandler(event);

        if(user.errors){
          setFail(true);
          errors = user.errors;
        } else {
          setSuccess(true);
        }
      }}>

        {
          fail ? ( 
          <ul>
            {errors.length > 0 && errors.map((error, i) => {
            return (
            <li key={i}>
              <p>{error.msg}</p>
            </li>
            )
          })}
          </ul> 
          ) : <p></p>
        }
        <label htmlFor='name'>Nafn:</label><br/>
        <input type='text' id='name'/><br/>
        <label htmlFor='username'>Notendanafn:</label><br/>
        <input type='text' id='username'/><br/>
        <label htmlFor='password'>Lykilorð:</label><br/>
        <input type='password' id='password'/><br/>
        <button>Nýskrá</button>
      </form>
        )}

      <footer className={styles.footer}>
          <Link href='/'><a>Forsíða</a></Link>
          {
            loginContext.state.login.login ? <p>Skráður inn sem <b>{loginContext.state.login.user.user.name}</b></p> : <Link href='/login'>Innskráning</Link>
          }
          {
            loginContext.state.login.login ? <button onClick={loginContext.toggleLogin}>Útskrá</button> : <Link href='/register'>Nýskráning</Link>
          }
        </footer>
      </main>
    </div>
  )
}

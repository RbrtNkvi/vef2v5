import Head from "next/head"
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { useUserContext } from "../context/userContext";
import styles from '../styles/Home.module.css';

type Event = any;

const loginHandler = async (event: Event) =>{
  event.preventDefault();
  const username = event.target.username.value;
  const password = event.target.password.value;
  const res = await fetch('https://vef2-20222-v3-synilausn.herokuapp.com/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const result = await res.json();

  return result;
}

export default function Home() {
  const loginContext = useUserContext();
  const [fail, setFail] = useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>Innskráning</title>
      </Head>
      <main className={styles.main}>
      <h1>Innskráning</h1>
      <form onSubmit={async (event) => { 
        event.preventDefault();
        const user = await loginHandler(event);

        if(user.user !== undefined) {
          loginContext.state.setLogin({ login: true, user: user });
          localStorage.setItem("user", JSON.stringify({ login: true, user: user }));
          setFail(false);
          Router.push('/');
        } else {
          setFail(true);
        }
      }}>
        <label htmlFor='username'>Notendanafn:</label><br/>
        <input type='text' id='username'/><br/>
        <label htmlFor='password'>Lykilorð:</label><br/>
        <input type='password' id='password'/><br/>
        {
          fail ? <p>Invalid user/password</p> : <p></p>
        } 
        <button type="submit">Innskrá</button>
      </form>

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

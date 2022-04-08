import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useUserContext } from "../context/userContext";

type Registrations = Array<{
  id: number,
  username: String,
  name: String,
  comment: String,
}>

type Event = {
  data:{
    id: number,
    name: String,
    slug: String,
    description: String,
    creatorid: number,
    created: String,
    updated: String,
    registrations: Registrations,
  }
  notfound: boolean,
  id: number,
}

export default function Home( { data, notfound, id }: Event) {
  const loginContext = useUserContext();
  const [registered,setRegistered] = useState(false);

  if(notfound) {
    return (
      <p>404</p>
    )
  }

  return (
    <div>
      <Head>
        <title>{data.name}</title>
      </Head>

      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <p>Skráningar:</p>

      <section>
        <ul>
          {data.registrations.length === 0 && (
            <li>Engar skráningar</li>
          )}
          {data.registrations.length > 0 && data.registrations.map((reg, i) => {
            return (
            <li key={i}>
              <b>{reg.name}</b>
              <p>{reg.comment}</p>
            </li>
            )
          })}
        </ul>
      </section>

      {
        loginContext.state.login.login ?
      ( 
        registered ?
        (
        <>
          <p>Þú hefur skráð þig á þennan viðburð</p>
          <button>Afskrá</button>
        </>
        ) :
        (
        <form onSubmit={ async (event: any) => {
          event.preventDefault();
          const comment = event.target.comment.value;
          const name = loginContext.state.login.user.user.name;
          const token = loginContext.state.login.user.token;
          const res = await fetch(`https://vef2-20222-v3-synilausn.herokuapp.com/${id}/register`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name, comment}),
          });
          const result = await res.json();
          if(!result) {

          } else {
            setRegistered(true);
          }
        }}>
          <label htmlFor='comment'>Athugasemd:</label><br/>
          <input type='text' id='comment'></input>
          <button type='submit'>Skrá mig</button>
        </form>
        ) 
      ) : (
        <>
          <p>Skráðu þig inn til að skrá þig á viðburðinn</p>
          <button onClick={async (event) => {
            
          }}></button>
        </>
      ) 
      } 

      <footer>
          <Link href='/'><a>Forsíða</a></Link>
          {
            loginContext.state.login.login ? <p>Skráður inn sem <b>{loginContext.state.login.user.user.name}</b></p> : <Link href='/login'>Innskráning</Link>
          }
          {
            loginContext.state.login.login ? <button onClick={loginContext.toggleLogin}>Útskrá</button> : <Link href='/register'>Nýskráning</Link>
          }
        </footer>
    </div>
  )
}

export async function getServerSideProps({ params }: any) {
  const { id } = params;
  
  const res = await fetch(`https://vef2-20222-v3-synilausn.herokuapp.com/events/${id}`);
  const data = await res.json();

  if(res.status !== 200) {
    return {
      props: {
        notfound: true,
      }
    }
  }

  return {
    props: {
      data,
      notfound: false,
      id,
    }
  }
}
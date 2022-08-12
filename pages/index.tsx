import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Din Din</title>
        <meta
          name="description"
          content="Eat food with friends. Let Din Din help with the cat herding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Din Din</h1>

        <p className={styles.description}>Let's eat at my place.</p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Location</h2>
            <input type="text"></input>
          </div>

          <div className={styles.card}>
            <h2>Date</h2>
            <input type="date"></input>
          </div>

          <div className={styles.card}>
            <h2>Time</h2>
            <input type="time"></input>
          </div>

          <div className={styles.card}>
            <h2>Capacity</h2>
            <p>
              Min: <input type="number" value="3"></input>
            </p>
            <p>
              Max: <input type="number" value="20"></input>
            </p>
            <input type="range" min="0" max="20" value="7"></input>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;

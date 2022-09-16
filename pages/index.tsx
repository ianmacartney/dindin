import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Calendar from "react-calendar";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";

const Home: NextPage = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState<string>(
    tomorrow.toISOString().split("T")[0]
  );
  const [time, setTime] = useState<string>("19:00");
  const [location, setLocation] = useState<string>("TBD");
  const [minCapacity, setMinCapacity] = useState(3);
  const [maxCapacity, setMaxCapacity] = useState(15);
  const [targetCapacity, setTargetCapacity] = useState(6);

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

        <p className={styles.description}>Let&apos;s eat at my place.</p>

        <div className={styles.grid}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log({ date, time });
            }}
          >
            <div className={styles.card}>
              <h2>Location</h2>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              ></input>
            </div>

            <div className={styles.card}>
              <h2>Date</h2>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              ></input>
            </div>

            <div className={styles.card}>
              <h2>Time</h2>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                }}
              ></input>
            </div>

            <div className={styles.card}>
              <h2>Capacity</h2>
              <p>
                Min:{" "}
                <input
                  type="number"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(Number(e.target.value))}
                ></input>
                <br />
                Target:
                {" " +
                  Math.max(Math.min(targetCapacity, maxCapacity), minCapacity)}
                <input
                  type="range"
                  min={minCapacity}
                  max={maxCapacity}
                  value={targetCapacity}
                  onChange={(e) => setTargetCapacity(Number(e.target.value))}
                ></input>
                <br />
                Max:{" "}
                <input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(Number(e.target.value))}
                ></input>
              </p>
            </div>
            <input type="submit" />
          </form>
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

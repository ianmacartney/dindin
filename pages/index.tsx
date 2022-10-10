import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { useMutation } from "../convex/_generated/react";
import { useAuth0 } from "@auth0/auth0-react";
import { Id } from "../convex/_generated/dataModel";

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
  const addDinner = useMutation("addDinner");
  const { logout } = useAuth0();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation("storeUser");
  // Call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    // Store the user in the database.
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }
    createUser();
    return () => setUserId(null);
  }, [storeUser]);
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
        <button onClick={() => logout()}> Log Out </button>

        <p className={styles.description}>Let&apos;s eat at my place.</p>

        <div className={styles.grid}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const startDate = new Date(date + " " + time);
              const startTime = startDate.getTime() / 1000;
              addDinner({
                address: location,
                targetCapacity,
                calendarInvite: null,
                maxCapacity,
                minCapacity,
                startTime,
                reminders: [],
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              }).then(console.log);
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

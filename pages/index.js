import Head from 'next/head';

export default function Index() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#020202"}}>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "42px", fontWeight: "bold"}}>RxAnticheat - API</p>
    </div>
  )
}

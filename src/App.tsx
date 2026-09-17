import { useState, useEffect, useCallback } from "react";
import Layout from "./components/Layout";
import NaraSwap from "./components/NaraSwap";
import CommitStation from "./components/CommitStation";
import GridDeckStation from "./components/GridDeckStation";
import VaultStation from "./components/VaultStation";
import TacticalDock from "./components/TacticalDock";
import MintRevealModal from "./components/MintRevealModal";
import { GridProvider } from "./context/GridContext";

export default function App() {
  const getInitialRoute = () => {
    if (typeof window === "undefined") return "/";
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === "/meme" || path === "/meme/" || hash === "#/meme" || hash === "#meme") {
      window.location.replace("/meme.html");
      return "/";
    }
    if (path === "/swap" || hash === "#/swap" || hash === "#swap") {
      return "/";
    }
    if (
      path === "/activate" ||
      hash === "#/activate" ||
      hash === "#activate" ||
      path === "/commit" ||
      hash === "#/commit" ||
      hash === "#commit" ||
      path === "/join" ||
      hash === "#/join" ||
      hash === "#join"
    ) {
      return "/activate";
    }
    if (
      path === "/grid" ||
      hash === "#/grid" ||
      hash === "#grid" ||
      path === "/deck" ||
      hash === "#/deck" ||
      hash === "#deck" ||
      path === "/station" ||
      hash === "#/station" ||
      hash === "#station"
    ) {
      return "/grid";
    }
    if (
      path === "/vault" ||
      hash === "#/vault" ||
      hash === "#vault" ||
      path === "/positions" ||
      hash === "#/positions" ||
      hash === "#positions" ||
      path === "/nfts" ||
      hash === "#/nfts" ||
      hash === "#nfts" ||
      path === "/nft" ||
      hash === "#/nft" ||
      hash === "#nft"
    ) {
      return "/vault";
    }
    return "/";
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);

  const navigate = useCallback((targetPath: string) => {
    setCurrentRoute(targetPath);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", targetPath);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  return (
    <GridProvider currentRoute={currentRoute} navigate={navigate}>
      <Layout
        headerProps={{
          currentPath: currentRoute,
          onNavigate: navigate,
        }}
      >
        {currentRoute === "/activate" || currentRoute === "/commit" ? (
          <CommitStation />
        ) : currentRoute === "/grid" ? (
          <GridDeckStation />
        ) : currentRoute === "/vault" ? (
          <VaultStation />
        ) : (
          <NaraSwap />
        )}
        <TacticalDock />
      </Layout>
      <MintRevealModal />
    </GridProvider>
  );
}


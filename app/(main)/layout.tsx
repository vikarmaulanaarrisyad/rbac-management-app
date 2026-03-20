import React from "react";
import Header from "../components/layout/Header";
import BottomNav from "../components/layout/BottomNav";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header user={null} />
      <div className="pb-20">{children}</div>
      <BottomNav />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
};

export default MainLayout;

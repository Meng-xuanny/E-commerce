import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar, Sidebar } from "../components";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const Layout = () => {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <Wrapper>
        <h1>Loading....</h1>
      </Wrapper>
    );
  }
  if (error) {
    return (
      <Wrapper>
        <h1>{error.message}</h1>
      </Wrapper>
    );
  }
  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
      <Footer />
    </>
  );
};

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
`;

export default Layout;

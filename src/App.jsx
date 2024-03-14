import { createGlobalStyle } from "styled-components";
import Home from "./components/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blogs from "./components/blogs";
import Project from "./components/project";
import About from "./components/about";
import UnderConst from "./components/underConst";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home}/>
        <Route path="/home" Component={Home}/>
        <Route path="/blogs" Component={Blogs}/>
        <Route path="/projects" Component={Project}/>
        <Route path="/about" Component={UnderConst}/>
      </Routes>
    </BrowserRouter>

      </>
  );
}

export default App;

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
  }

  body {
    background-color: #f5f5f5;
    overflow-x: hidden;
  }
  
  html {
    
    scroll-behavior: smooth;
  }

  ::-webkit-scrollbar {
    width: 0;
  }

  :root {
    --text: #111111;
    --backg: #f5f5f5;
  }
`;

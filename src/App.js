import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import AddEdit from "./pages/AddEdit";
import View from "./pages/View";
import AddOperator from "./pages/AddOperator";
import Home from "./pages/Home";
import OperatorList from "./pages/OperatorList";
import ViewOperator from "./pages/ViewOperator";
import Test from "./pages/test";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from './img/livreur.jpg'


function App() {
  return (

    <BrowserRouter>
      <div className="App" style={{ backgroundImage: `url(${background})`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }} >
        <Header></Header>
        <ToastContainer postition="top-center"></ToastContainer>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/add" element={<AddEdit />}></Route>
          <Route path="/addOperator" element={<AddOperator />}></Route>
          <Route path="/operatorList" element={<OperatorList />}></Route>
          <Route path="/update/:id" element={<AddEdit />}></Route>
          <Route path="/view" element={<View />}></Route>
          <Route path="/view/:id" element={<View />}></Route>
          <Route path="/viewOperator" element={<ViewOperator />}></Route>
          <Route path="/viewOperator/:id" element={<ViewOperator />}></Route>
          <Route path="/test" element={<Test />}></Route>
        </Routes>
      </div>
    </BrowserRouter>

  );
}
export default App;

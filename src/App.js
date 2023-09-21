import Login from "./components/Login";
import Register from "./components/Register";
import AddArticle from "./components/AddArticle";
import ArticleTable from "./components/ArticleTable";
import NoMatch from "./components/NoMatch";
import PrivateRoutes from "./components/PrivateRoutes";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="index" element={<ArticleTable />} />
            <Route path="new-article" element={<AddArticle />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

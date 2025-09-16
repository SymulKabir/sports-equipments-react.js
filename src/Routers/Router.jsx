import Home from "../Pages/Home";
import MainLayout from "../Layout/MainLayout";
import Login from "../Pages/Login.jsx";
import Registration from "../Pages/Registration.jsx";
import { createBrowserRouter } from "react-router";
import PrivateRouter from "./PrivateRouter";
import AllProducts from "../Pages/AllProducts";
import MyEquipment from "../Pages/MyEquipment.jsx";
import ProductDetails from "../Components/ProductDetails";
import AddEquipment from "../Pages/AddEquipment.jsx";
import UpdateEquipment from "../Components/UpdateEquipment";
import Error from "../Pages/Error.jsx";
import Contact from "../Pages/Contact.jsx";
import About from "../Pages/About.jsx";
import {BACKEND_URL} from '../shared/constants/variables/metadata.js'

// Updated router definition
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
        loader:()=>fetch(`${BACKEND_URL}/data-limit`)
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/all-products",
        element: <AllProducts />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/equipment/:id",
        element: (
          
           <ProductDetails />
         
        ),
        loader: ({ params }) => fetch(`${BACKEND_URL}/data/${params._id}`)

      },
      {
        path: "/update-equipment/:id",
        element: (
          <PrivateRouter>
            <UpdateEquipment />
          </PrivateRouter>
        ),

      },
      
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/add-equipment",
        element: (
          <PrivateRouter>
            <AddEquipment />
          </PrivateRouter>
        ),
      },
      {
        path: "/my-equipment",
        element: (
          <PrivateRouter>
            <MyEquipment />
          </PrivateRouter>
        ),
      },
    ],
    errorElement: <Error></Error>
  },
]);

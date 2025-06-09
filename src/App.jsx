import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import Header from "./components/Header.jsx";
import Meals from "./components/Meals.jsx";
import { CartContextProvider } from "./store/CartContext.jsx";
import { UserProgressContextProvider } from "./store/UserProgressContext.jsx";
import Orders from "./components/orders/Orders.jsx";


function App() {
    const {tableName}= useParams();
    console.log("table name from param is ",tableName);
    return (
        <Router>
            <Routes>
                <Route
                    path="/:tableNumber"
                    element={
                        <UserProgressContextProvider>
                            <CartContextProvider>
                                <Header />
                                <Meals />
                                <Cart />
                                <Checkout />
                            </CartContextProvider>
                        </UserProgressContextProvider>
                    }
                />
                <Route path="/orders" element={<Orders />} />
            </Routes>
        </Router>
    );
}

export default App;

// import React, { useState, useEffect } from "react";
// import Swal from "sweetalert"; // Import SweetAlert
// import { db } from "../../config/firebase.js";
// import { getDocs, collection, deleteDoc, doc } from "firebase/firestore"; // Import doc function
// import "./orders.css"; // Import CSS file
// import Button from "../UI/Button.jsx";
// import { auth } from "../../config/firebase.js";

// function Orders() {
//     const [ordersList, setOrdersList] = useState([]);

//     const ordersCollectionRef = collection(db, "orders");
//     const getOrdersList = async () => {
//         try {
//             const data = await getDocs(ordersCollectionRef);
//             console.log("orders collection data fetched is ",data.docs.map((doc)=> console.log(doc.data())))
//             const filteredData = data.docs.map((doc) => ({
//                 id: doc.id, // Access the document ID
//                 ...doc.data(),
//             }));

//             // Sort the orders from newest to oldest
//             const sortedData = filteredData.sort(
//                 (a, b) => b.orderDate - a.orderDate
//             );

//             setOrdersList(sortedData);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const deleteOrder = async (orderId) => {
//         try {
//             await deleteDoc(doc(db, "orders", orderId)); // Use doc function to create reference
//             // Update state to remove the deleted order
//             setOrdersList(ordersList.filter((order) => order.id !== orderId));
//             Swal({
//                 icon: "success",
//                 title: "Done",
//                 text: "Succesfully deleted.",
//             });
//         } catch (err) {
//             console.error(err);
//             // Display SweetAlert notification
//             Swal({
//                 icon: "warning",
//                 title: "An error occurred while deleting the order.",
//                 text: "Sign out and login with admin phone number.",
//                 timer: 2000, // Duration in milliseconds
//                 timerProgressBar: true, // Show progress bar
//                 toast: true,
//                 position: "top-right",
//                 button: false,
//             });
//         }
//     };

//     useEffect(() => {
//         getOrdersList();
//     }, []);
   
//     return (
//         <div className="container">
//             <h2>Orders</h2>
//             <Button
//                 onClick={() => (window.location.href = "/")}
//                 className="button">
//                 Go to Home
//             </Button>
       
//             <ul className="list">
//                 {ordersList.map((order) => (
//                     <li key={order.id} className="item">
//                         <div className="details">
//                             <h3>Name: {order.name}</h3>
//                             <h3>Price: ₹{order.price}</h3>
//                             <h3>Quantity: {order.quantity}</h3>
//                             <h3>Total: ₹{order.quantity * order.price}</h3>
//                             <h3>
//                                 Name : {order.userName}
//                             </h3>
//                             <h3>
//                                 Order Date:
//                                 {order.orderDate
//                                     ? new Date(
//                                           order.orderDate.seconds * 1000
//                                       ).toLocaleString("tr-TR", {
//                                           year: "numeric",
//                                           month: "2-digit",
//                                           day: "2-digit",
//                                           hour: "2-digit",
//                                           minute: "2-digit",
//                                           second: "2-digit",
//                                       })
//                                     : "Invalid Date"}
//                             </h3>
//                             <h3>Table Number: {order.tableNumber}</h3>
//                         </div>
//                         {auth?.currentUser?.phoneNumber == "+905550005500" && (
//                             <button
//                                 className="delete-button"
//                                 onClick={() => deleteOrder(order.id)}>
//                                 Delete
//                             </button>
//                         )}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default Orders;



import React, { useState, useEffect } from "react";
import Swal from "sweetalert"; // Import SweetAlert
import { db } from "../../config/firebase.js";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import "./orders.css"; // Import CSS file (make sure spinner styles and order card styles are here)
import Button from "../UI/Button.jsx";
import { auth } from "../../config/firebase.js";

function Orders() {
  // State variables for orders and loading status
  const [ordersList, setOrdersList] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const ordersCollectionRef = collection(db, "orders");

  // Function to fetch orders from Firestore and sort them by order date (newest first)
  const getOrdersList = async () => {
    try {
      const data = await getDocs(ordersCollectionRef);
      const ordersData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedData = ordersData.sort((a, b) => b.orderDate - a.orderDate);
      setOrdersList(sortedData);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Delete an order by its ID
  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrdersList((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      Swal({
        icon: "success",
        title: "Done",
        text: "Successfully deleted.",
      });
    } catch (err) {
      console.error(err);
      Swal({
        icon: "warning",
        title: "An error occurred while deleting the order.",
        text: "Sign out and login with admin phone number.",
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        position: "top-right",
        button: false,
      });
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch orders on component mount
  useEffect(() => {
    getOrdersList();
  }, []);

  // Display spinner if auth or orders are loading
  if (authLoading || ordersLoading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // If no user is logged in after loading is complete, show sign-in prompt.
  if (!currentUser) {
    return (
      <div className="container">
        <h2>Orders</h2>
        <p>Please sign in to view your orders.</p>
        <Button onClick={() => (window.location.href = "/")} className="button">
          Go to Home
        </Button>
      </div>
    );
  }

  // Filter orders: only orders matching the current user's email.
  const filteredOrders = ordersList.filter(
    (order) => order.userEmail === currentUser.email
  );

  return (
    <div className="container">
      <h2>Orders</h2>
      <Button onClick={() => (window.location.href = "/:tableNumber")} className="button">
        Go to Home
      </Button>
      <ul className="list">
        {filteredOrders.map((order) => (
          <li key={order.id} className="item">
            <div className="order-details">
            <h3>  Order Status: {order?.orderStatus}</h3>
              <h3>
                Order Date:{" "}
                {order.orderDate
                  ? new Date(order.orderDate.seconds * 1000).toLocaleString(
                      "tr-TR",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )
                  : "Invalid Date"}
              </h3>
              <h3>Table Number: {order.tableNumber}</h3>
              <h3>Total Amount: ₹{order.totalAmount}</h3>
              <h3> Order items are :</h3>
              <ul className="order-items">
                {order.items && order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - ₹{item.price} x {item.quantity}  = {item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Optionally include delete button for admin */}
            {/* {currentUser?.phoneNumber === "+905550005500" && (
              <Button onClick={() => deleteOrder(order.id)}>
                Delete Order
              </Button>
            )} */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;

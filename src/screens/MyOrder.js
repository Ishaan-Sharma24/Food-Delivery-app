import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
    const [orderData, setOrderData] = useState({});

    // const fetchMyOrder = async () => {
    //     try {
    //         const response = await fetch("http://localhost:5000/api/myOrderData", {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 email: localStorage.getItem('userEmail')
    //             })
    //         });

    //         if (response.ok) {
    //             const responseData = await response.json();
    //             setOrderData(responseData.OrderData && Array.isArray(responseData.OrderData.order_data) ? responseData.OrderData : []);

    //         } else {
    //             console.error(`Failed to fetch data. Status: ${response.status}`);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };

    const [loading, setLoading] = useState(true);

    const fetchMyOrder = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/myOrderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: localStorage.getItem('userEmail')
                })
            });

            if (response.ok) {
                const responseData = await response.json();

                console.log("Response Data:", responseData);
                if (responseData !== undefined) {
                    setOrderData(responseData.OrderData || { OrderData: { order_data: [] } });
                } else {
                    console.error("Response data is undefined.");
                }
            } else {
                console.error(`Failed to fetch data. Status: ${response.status}`);
                // Handle the error here if needed
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle the error here if needed
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    if (loading) {
        // You can show a loading indicator here if needed
        return <p>Loading...</p>;
    }
    const parseOrderData = (orderDataString) => {
        try {
          return JSON.parse(orderDataString);
        } catch (error) {
          console.error("Error parsing order data:", error);
          return [];
        }
      };
  

      return (
        <div>
            <Navbar />
            <div className='container'>
                {loading ? (
                    <p>Loading...</p>
                ) : orderData.order_data.length > 0 ? (
                    <div className='row'>
                        {orderData.order_data.map((itemArray, index) => (
                            <div key={index} className='col-12 col-md-6 col-lg-3'>
                                <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                    {itemArray.map((item) => (
                                        <div key={item.id}>
                                            <img src={item.img} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill" }} />
                                            <div className="card-body">
                                                <h5 className="card-title">{item.name}</h5>
                                                <div className='container w-100 p-0' style={{ height: "38px" }}>
                                                    <span className='m-1'>{item.qty}</span>
                                                    <span className='m-1'>{item.size}</span>
                                                    <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                        ₹{item.price}/-
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No order data available.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}

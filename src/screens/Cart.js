import React from 'react';
import Delete from '@material-ui/icons/Delete';
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
      </div>
    );
  }

  // Handle checkout and serialize data
  const handleCheckOut = async () => {
    const userEmail = localStorage.getItem('userEmail');
   // const orderDate = new Date().toDateString();
  
    try {
      const response = await fetch('http://localhost:5000/api/orderData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
         
        }),
      });
  
      if (response.ok) {
        dispatch({ type: 'DROP' });
      } else {
        console.error(`Failed to fetch data. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // Calculate total price
  let totalPrice = data.reduce((total, food) => {
    const foodPrice = Number(food.price);
  
    if (!isNaN(foodPrice)) {
      return total + foodPrice;
    } else {
      console.error(`Invalid price for food item: ${JSON.stringify(food)}`);
      return total;
    }
  }, 0);


  return (
    <div>
      <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
        <table className='table table-hover'>
          <thead className='text-success fs-4'>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Option</th>
              <th scope='col'>Amount</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{food.name || 'N/A'}</td>
                <td>{food.qty || 'N/A'}</td>
                <td>{food.size || 'N/A'}</td>
                <td>{food.price || 0}</td>
                <td>
                  <button
                    type='button'
                    className='btn p-0'
                    onClick={() => {
                      dispatch({ type: 'REMOVE', index: index });
                    }}
                  >
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h1 className='fs-2'>Total Price: {totalPrice}/-</h1>
        </div>
        <div>
          <button className='btn bg-success mt-5' onClick={handleCheckOut}>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}

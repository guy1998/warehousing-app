import React, { useEffect, useState } from 'react';
import '../assets/stats.css';
import { CircularProgress } from '@mui/material';

const calculateTotalAmount = async (sales) => {
  if (sales.length)
    return sales.reduce((acc, sale) => {
      let amount = 0;
      sale.soldProducts.forEach((element) => {
        amount = parseFloat(amount) + parseFloat(element.soldPrice.$numberDecimal) * element.quantity;
      });
      return parseFloat(acc) + parseFloat(amount);
    }, 0);
  return 0;
};

const calculateTotalNrOfProducts = async (sales) => {
  if (sales.length)
    return sales.reduce((acc, sale) => {
      return acc + sale.soldProducts.length;
    }, 0);
  return 0;
};

function TotalSalesStats({ sales }) {
  const [firstLoading, setFirstLoading] = useState(true);
  const [secondLoading, setSecondLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    calculateTotalAmount(sales).then((amount) => {
      setFirstLoading(false);
      setTotalAmount(amount);
    });
    calculateTotalNrOfProducts(sales).then((products) => {
      setSecondLoading(false);
      setTotalProducts(products);
    });
  }, [sales]);

  return (
    <div style={{ display: 'flex', marginTop: '15px' }}>
      <div className="stats shadow">
        <div className="stat">
          {!firstLoading ? (
            <>
              <div className="stat-title">Total Amount</div>
              <div className="stat-value">${totalAmount}</div>
            </>
          ) : (
            <CircularProgress color="success" />
          )}
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          {!secondLoading ? (
            <>
              <div className="stat-title">Total Products</div>
              <div className="stat-value">{totalProducts}</div>
            </>
          ) : (
            <CircularProgress color="success" />
          )}
        </div>
      </div>
    </div>
  );
}

export default TotalSalesStats;

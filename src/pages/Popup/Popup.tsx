import React from 'react';
import { Coupon, RowCoupon } from '../../type';
import './Popup.css';

interface PopupProps {
  rowCoupons: RowCoupon[];
  isLoading: boolean;
  error: string | null;
}

const Popup: React.FC<PopupProps> = ({ rowCoupons, isLoading, error }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/pages/Popup/Popup.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
        <button
          onClick={() => {
            chrome.runtime.sendMessage({
              action: 'OPEN_SITE_UDEMY',
              url: 'https://www.udemy.com',
            });
          }}
        >
          Open New Tab
        </button>
      </header>
      <div>
        {rowCoupons.map((rowCoupon: RowCoupon) => {
          const coupon: Coupon = rowCoupon.coupon;
          return (
            <div key={rowCoupon.id}>
              <h3>{coupon.title}</h3>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Popup;

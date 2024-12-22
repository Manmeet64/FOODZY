import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./Cart.module.css";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken";
import Item from "../../components/Item/Item";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Cart = () => {
    const { restaurantId } = useParams();
    const [order, setOrder] = useState(null);
    const [total, setTotal] = useState(0);
    const [showCoupons, setShowCoupons] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const idToken = useFirebaseIdToken();
    const couponRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                couponRef.current &&
                !couponRef.current.contains(event.target)
            ) {
                setShowCoupons(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getApplicableCoupons = (totalAmount) => {
        const availableCoupons = [];
        if (totalAmount >= 300 && totalAmount < 350) {
            availableCoupons.push({ code: "FZ30", discount: 30 });
        } else if (totalAmount >= 350 && totalAmount < 400) {
            availableCoupons.push({ code: "FZ50", discount: 50 });
        } else if (totalAmount >= 400) {
            availableCoupons.push({ code: "FZ70", discount: 70 });
        }
        return availableCoupons;
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/orders/pending/${restaurantId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = await response.json();

                if (data.success && data.order) {
                    setOrder(data.order);
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };

        if (idToken) fetchOrder();
    }, [restaurantId, idToken]);

    useEffect(() => {
        if (order?.items) {
            const newTotal = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            setTotal(newTotal);
        }
    }, [order]);

    const handleRemoveDiscount = () => {
        setCouponCode("");
        setAppliedDiscount(0);
    };

    const handleCouponSelect = (coupon) => {
        setCouponCode(coupon.code);
        setShowCoupons(false);
    };

    const handleApplyCoupon = () => {
        const selectedCoupon = getApplicableCoupons(total).find(
            (c) => c.code === couponCode
        );
        if (selectedCoupon) {
            setAppliedDiscount(selectedCoupon.discount);
        }
    };

    // Calculate delivery charge based on total price
    const deliveryCharge =
        total <= 250 ? total * 0.25 : total <= 500 ? total * 0.15 : total * 0.1;

    const finalTotal = total + deliveryCharge - appliedDiscount;

    const handleCheckout = async () => {
        console.log("Proceeding to checkout");
        console.log(order);
        try {
            const response = await fetch(
                `http://localhost:8000/orders/checkout/${order.orderId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: order.items,
                        deliveryCharge,
                        finalTotal,
                        restaurantId,
                        couponCode,
                    }),
                }
            );

            const data = await response.json();

            if (data.id) {
                // Redirect to Stripe Checkout
                const stripe = await loadStripe(
                    "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3"
                );
                await stripe.redirectToCheckout({ sessionId: data.id });
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.cartContainer}>
                <h1 className={styles.cartTitle}>My Cart</h1>
                <div className={styles.cartContent}>
                    <div className={styles.itemsSection}>
                        {order?.items?.map((item) => (
                            <Item
                                key={item.id}
                                item={item}
                                restaurantId={restaurantId}
                                idToken={idToken}
                                order={order}
                                setOrder={setOrder}
                            />
                        ))}
                    </div>

                    <div className={styles.cartActions}>
                        <div className={styles.cartSummary}>
                            <h3>Cart Total</h3>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>
                                    Delivery Charge (
                                    {total <= 250
                                        ? "25%"
                                        : total <= 500
                                        ? "15%"
                                        : "10%"}
                                    )
                                </span>
                                <span>₹{deliveryCharge.toFixed(2)}</span>
                            </div>
                            {appliedDiscount > 0 && (
                                <div
                                    className={`${styles.summaryRow} ${styles.discountRow}`}
                                >
                                    <div className={styles.discountInfo}>
                                        <span>
                                            Discount Applied ({couponCode})
                                        </span>
                                        <button
                                            onClick={handleRemoveDiscount}
                                            className={styles.removeDiscount}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <span>-₹{appliedDiscount.toFixed(2)}</span>
                                </div>
                            )}
                            <div
                                className={`${styles.summaryRow} ${styles.totalRow}`}
                            >
                                <span>Final Total</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                            <button
                                className={styles.checkoutButton}
                                onClick={handleCheckout}
                                disabled={!order?.items?.length}
                            >
                                Proceed To Checkout
                            </button>
                        </div>
                    </div>

                    <div className={styles.couponSection}>
                        <div
                            className={styles.couponInputWrapper}
                            ref={couponRef}
                        >
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                onFocus={() => setShowCoupons(true)}
                                className={styles.couponInput}
                            />
                            {showCoupons &&
                                getApplicableCoupons(total).length > 0 && (
                                    <div className={styles.couponDropdown}>
                                        {getApplicableCoupons(total).map(
                                            (coupon) => (
                                                <div
                                                    key={coupon.code}
                                                    className={
                                                        styles.couponOption
                                                    }
                                                    onClick={() =>
                                                        handleCouponSelect(
                                                            coupon
                                                        )
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.couponCode
                                                        }
                                                    >
                                                        {coupon.code}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.couponDiscount
                                                        }
                                                    >
                                                        Save ₹{coupon.discount}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                        </div>
                        <button
                            className={styles.applyCoupon}
                            onClick={handleApplyCoupon}
                            disabled={!couponCode}
                        >
                            Apply Coupon
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Cart;

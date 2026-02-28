import { loadStripe } from '@stripe/stripe-js';
import api from './api';

let stripePromise;

export function getStripe () {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

export async function redirectToCheckout (plan) {
  const { data } = await api.post('/stripe/checkout', { plan });
  window.location.href = data.url;
}

export async function redirectToPortal () {
  const { data } = await api.post('/stripe/portal');
  window.location.href = data.url;
}

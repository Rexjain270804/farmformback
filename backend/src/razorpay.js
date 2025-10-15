import Razorpay from 'razorpay'

export function createRazorpay({ key_id, key_secret }) {
  if (!key_id || !key_secret) throw new Error('Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
  return new Razorpay({ key_id, key_secret })
}

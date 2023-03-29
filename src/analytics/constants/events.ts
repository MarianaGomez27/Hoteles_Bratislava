import { defineActions } from '../analytics.helpers';

export const events = {
  Account: defineActions(
    'Begin Signup',
    'Created',
    'Login Success',
    'Login Failed',
    'Reset Password',
    'Reset Password Wrong Email',
    'Reset Password Fail',
    'Confirm Password',
    'Confirm Password Fail',
  ),
  Order: defineActions('Opened', 'Agreed', 'Fulfilled'),
};

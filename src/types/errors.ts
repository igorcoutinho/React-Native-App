export enum ErrorCodes {
  EmailNotVerified = 'auth/email-not-verified',
  MultiFactorAuthNotEnrolled = 'auth/multi-factor-auth-required',
  EmailNotFound = 'auth/user-not-found',
  InvalidPassword = 'auth/wrong-password',
}

export enum ErrorMessages {
  EmailNotVerified = 'Email not verified, please check your email for a verification link.',
  MultiFactorAuthNotEnrolled = 'Multi-factor authentication not enrolled, please use your phone number to enroll.',
  EmailNotFound = 'Email not found',
  InvalidPassword = 'Invalid password',
}

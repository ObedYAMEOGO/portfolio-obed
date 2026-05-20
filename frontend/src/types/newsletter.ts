export type NewsletterState = {
  success: boolean;
  message: string;
};

export const initialNewsletterState: NewsletterState = {
  success: false,
  message: "",
};
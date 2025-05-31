# Custom Email Verification with AWS Cognito

This project includes a custom email verification page for AWS Cognito. The verification process works as follows:

1. When a user registers, AWS Cognito sends a verification email with a link
2. The link points to our custom verification page at `/auth/verify-email`
3. The page processes verification parameters from the URL and shows a success or error message
4. After verification, the user is redirected to the login page

## Setting up Custom Verification in AWS Cognito

To configure AWS Cognito to use your custom verification page:

1. Go to the AWS Management Console
2. Navigate to Cognito > User Pools > [Your User Pool] > App integration > Messaging
3. Under "Email", select "Customize" for verification emails
4. Copy the contents of `email-verification-template.html` into the HTML section
5. Copy the contents of `email-verification-template-text.txt` into the Text section
6. Replace all instances of `https://yourdomain.com` with your actual domain
7. Replace the logo URL with your actual logo URL
8. Save changes

Make sure the verification link in both templates includes:

- Your domain (e.g., `https://yourdomain.com/auth/verify-email`)
- The code parameter: `code={####}`
- The username parameter: `username={username}`

## Important Notes

- Ensure your frontend application is deployed to the URL you specify in the email template
- The `code` and `username` parameters are required for the verification to work
- For local development, you may need to add your localhost URL to the allowed callback URLs in Cognito
- AWS Cognito replaces `{####}` with the actual verification code
- AWS Cognito replaces `{username}` with the user's username/email
- AWS Cognito replaces `{current_year}` with the current year

## Local Development

For testing the verification flow locally:

1. Update the Cognito configuration to include your local URL (e.g., `http://localhost:5173/auth/verify-email`)
2. After registering, check the verification email and click the link
3. The app will process the parameters and display the appropriate status

## Customizing the Template

You can customize the email templates to match your brand:

- Change colors in the style section of the HTML template
- Update the messaging and copy to match your voice and tone
- Add additional branding elements as needed

## Troubleshooting

If verification fails:

- Check that the URL parameters are being passed correctly
- Ensure the verification code is not expired (typically valid for 24 hours)
- Verify that your Cognito configuration is properly set up
- Check that the email template is correctly formatted

import { UserProfile } from '@clerk/nextjs';

export default function ClerkProfile() {
    return (
        <UserProfile 
                          path="/profile"
                          routing="hash"
                          className="w-full"
                          appearance={{
                            elements: {
                              rootBox: {
                                width: 'auto',
                                maxWidth: '600px',
                                boxShadow: 'none', 
                              },
                              card: {
                                width: '80%',
                                maxWidth: '80%',
                                boxShadow: 'none',
                                padding: '24px', // Remove internal padding if needed
                              },
                              profilePage: {
                                width: '100%',
                                maxWidth: '100%',
                              },
                              profilePageContainer: { 
                                padding: '16px',
                              }
                            },
                            variables: {
                              colorPrimary: '#E55B3C', 
                              colorPrimaryForeground: 'white', 
                              colorMutedForeground: 'black',
                              colorForeground: 'black',
                              colorBorder: '#E55B3C',
                            }
                            // --- END COLOR CUSTOMIZATION ---
                          }}
                        />
    );
}
import { UserProfile } from "@clerk/nextjs";

export default function Security() {

    return (
        <div className="px-5 h-[calc(100vh-150px)] md:h-[calc(100vh-200px)] overflow-auto">
            {/* Email Accesses */}
            <UserProfile 
                routing="hash"
                initialPath="/profile?tab=security"
                className='w-full'
                appearance={{
                    theme: 'simple',
                    elements: {
                        rootBox: {
                            width: 'auto',
                            maxWidth: '600px',
                            boxShadow: 'none', 
                        },
                        card: {
                            width: '100%',
                            maxWidth: '100%',
                            boxShadow: 'none',
                            padding: '24px',
                        },
                        profilePage: {
                            width: '100%',
                            maxWidth: '100%',
                            margin: '0 auto',
                        },
                        profilePageContainer: { 
                            width: '100%',
                            maxWidth: '100%',
                            padding: '0', // Remove container padding
                        },
                        //     profilePageContent: { 
                        //         width: '100%',
                        //         maxWidth: '100%',
                        //         padding: '0',
                        //     },
                        //     // 4. Target the sidebar to ensure it aligns correctly (optional but helpful)
                        //     profilePageSidebar: {
                        //         padding: '0',
                        //         maxWidth: '250px', // Example: Ensure sidebar doesn't take up too much width
                        //     },
                    },
                    variables: {
                        colorPrimary: '#E55B3C', 
                        colorPrimaryForeground: 'white', 
                        colorMutedForeground: 'black',
                        colorForeground: 'black',
                        colorBorder: '#E55B3C',
                    }
                }}
            />
        </div>
    );
}
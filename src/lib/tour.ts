import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const setupTour = () => {
  return driver({
    showProgress: true,
    animate: true,
    overlayColor: '#00000080',
    doneBtnText: 'Finish Tour',
    nextBtnText: 'Next',
    prevBtnText: 'Back',
    steps: [
      {
        element: '#app-container',
        popover: {
          title: 'Welcome to ChatApp!',
          description: 'Let me show you around the app to help you get started.',
          align: 'center',
        }
      },
      {
        element: '#search-bar',
        popover: {
          title: 'Search Users',
          description: 'Search for users to start new conversations or find existing chats.',
          side: 'bottom',
        }
      },
      {
        element: '#update-profile-button',
        popover: {
          title: 'Update Profile',
          description: 'Click here to update your username and deactivate account permanently.',
          side: 'bottom',
        }
      },
      {
        element: '#theme-toggle',
        popover: {
          title: 'Switch Themes',
          description: 'Toggle between light and dark mode for comfortable chatting at any time.',
          side: 'bottom',
        }
      },
      {
        element: '#logout-button',
        popover: {
          title: 'Log Out',
          description: 'Click here when you want to securely sign out of your account.',
          side: 'bottom',
        }
      },
      {
        element: '#user-profile',  // Your profile element (showing username/email)
        popover: {
          title: 'Your Profile',
          description: 'This shows your account information including username and email.',
          side: 'bottom',
        }
      },
      {
        element: '#new-chat-button',
        popover: {
          title: 'Start New Chat',
          description: 'Click here to begin a new conversation with any user.',
          side: 'bottom',
        }
      },
      {
        element: '#sidebar',
        popover: {
          title: 'Navigation Panel',
          description: 'Access all conversations and features from this sidebar.',
          side: 'right',
        }
      },
    //   {
    //     element: '#chat-list',
    //     popover: {
    //       title: 'Recent Chats',
    //       description: 'Your most recent conversations appear here for quick access.',
    //       side: 'right',
    //     }
    //   },
      {
        element: '#message-input',
        popover: {
          title: 'Send Messages',
          description: 'Type your message here and press Enter or click Send to chat.',
          side: 'top',
        }
      },
      {
        element: '#chatbot-button',
        popover: {
          title: 'AI Assistant',
          description: 'Get instant help from our AI assistant for any questions.',
          side: 'top',
        }
      }
    ],
    onDestroyed: () => {
      localStorage.setItem('hasCompletedTour', 'true');
    },
    onCloseClick: () => {
      localStorage.setItem('hasSkippedTour', 'true');
    }
  });
};
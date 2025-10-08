const en = {
  metadata: {
    title: 'Cloudflare + Next.js starter',
    description: 'Check your Cloudflare bindings with a shadcn/ui dashboard.',
  },
  localeSwitcher: {
    label: 'Language',
    options: {
      en: 'English',
      zh: '中文',
    },
  },
  home: {
    hero: {
      title: 'Cloudflare + Next.js starter kit',
      description:
        'Inspect your Cloudflare bindings, validate connections, and ship with confidence using a refreshed dashboard powered by shadcn/ui components.',
      primaryCta: 'Deploy to Cloudflare Workers',
      secondaryCta: 'View Cloudflare guide',
    },
    resourceLinks: {
      cloudflareWorkers: {
        title: 'Cloudflare Workers',
        description: 'Deploy your Next.js application to the edge with the Workers platform.',
      },
      openNext: {
        title: 'OpenNext for Cloudflare',
        description: 'Learn how OpenNext builds optimized Workers bundles for Next.js projects.',
      },
      nextDocs: {
        title: 'Next.js Documentation',
        description: 'Brush up on the App Router, server components, and streaming UI.',
      },
    },
    resourceCta: 'Explore',
    footer: {
      tagline: 'Built with Next.js, OpenNext, and Cloudflare Workers — ready for your next deployment.',
      learnNextJs: 'Learn Next.js',
      exploreTemplates: 'Explore templates',
      visitNextJs: 'Visit nextjs.org',
    },
  },
  components: {
    d1StatusCard: {
      title: 'Cloudflare D1',
      statuses: {
        idle: {
          label: 'Idle',
          message: 'Click the button to verify your D1 connection.',
        },
        checking: {
          label: 'Checking',
          message: 'Checking database connection...',
        },
        connected: {
          label: 'Connected',
          message: 'Connected! The database responded with the timestamp below.',
        },
        error: {
          label: 'Error',
        },
      },
      timestampSuffix: '(UTC)',
      errors: {
        fetchFailed: 'Failed to read from D1. Please try again.',
      },
      button: {
        idle: 'Check now',
        loading: 'Checking...',
      },
    },
    kvStatusCard: {
      title: 'Cloudflare KV',
      statuses: {
        idle: {
          label: 'Idle',
          message: 'Click the button to list a few keys from your KV namespace.',
        },
        checking: {
          label: 'Checking',
          message: 'Querying KV namespace...',
        },
        connectedEmpty: {
          label: 'Connected',
          message: 'Connected! The namespace is currently empty.',
        },
        connectedWithItems: {
          label: 'Connected',
          message: 'Connected! Showing {count} {itemLabel} from the namespace.',
        },
        error: {
          label: 'Error',
        },
      },
      countLabel: {
        one: 'key',
        other: 'keys',
      },
      errors: {
        fetchFailed: 'Failed to query KV. Please try again.',
      },
      listNotComplete: 'Showing the first {count} items. Add a prefix or pagination to fetch more.',
      expirationLabel: 'Expires {date}',
      button: {
        idle: 'List keys',
        loading: 'Checking...',
      },
    },
    r2StatusCard: {
      title: 'Cloudflare R2',
      statuses: {
        idle: {
          label: 'Idle',
          message: 'Click the button to list a few objects from your R2 bucket.',
        },
        checking: {
          label: 'Checking',
          message: 'Querying R2 bucket...',
        },
        connectedEmpty: {
          label: 'Connected',
          message: 'Connected! The bucket is currently empty.',
        },
        connectedWithItems: {
          label: 'Connected',
          message: 'Connected! Showing {count} {itemLabel} from the bucket.',
        },
        error: {
          label: 'Error',
        },
      },
      countLabel: {
        one: 'object',
        other: 'objects',
      },
      objectSize: '{size} bytes',
      objectUploadedAt: 'uploaded {date}',
      errors: {
        fetchFailed: 'Failed to read from R2. Please try again.',
      },
      truncatedNotice: 'Showing the first {count} items. Add a prefix or pagination to fetch more.',
      button: {
        idle: 'List objects',
        loading: 'Checking...',
      },
    },
    authStatusCard: {
      title: 'Better Auth',
      statuses: {
        checking: {
          label: 'Checking',
          description: 'Checking current login session...',
        },
        loggedIn: {
          label: 'Logged in',
          description: 'Welcome back, {email}',
        },
        loggedOut: {
          label: 'Logged out',
          description: 'You are not logged in yet.',
        },
      },
      verification: {
        verified: {
          label: 'Email verified',
          message: 'Your email address has been verified. All features are unlocked.',
        },
        pending: {
          label: 'Verification pending',
          message: 'We sent a verification email when you signed up. Please complete it to unlock all features.',
        },
      },
      errors: {
        missingCredentials: 'Please provide both email and password.',
        unknown: 'Unknown error',
      },
      info: {
        signedIn: 'Signed in successfully.',
        accountCreated: 'Account created successfully.',
      },
      fields: {
        emailLabel: 'Email',
        passwordLabel: 'Password',
        emailPlaceholder: 'you@example.com',
        passwordPlaceholder: 'Enter a secure password',
      },
      buttons: {
        signOut: 'Sign out',
        signOutLoading: 'Signing out...',
        signIn: 'Sign in',
        signInLoading: 'Signing in...',
        createAccount: 'Create account',
        createAccountLoading: 'Creating account...',
      },
    },
    sentryStatusCard: {
      title: 'Sentry',
      statuses: {
        idle: {
          label: 'Idle',
          message: 'Trigger a synthetic error to confirm Sentry is receiving events from this worker.',
        },
        triggering: {
          label: 'Triggering',
          message: 'Sending a test error to Sentry...',
        },
        reported: {
          label: 'Reported',
          message: 'Test error dispatched. Check Sentry for the captured event.',
        },
        failed: {
          label: 'Failed',
          message: 'Unable to trigger the Sentry test event.',
        },
      },
      errors: {
        requestFailed: 'Failed to reach the Sentry test endpoint. Please try again.',
      },
      successWithoutError: 'Request succeeded but no error was triggered. Verify your worker configuration.',
      paragraphs: {
        intro: {
          part1: 'The button below calls ',
          part2: ', which intentionally throws and reports an error using the ',
          part3: ' SDK.',
        },
        followup: {
          part1:
            'After triggering the event, open your Sentry dashboard to verify that the issue appears along with a span named ',
          span: 'status-card.debug-sentry',
          part2: '.',
        },
      },
      button: {
        idle: 'Send test event',
        loading: 'Triggering...',
      },
    },
  },
};

export default en;

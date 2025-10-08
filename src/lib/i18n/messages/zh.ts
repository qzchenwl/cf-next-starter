const zh = {
  metadata: {
    title: 'Cloudflare + Next.js 启动模板',
    description: '使用基于 shadcn/ui 的仪表盘检查你的 Cloudflare 绑定。',
  },
  localeSwitcher: {
    label: '语言',
    options: {
      en: 'English',
      zh: '简体中文',
    },
  },
  home: {
    hero: {
      title: 'Cloudflare + Next.js 启动套件',
      description: '使用基于 shadcn/ui 的全新仪表盘检查 Cloudflare 绑定、验证连接并自信发布。',
      primaryCta: '部署到 Cloudflare Workers',
      secondaryCta: '查看 Cloudflare 指南',
    },
    resourceLinks: {
      cloudflareWorkers: {
        title: 'Cloudflare Workers',
        description: '通过 Workers 平台将你的 Next.js 应用部署到边缘。',
      },
      openNext: {
        title: 'Cloudflare 的 OpenNext',
        description: '了解 OpenNext 如何为 Next.js 项目构建优化的 Workers 包。',
      },
      nextDocs: {
        title: 'Next.js 文档',
        description: '复习 App Router、服务端组件与流式界面。',
      },
    },
    resourceCta: '查看',
    footer: {
      tagline: '基于 Next.js、OpenNext 与 Cloudflare Workers 构建，随时准备下一次部署。',
      learnNextJs: '学习 Next.js',
      exploreTemplates: '浏览模板',
      visitNextJs: '访问 nextjs.org',
    },
  },
  components: {
    d1StatusCard: {
      title: 'Cloudflare D1',
      statuses: {
        idle: {
          label: '空闲',
          message: '点击按钮验证你的 D1 连接。',
        },
        checking: {
          label: '检查中',
          message: '正在检查数据库连接…',
        },
        connected: {
          label: '已连接',
          message: '已连接！数据库返回了下面的时间戳。',
        },
        error: {
          label: '错误',
        },
      },
      timestampSuffix: '（UTC）',
      errors: {
        fetchFailed: '读取 D1 失败，请重试。',
      },
      button: {
        idle: '立即检查',
        loading: '检查中…',
      },
    },
    kvStatusCard: {
      title: 'Cloudflare KV',
      statuses: {
        idle: {
          label: '空闲',
          message: '点击按钮列出 KV 命名空间中的部分键。',
        },
        checking: {
          label: '检查中',
          message: '正在查询 KV 命名空间…',
        },
        connectedEmpty: {
          label: '已连接',
          message: '已连接！命名空间目前为空。',
        },
        connectedWithItems: {
          label: '已连接',
          message: '已连接！展示命名空间中的 {count} {itemLabel}。',
        },
        error: {
          label: '错误',
        },
      },
      countLabel: {
        one: '个键',
        other: '个键',
      },
      errors: {
        fetchFailed: '查询 KV 失败，请重试。',
      },
      listNotComplete: '仅展示前 {count} 个项目。请添加前缀或分页以获取更多内容。',
      expirationLabel: '过期时间 {date}',
      button: {
        idle: '列出键',
        loading: '检查中…',
      },
    },
    r2StatusCard: {
      title: 'Cloudflare R2',
      statuses: {
        idle: {
          label: '空闲',
          message: '点击按钮列出 R2 存储桶中的部分对象。',
        },
        checking: {
          label: '检查中',
          message: '正在查询 R2 存储桶…',
        },
        connectedEmpty: {
          label: '已连接',
          message: '已连接！存储桶目前为空。',
        },
        connectedWithItems: {
          label: '已连接',
          message: '已连接！展示存储桶中的 {count} {itemLabel}。',
        },
        error: {
          label: '错误',
        },
      },
      countLabel: {
        one: '个对象',
        other: '个对象',
      },
      objectSize: '{size} 字节',
      objectUploadedAt: '上传时间 {date}',
      errors: {
        fetchFailed: '读取 R2 失败，请重试。',
      },
      truncatedNotice: '仅展示前 {count} 个项目。请添加前缀或分页以获取更多内容。',
      button: {
        idle: '列出对象',
        loading: '检查中…',
      },
    },
    authStatusCard: {
      title: 'Better Auth',
      statuses: {
        checking: {
          label: '检查中',
          description: '正在检查当前登录会话…',
        },
        loggedIn: {
          label: '已登录',
          description: '欢迎回来，{email}',
        },
        loggedOut: {
          label: '未登录',
          description: '你尚未登录。',
        },
      },
      verification: {
        verified: {
          label: '邮箱已验证',
          message: '你的邮箱地址已验证，全部功能已解锁。',
        },
        pending: {
          label: '待验证',
          message: '我们在你注册时发送了验证邮件，请完成验证以解锁全部功能。',
        },
      },
      errors: {
        missingCredentials: '请同时填写邮箱和密码。',
        unknown: '未知错误',
      },
      info: {
        signedIn: '登录成功。',
        accountCreated: '账号创建成功。',
      },
      fields: {
        emailLabel: '邮箱',
        passwordLabel: '密码',
        emailPlaceholder: 'you@example.com',
        passwordPlaceholder: '输入安全的密码',
      },
      buttons: {
        signOut: '退出登录',
        signOutLoading: '正在退出…',
        signIn: '登录',
        signInLoading: '正在登录…',
        createAccount: '创建账号',
        createAccountLoading: '正在创建账号…',
      },
    },
    sentryStatusCard: {
      title: 'Sentry',
      statuses: {
        idle: {
          label: '空闲',
          message: '触发一次模拟错误，以确认 Sentry 正在接收来自此 Worker 的事件。',
        },
        triggering: {
          label: '触发中',
          message: '正在向 Sentry 发送测试错误…',
        },
        reported: {
          label: '已上报',
          message: '测试错误已发送。请在 Sentry 中查看捕获的事件。',
        },
        failed: {
          label: '失败',
          message: '无法触发 Sentry 测试事件。',
        },
      },
      errors: {
        requestFailed: '无法访问 Sentry 测试端点，请重试。',
      },
      successWithoutError: '请求成功但未触发错误。请检查你的 Worker 配置。',
      paragraphs: {
        intro: {
          part1: '下方的按钮会调用 ',
          part2: '，它会使用 ',
          part3: ' SDK 主动抛错并上报事件。',
        },
        followup: {
          part1: '触发后，请打开你的 Sentry 仪表盘，确认问题以及名为 ',
          span: 'status-card.debug-sentry',
          part2: ' 的跨度是否出现。',
        },
      },
      button: {
        idle: '发送测试事件',
        loading: '触发中…',
      },
    },
  },
};

export default zh;

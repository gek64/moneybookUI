interface ViteTypeOptions {
    // 将 ImportMetaEnv 中类型检查设置为严格, 不允许 unknown
    strictImportMetaEnv: unknown
}

// 定义 .env.[mode] 中环境变量类型
interface ImportMetaEnv {
    readonly VITE_SERVER_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
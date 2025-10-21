import type {ACCOUNT} from "../types/account.ts"

const singleUrl = new URL("/account", import.meta.env.VITE_SERVER_BASE_URL).toString()
const multipleUrl = new URL("/accounts", import.meta.env.VITE_SERVER_BASE_URL).toString()

async function API_createAccount(accountBody: ACCOUNT): Promise<ACCOUNT> {
    const resp = await fetch(singleUrl, {
        method: "POST",
        body: JSON.stringify(accountBody),
    })
    return await resp.json()
}

async function API_updateAccount(accountBody: ACCOUNT): Promise<ACCOUNT> {
    const resp = await fetch(singleUrl, {
        method: "PUT",
        body: JSON.stringify(accountBody),
    })
    return await resp.json()
}

async function API_deleteAccounts(ids: string[]): Promise<{ count: number }> {
    const resp = await fetch(multipleUrl, {
        method: "DELETE",
        body: JSON.stringify({params: {"ids": ids}}),
    })
    return await resp.json()
}

async function API_readAccounts(): Promise<ACCOUNT[]> {
    const resp = await fetch(multipleUrl, {
        method: "GET",
    })
    return await resp.json()
}

export {
    API_createAccount,
    API_updateAccount,
    API_deleteAccounts,
    API_readAccounts
}